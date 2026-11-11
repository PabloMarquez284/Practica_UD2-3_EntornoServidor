// Importaciones
import 'express-session';

// Tipos Unión
type Rol = 'admin' | 'usuario';
type Turno = 'manana' | 'tarde';
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

// Definición interfaz de repositorio de reservas
interface RepositorioReservas {
    obtenerTodas(): Reserva[];
    obtenerPorId(id: number): Reserva | undefined;
    obtenerPorUsuario(usuarioId: number): Reserva[];
    buscarReservaActiva(equipoId: number, fecha: string, turno: Turno): Reserva | undefined;
    crear(reserva: Omit<Reserva, 'id'>): Reserva; // Recibe la reserva sin usar el ID
    actualizarEstado(id: number, estado: EstadoReserva): Reserva | undefined;
}

// Definición interfaz de repositorio de usuarios
interface RepositorioUsuarios {
    obtenerPorId(id: number): Usuario | undefined;
    obtenerPorEmail(email: string): Usuario | undefined;
    crear(usuario: Omit<Usuario, 'id'>): Usuario; // Recibe el usuario sin usar el ID
}

// Definicion interfaz de repositoio de equipos
interface RepositorioEquipos {
    obtenerTodos(): Equipo[];
    obtenerPorId(id: number): Equipo | undefined;
    crear(equipo: Omit<Equipo, 'id'>): Equipo; // Recibe el equipo sin usar el ID
    actualizarEstado(id: number, estado: EstadoEquipo): Equipo | undefined;
}

// Extensión para incluir el aviso en la sesión de Express
declare module 'express-session' {
    interface SessionData {
        aviso?: string;
        usuarioId?: number; // ID del usuario autenticado
    }
}

// Exportacion de tipos e interfaces
export type { Rol, Turno, EstadoEquipo, EstadoReserva, TipoEquipo };
export type { Equipo, Reserva, Usuario, RepositorioReservas, RepositorioUsuarios, RepositorioEquipos };