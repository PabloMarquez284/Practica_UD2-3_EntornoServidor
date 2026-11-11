// Importaciones
import { ReservaControlador } from '../controllers/reservaControlador.js';
import { Router } from 'express';

// Crear función exportada que recibe un objeto de tipo ReservaControlador y devuelve un enrutador de Express
export function crearRutasReserva(controlador: ReservaControlador) {
    // Crear un enrutador de Express
    const router = Router();

    // Definir rutas y asociarlas con los métodos del controlador
    router.get('/reservas', controlador.obtenerReservas);
    router.post('/reservas', controlador.crearReserva);
    router.post('/reservas/:id/cancelar', controlador.cancelarReserva);

    // Devolver el enrutador configurado
    return router;
}