// Importaciones
import bcrypt from 'bcrypt';
import { Usuario, RepositorioUsuarios} from '../types/index.js'; // Ponemos index.js porque TypeScript compila a JavaScript y el archivo resultante será index.js

// Exportación de la clase UsuarioRepositorio que implementa la interfaz RepositorioUsuarios
export class UsuarioRepositorio implements RepositorioUsuarios {
    private usuarios: Map<number, Usuario> = new Map();
    private proximoId: number = 1;

    constructor() {
        // Generación de un hash de contraseña para los usuarios de prueba
        const hashPrueba = bcrypt.hashSync('123456', 10);

        // Administrador
        this.crear({
            nombre: 'Fernando Alonso',
            email: 'admin@example.com',
            passwordHash: hashPrueba,
            rol: 'admin'
        });

        // Usuario 1
        this.crear({
            nombre: 'Javier Luque',
            email: 'javier@example.com',
            passwordHash: hashPrueba,
            rol: 'usuario'
        });

        // Usuario 2
        this.crear({
            nombre: 'Enrique Medina',
            email: 'enrique@example.com',
            passwordHash: hashPrueba,
            rol: 'usuario'
        });
    }

    // Buscar un usuario por su ID
    obtenerPorId(id: number): Usuario | undefined {
        return this.usuarios.get(id);
    }

    // Buscar un usuario por su Email (útil para el login y comprobación de duplicados)
    obtenerPorEmail(email: string): Usuario | undefined {
        return Array.from(this.usuarios.values()).find(
            usuario => usuario.email.toLowerCase() === email.toLowerCase()
        );
    }

    // Insertar un nuevo usuario asignándole un ID autoincremental
    crear(usuario: Omit<Usuario, 'id'>): Usuario {
        const nuevoUsuario: Usuario = { ...usuario, id: this.proximoId++ };
        this.usuarios.set(nuevoUsuario.id, nuevoUsuario);
        return nuevoUsuario;
    }
}