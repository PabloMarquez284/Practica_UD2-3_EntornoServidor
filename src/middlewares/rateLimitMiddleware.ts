// Importaciones
import rateLimit from 'express-rate-limit';

// Limita las peticiones a /login para prevenir ataques de fuerza bruta
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
    max: 5, // Máximo 5 intentos por IP en ese intervalo
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo tras 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});