// Importaciones
import { Router } from 'express';
import { AuthControlador } from '../controllers/authControlador.js';

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

    return router;
}