// Importaciones
import { Router } from 'express';
import { AuthControlador } from '../controllers/authControlador.js';
import { loginLimiter } from '../middlewares/rateLimitMiddleware.js';

// Crear funcion para las autenticaciones
export function crearAuthRutas(authControlador: AuthControlador): Router {
    const router = Router();

    // Formularios GET
    router.get('/registro', authControlador.mostrarRegistro.bind(authControlador));
    router.get('/login', authControlador.mostrarLogin.bind(authControlador));

    // Acciones POST
    router.post('/registro', authControlador.registro.bind(authControlador));
    router.post('/login', authControlador.login.bind(authControlador));
    router.post('/logout', authControlador.logout.bind(authControlador));
    router.post('/login', loginLimiter, authControlador.login.bind(authControlador));

    return router;
}