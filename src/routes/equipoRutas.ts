// Importaciones
import { Router } from 'express';
import { EquipoServicio } from '../services/equipoServicio.js';

// Función para una ruta de equipos
export function crearEquipoRutas(equipoServicio: EquipoServicio): Router {
    const router = Router();

    // GET /equipos (con soporte para cookie de preferencia)
    router.get('/equipos', (req, res) => {
        // 1. Capturar query de la URL (?preferencia=portatil)
        const preferenciaQuery = req.query.preferencia as string;
        
        if (preferenciaQuery && (preferenciaQuery === 'portatil' || preferenciaQuery === 'sobremesa')) {
            res.cookie('preferencia_equipo', preferenciaQuery, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
                httpOnly: true,
                sameSite: 'lax'
            });
        }

        // 2. Leer la preferencia (de la query actual o de la cookie guardada en el navegador)
        const preferenciaActiva = preferenciaQuery || req.cookies?.preferencia_equipo;

        // 3. Consultar los equipos filtrados
        const equipos = equipoServicio.obtenerFiltrados(preferenciaActiva);

        // 4. Renderizar la plantilla
        res.render('equipos/index', {
            vm: { equipos, preferencia: preferenciaActiva }
        });
    });

    return router;
}