// Importaciones
import { Request, Response, NextFunction } from 'express';
import { UsuarioServicio } from '../services/usuarioServicio.js';

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

    // POST /registro
    public async registro(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { nombre, email, password } = req.body;

            await this.servicio.registrar(nombre, email, password);

            req.session.aviso = 'Registro completado con éxito. Ya puedes iniciar sesión.';
            return res.redirect(303, '/login');
        } catch (error) {
            next(error);
        }
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

            // Regenerar sesión y guardar solo el usuarioId
            req.session.regenerate((err) => {
                if (err) return next(err);

                req.session.usuarioId = usuario.id;
                req.session.aviso = `¡Bienvenido/a, ${usuario.nombre}!`;

                return res.redirect(303, '/reservas');
            });
        } catch (error) {
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