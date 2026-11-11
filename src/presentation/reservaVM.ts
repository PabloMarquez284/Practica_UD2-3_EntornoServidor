// Importaciones
import type { Reserva } from '../types/index.js';

// Función para generar una etiqueta descriptiva de una reserva
export function etiquetaReserva(reserva: Reserva): string {
    return `Reserva #${reserva.id} - Equipo ${reserva.equipoId} (${reserva.fecha} - ${reserva.turno})`;
}

// Modelo de vista para la pantalla de reservas
export function crearReservaVM({
    reservas,
    aviso = null, // Valor por defecto, null si no hay aviso
    errores = [] // Valor por defecto, array vacío si no hay errores
}: {
    reservas: Reserva[];
    aviso?: string | null; // Opcional, puede ser null si no hay aviso o undefined si no se proporciona
    errores?: string[]; // Opcional, puede ser un array vacío si no hay errores o undefined si no se proporciona
}) {
    return {
        titulo: 'Gestión de Reservas',
        listado: reservas.map(r => ({
            id: r.id,
            texto: etiquetaReserva(r),
            estado: r.estado,
            esActiva: r.estado === 'activa'})),
        aviso,
        errores
    };
}