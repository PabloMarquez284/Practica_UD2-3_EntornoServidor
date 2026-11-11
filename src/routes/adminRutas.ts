// Importaciones
import { Router } from 'express';
import { EquipoServicio } from '../services/equipoServicio.js';
import { ReservaServicio } from '../services/reservaServicio.js';
import { RepositorioUsuarios } from '../types/index.js';
import { requerirAutenticacion, requerirRol } from '../middlewares/authMiddleware.js';

// Función para rutas de administrador
export function crearAdminRutas(
    equipoServicio: EquipoServicio,
    reservaServicio: ReservaServicio,
    usuarioRepositorio: RepositorioUsuarios
): Router {
    const router = Router();

    // Middleware global para todas las rutas /admin: Autenticado AND Rol 'admin'
    router.use(requerirAutenticacion);
    router.use(requerirRol('admin', usuarioRepositorio));

    // GET /admin/equipos - Ver y crear equipos
    router.get('/equipos', (req, res) => {
        const equipos = equipoServicio.obtenerFiltrados();
        res.render('admin/equipos', { vm: { equipos, aviso: req.session.aviso } });
    });

    // POST /admin/equipos - Crear equipo
    router.post('/equipos', (req, res, next) => {
        try {
            const { nombre, codigo, tipo } = req.body;
            equipoServicio.crearEquipo(nombre, codigo, tipo);
            req.session.aviso = 'Equipo creado exitosamente.';
            res.redirect(303, '/admin/equipos');
        } catch (error) {
            next(error);
        }
    });

    // POST /admin/equipos/:id/estado - Cambiar estado (operativo / fuera_de_servicio)
    router.post('/equipos/:id/estado', (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const { estado } = req.body;
            equipoServicio.cambiarEstado(id, estado);
            req.session.aviso = 'Estado del equipo actualizado.';
            res.redirect(303, '/admin/equipos');
        } catch (error) {
            next(error);
        }
    });

    return router;
}