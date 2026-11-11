// Importaciones
import { Equipo, Reserva, Turno } from '../types/index.js';

// Devolver la lista de equipos operativos usando filter
export function obtenerEquiposDisponibles(equipos: Equipo[]): Equipo[] {
    return equipos.filter(equipo => equipo.estado === 'operativo');
}

// Comprobar si un equipo concreto está ocupado en una fecha y turno dados usando some
export function estaReservado(
    reservas: Reserva[],
    equipoId: number,
    fecha: string,
    turno: Turno
): boolean {
    return reservas.some(reserva => 
        reserva.equipoId === equipoId &&
        reserva.fecha === fecha &&
        reserva.turno === turno &&
        reserva.estado === 'activa'
    );
}

// Validar la coherencia de los datos de reserva (fecha no vacía y equipo operativo)
export function validarReserva(
    equipos: Equipo[],
    equipoId: number,
    fecha: string
): { esValido: boolean; mensajeError?: string } {
    if (!fecha || fecha.trim() === '') {
        return { esValido: false, mensajeError: 'La fecha es obligatoria.' };
    }

    const equipo = equipos.find(eq => eq.id === equipoId);

    if (!equipo) {
        return { esValido: false, mensajeError: 'El equipo no existe.' };
    }

    if (equipo.estado !== 'operativo') {
        return { esValido: false, mensajeError: 'El equipo se encuentra fuera de servicio.' };
    }

    return { esValido: true };
}