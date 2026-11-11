// Importaciones
import { Request, Response, NextFunction } from 'express';
import { UsuarioServicio } from '../services/usuarioServicio.js';
import { ErrorDominio } from '../domain/errorDominio.js';

// Crear clase de autenticación
export class AuthControlador {
    constructor(private servicio: UsuarioServicio) {}

    // GET /registro
    public mostrarRegistro(req: Request, res: Response): void {
        const aviso = req.session.aviso;
        delete req.session.aviso;

        res.render('auth/registro', {
            vm: {
                aviso: aviso,
                errores: []
            }
        });
    }

    // GET /login
    public mostrarLogin(req: Request, res: Response): void {
        const aviso = req.session.aviso;
        delete req.session.aviso;

        res.render('auth/login', {
            vm: {
                aviso: aviso,
                errores: []
            }
        });
    }

    // POST /login
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validar credenciales con el servicio
            const usuario = await this.servicio.autenticar(email, password);

            // Regenerar sesión y guardar usuarioId
            req.session.regenerate((err) => {
                if (err) return next(err);

                req.session.usuarioId = usuario.id;
                req.session.aviso = `¡Bienvenido/a, ${usuario.nombre}!`;

                return res.redirect(303, '/reservas');
            });
        } catch (error) {
            // Si el error es de tipo ErrorDominio (credenciales o datos inválidos)
            if (error instanceof ErrorDominio) {
                req.session.aviso = error.message;
                return res.redirect(303, '/login');
            }
            // Si es un error no controlado (ej: fallo de base de datos), pasa al middleware centralizado
            next(error);
        }
    }

    // POST /registro
    public async registro(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { nombre, email, password } = req.body;

            await this.servicio.registrar(nombre, email, password);

            req.session.aviso = 'Registro completado con éxito. Ya puedes iniciar sesión.';
            return res.redirect(303, '/login');
        } catch (error) {
            if (error instanceof ErrorDominio) {
                req.session.aviso = error.message;
                return res.redirect(303, '/registro');
            }
            next(error);
        }
    }

    // POST /logout
    public logout(req: Request, res: Response, next: NextFunction): void {
        req.session.destroy((err) => {
            if (err) return next(err);
            
            // Borra la cookie de sesión del navegador
            res.clearCookie('connect.sid'); 

            return res.redirect(303, '/login');
        });
    }
}