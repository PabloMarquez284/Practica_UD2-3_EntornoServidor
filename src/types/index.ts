// Tipos Unión
type Rol = 'admin' | 'usuario';
type Turno = 'mañana' | 'tarde';
type EstadoEquipo = 'operativo' | 'fuera de servicio';
type EstadoReserva = 'activa' | 'cancelada';
type TipoEquipo = 'portatil' | 'sobremesa';

// Definición de interfaces de dominio
interface Equipo {
    id: number;
    codigo: string;
    nombre: string;
    tipo: TipoEquipo;
    estado: EstadoEquipo;
}

interface Reserva {
    id: number;
    equipoId: number;
    usuarioId: number;
    fecha: string; // Formato esperado: "YYYY-MM-DD"
    turno: Turno;
    estado: EstadoReserva;
}

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    passwordHash: string;
    rol: Rol;
}

// Definición interfaces de repositorios
interface RepositorioReservas {
    obtenerTodas(): Reserva[];
    obtenerPorId(id: number): Reserva | undefined;
    obtenerPorUsuario(usuarioId: number): Reserva[];
    buscarReservaActiva(equipoId: number, fecha: string, turno: Turno): Reserva | undefined;
    crear(reserva: Omit<Reserva, 'id'>): Reserva; // Recibe la reserva sin usar el ID
    actualizarEstado(id: number, estado: EstadoReserva): Reserva | undefined;
}

// Exportación de tipos e interfaces
export type { Rol, Turno, EstadoEquipo, EstadoReserva, TipoEquipo };
export type { Equipo, Reserva, Usuario, RepositorioReservas };