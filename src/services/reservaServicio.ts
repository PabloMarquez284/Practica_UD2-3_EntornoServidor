// Importaciones
import type { RepositorioReservas, Reserva, Turno } from '../types/index.js';
import { ErrorDominio } from '../domain/errorDominio.js';

// Exportación de la clase reservaServicio
export class ReservaServicio {
    // Constructor que recibe un repositorio de reservas privado y de solo lectura
    constructor(private readonly repo: RepositorioReservas) {}

    // Método para obtener todas las reservas
    async obtenerTodas(): Promise<Reserva[]> {
        return this.repo.obtenerTodas();
    }

    // Método para obtener reservas de un usuario concreto
    async obtenerPorUsuario(usuarioId: number): Promise<Reserva[]> {
        return this.repo.obtenerPorUsuario(usuarioId);
    }

    // Método para crear una reserva
    async crearReserva(datos: {
        equipoId: number;
        usuarioId: number;
        fecha: string;
        turno: Turno;
    }): Promise<Reserva> {
        // Aplicar la regla de negocio, verificando si ya existe una reserva activa
        const ocupada = this.repo.buscarReservaActiva(datos.equipoId, datos.fecha, datos.turno);
        if (ocupada) {
            throw new ErrorDominio('NO_DISPONIBLE', 'El equipo ya está reservado para esa fecha y turno.');
        }

        // Guardar a través del repositorio
        return this.repo.crear({
        ...datos,
        estado: 'activa',
        });
    }

    // Método para cancelar una reserva
    async cancelarReserva(id: number, usuarioId: number): Promise<Reserva> {
        const reserva = this.repo.obtenerPorId(id);

        if (!reserva) {
            throw new ErrorDominio('NO_ENCONTRADO', 'La reserva no existe.');
        }

        // Regla de seguridad: Solo el usuario dueño de la reserva puede cancelarla
        if (reserva.usuarioId !== usuarioId) {
            throw new ErrorDominio('DATOS_INVALIDOS', 'No tienes permiso para cancelar esta reserva.');
        }

        if (reserva.estado === 'cancelada') {
            throw new ErrorDominio('DATOS_INVALIDOS', 'La reserva ya se encuentra cancelada.');
        }

        const actualizada = this.repo.actualizarEstado(id, 'cancelada');
        if (!actualizada) {
            throw new ErrorDominio('NO_ENCONTRADO', 'No se pudo actualizar la reserva.');
        }

        return actualizada;
    }
}