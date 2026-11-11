// Importaciones
import type { Request, Response, NextFunction } from 'express';
import { ReservaServicio } from '../services/reservaServicio.js';
import { crearReservaVM } from '../presentation/reservaVM.js';

// Exportación de la clase ReservaControlador
export class ReservaControlador {
    // Constructor que recibe un servicio de reservas privado y de solo lectura
    constructor(private readonly servicio: ReservaServicio) {}

    // Obtener todas las reservas y renderizar la vista correspondiente
    obtenerReservas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reservas = await this.servicio.obtenerTodas();

            // Obtener el aviso de la sesión si existe, o null si no
            const aviso = req.session?.aviso ?? null;
            
            // Limpiamos el aviso después de mostrarlo
            if (req.session) {
                delete req.session.aviso;
            }

            // Guardar el aviso en la sesión para mostrarlo en la vista
            req.session?.save(err => {
                // Manejo de error al guardar la sesión
                if (err) return next(err); 
                
                // Crear el modelo de vista y renderizar la plantilla
                const vm = crearReservaVM({ reservas: reservas || [], aviso: aviso });
                res.render('reservas/index', { vm });
            });
        } catch (err) {
            // Pasar el error al middleware de manejo de errores
            next(err);
        }
    };

    // Obtener SOLO las reservas del usuario autenticado (Para GET /mis-reservas)
    mostrarMisReservas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usuarioIdSession = req.session.usuarioId;
            if (!usuarioIdSession) {
                return res.redirect(303, '/login');
            }

            const reservas = await this.servicio.obtenerPorUsuario(usuarioIdSession);
            const aviso = req.session?.aviso ?? null;

            if (req.session) {
                delete req.session.aviso;
            }

            req.session?.save(err => {
                if (err) return next(err);

                const vm = crearReservaVM({ reservas: reservas || [], aviso: aviso });
                res.render('reservas/mis-reservas', { vm });
            });
        } catch (err) {
            next(err);
        }
    };

    // Crear una nueva reserva y manejar la respuesta
    crearReserva = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { equipoId, fecha, turno } = req.body;

            // Extraemos el usuarioId del servidor, para que no pueda ser manipulado por el usuario
            const usuarioIdSession = req.session.usuarioId;

            // Validación de los campos antes del servicio
            if (!equipoId || !fecha || !turno) {
                const reservas = await this.servicio.obtenerTodas();
                const vm = crearReservaVM({
                    reservas,
                    errores: ['Todos los campos son obligatorios.']
                });
                return res.status(400).render('reservas/index', { vm });
            }

            if (!usuarioIdSession) {
                return res.redirect(303, '/login');
            } 

            // Convertir los valores a los tipos esperados
            const equipoIdNum = Number.parseInt(equipoId, 10);

            // Validación de los campos numéricos
            if (Number.isNaN(equipoIdNum)) {
                const reservas = await this.servicio.obtenerTodas();
                const vm = crearReservaVM({
                    reservas,
                    errores: [ 'El identificador del equipo debe ser un número válido']
                });
                return res.status(400).render('reservas/index', { vm });
            }

            // Llamada al servicio para crear la reserva
            await this.servicio.crearReserva({
                equipoId: equipoIdNum,
                usuarioId: usuarioIdSession,
                fecha: String(fecha),
                turno
            });

            // Mensaje flash en sesión y redirección 303 (PRG)
            if (req.session) {
                req.session.aviso = 'Reserva creada correctamente.';
            }
            res.redirect(303, '/reservas');
        } catch (err) {
            next(err); // Si es un ErrorDominio, pasará al middleware de errores
        }
    };

    // Cancelar una reserva existente y manejar la respuesta
    cancelarReserva = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const usuarioIdSession = req.session.usuarioId;

            if (!usuarioIdSession) {
                return res.redirect(303, '/login');
            }

            // Pasamos tanto el id de la reserva como el id del usuario logueado
            await this.servicio.cancelarReserva(Number(id), usuarioIdSession);

            if (req.session) {
                req.session.aviso = 'Reserva cancelada correctamente.';
            }
            res.redirect(303, '/mis-reservas');
        } catch (err) {
            next(err);
        }
    };
}