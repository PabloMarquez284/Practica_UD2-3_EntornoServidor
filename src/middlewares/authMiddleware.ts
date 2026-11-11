// Importaciones
import { Request, Response, NextFunction } from 'express';
import { RepositorioUsuarios } from '../types/index.js';
import { ErrorDominio } from '../domain/errorDominio.js';

// Verificar si el usuario está autenticado
export function requerirAutenticacion(req: Request, res: Response, next: NextFunction): void {
    if (!req.session || !req.session.usuarioId) {
        // Redirige al login usando 303 (PRG / Redirección limpia)
        return res.redirect(303, '/login');
    }
    next();
}

// Verificar el rol del usuario
export function requerirRol(rolRequerido: 'admin' | 'usuario', usuarioRepositorio: RepositorioUsuarios) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const usuarioId = req.session.usuarioId;

        if (!usuarioId) {
            return res.redirect(303, '/login');
        }

        const usuario = usuarioRepositorio.obtenerPorId(usuarioId);

        if (!usuario || usuario.rol !== rolRequerido) {
            // Error de dominio si el usuario autenticado no tiene permisos de admin
            return next(new ErrorDominio('NO_ENCONTRADO', 'Acceso denegado. Permisos insuficientes.'));
        }

        next();
    };
}