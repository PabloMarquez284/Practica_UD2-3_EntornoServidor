import bcrypt from 'bcrypt';
import { Usuario, RepositorioUsuarios } from '../types/index.js';
import { ErrorDominio } from '../domain/errorDominio.js'; // Ajusta la ruta a tu ErrorDominio si difiere

export class UsuarioServicio {
    constructor(private usuarioRepositorio: RepositorioUsuarios) {}

    // Registro de usuarios (siempre asigna rol 'usuario')
    async registrar(nombre: string, email: string, password: string): Promise<Usuario> {
        if (!nombre || !email || !password) {
            throw new ErrorDominio('DATOS_INVALIDOS', 'Todos los campos son obligatorios');
        }

        const existe = this.usuarioRepositorio.obtenerPorEmail(email);
        if (existe) {
            throw new ErrorDominio('EMAIL_DUPLICADO', 'El correo electrónico ya está registrado');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        return this.usuarioRepositorio.crear({
            nombre,
            email,
            passwordHash,
            rol: 'usuario'
        });
    }

    // Autenticación / Login
    async autenticar(email: string, password: string): Promise<Usuario> {
        if (!email || !password) {
            throw new ErrorDominio('DATOS_INVALIDOS', 'Debe proporcionar email y contraseña');
        }

        const usuario = this.usuarioRepositorio.obtenerPorEmail(email);
        
        // Requisito de seguridad: No revelar si el correo existe o no
        if (!usuario) {
            throw new ErrorDominio('CREDENCIALES_INVALIDAS', 'Credenciales incorrectas');
        }

        const esValida = await bcrypt.compare(password, usuario.passwordHash);
        if (!esValida) {
            throw new ErrorDominio('CREDENCIALES_INVALIDAS', 'Credenciales incorrectas');
        }

        return usuario;
    }

    // Obtener usuario por ID (para el perfil o middleware)
    obtenerPorId(id: number): Usuario | undefined {
        return this.usuarioRepositorio.obtenerPorId(id);
    }
}