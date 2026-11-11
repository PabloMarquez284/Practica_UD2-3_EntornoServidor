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
                const vm = crearReservaVM({ reservas, aviso });
                res.render('reservas/index', { vm });
            });
        } catch (err) {
            // Pasar el error al middleware de manejo de errores
            next(err);
        }
    };

    // Crear una nueva reserva y manejar la respuesta
    crearReserva = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { equipoId, usuarioId, fecha, turno } = req.body;

            // Validación de los campos antes del servicio
            if (!equipoId || !usuarioId || !fecha || !turno) {
                const reservas = await this.servicio.obtenerTodas();
                const vm = crearReservaVM({
                    reservas,
                    errores: ['Todos los campos son obligatorios.']
                });
                return res.status(400).render('reservas/index', { vm });
            }

            // Convertir los valores a los tipos esperados
            const equipoIdNum = Number.parseInt(equipoId, 10);
            const usuarioIdNum = Number.parseInt(usuarioId, 10);

            // Validación de los campos numéricos
            if (Number.isNaN(equipoIdNum) || Number.isNaN(usuarioIdNum)) {
                const reservas = await this.servicio.obtenerTodas();
                const vm = crearReservaVM({
                    reservas,
                    errores: ['Los campos "equipo" y "usuario" deben ser números válidos.']
                });
                return res.status(400).render('reservas/index', { vm });
            }

            // Llamada al servicio para crear la reserva
            await this.servicio.crearReserva({
                equipoId: equipoIdNum,
                usuarioId: usuarioIdNum,
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
            await this.servicio.cancelarReserva(Number(id));

            if (req.session) {
                req.session.aviso = 'Reserva cancelada correctamente.';
            }
            res.redirect(303, '/reservas');
        } catch (err) {
            next(err);
        }
    };
}