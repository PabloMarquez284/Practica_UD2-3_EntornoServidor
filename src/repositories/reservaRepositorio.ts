// Importaciones necesarias
import { Reserva, Turno, EstadoReserva, RepositorioReservas } from '../types/index.js'; // Ponemos index.js porque TypeScript compila a JavaScript y el archivo resultante será index.js

// Exportación de la clase ReservaRepositorio que implementa la interfaz RepositorioReservas
export class ReservaRepositorio implements RepositorioReservas {
    private reservas: Map<number, Reserva> = new Map();
    private proximoId: number = 1;

    // Constructor con datos de prueba iniciales
    constructor() {
        this.crear({ equipoId: 1, usuarioId: 1, fecha: '2026-06-01', turno: 'mañana', estado: 'activa' });
        this.crear({ equipoId: 2, usuarioId: 2, fecha: '2025-05-02', turno: 'tarde', estado: 'activa' });
        this.crear({ equipoId: 1, usuarioId: 3, fecha: '2024-04-03', turno: 'mañana', estado: 'cancelada' });
    }

    // Implementación de métodos del repositorio
    obtenerTodas(): Reserva[] {
        return Array.from(this.reservas.values());
    }

    obtenerPorId(id: number): Reserva | undefined {
        return this.reservas.get(id);
    }

    obtenerPorUsuario(usuarioId: number): Reserva[] {
        return Array.from(this.reservas.values()).filter(reserva => reserva.usuarioId === usuarioId);
    }

    buscarReservaActiva(equipoId: number, fecha: string, turno: Turno): Reserva | undefined {
        return Array.from(this.reservas.values()).find(reserva =>
            reserva.equipoId === equipoId && reserva.fecha === fecha && reserva.turno === turno && reserva.estado === 'activa'
        );
    }

    crear(reserva: Omit<Reserva, 'id'>): Reserva {
        const nuevaReserva: Reserva = { ...reserva, id: this.proximoId++ };
        this.reservas.set(nuevaReserva.id, nuevaReserva);
        return nuevaReserva;
    }

    actualizarEstado(id: number, estado: EstadoReserva): Reserva | undefined {
        const reserva = this.reservas.get(id);
        if (reserva) {
            reserva.estado = estado;
            this.reservas.set(id, reserva);
        }
        return reserva;
    }
}