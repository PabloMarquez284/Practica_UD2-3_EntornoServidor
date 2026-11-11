// Importaciones
import { ReservaRepositorio } from './repositories/reservaRepositorio.js';
import { ReservaControlador } from './controllers/reservaControlador.js';
import { ReservaServicio } from './services/reservaServicio.js';
import { crearRutasReserva } from './routes/reservaRutas.js';
import { tratarError } from './middlewares/tratarError.js';
import { UsuarioRepositorio } from './repositories/usuarioRepositorio.js';
import { UsuarioServicio } from './services/usuarioServicio.js';
import { AuthControlador } from './controllers/authControlador.js';
import { crearAuthRutas } from './routes/authRutas.js';
import { EquipoRepositorio } from './repositories/equipoRepositorio.js';
import { EquipoServicio } from './services/equipoServicio.js';
import { crearAdminRutas } from './routes/adminRutas.js';
import { crearEquipoRutas } from './routes/equipoRutas.js';
import express from 'express';
import session from 'express-session';

// Crear una instancia de la aplicación Express
export const app = express();

// Middlewares base
app.use(express.static('public')); // Servir css desde la carpeta 'public'
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'cambiar_mi_secreto',
  resave: false,
  saveUninitialized: false
}));

// Configuraciones de vista (EJS)
app.set('view engine', 'ejs');
app.set('views', './views');

// Instancias en orden
const reservaRepositorio = new ReservaRepositorio();
const reservaServicio = new ReservaServicio(reservaRepositorio);
const reservaControlador = new ReservaControlador(reservaServicio);
const usuarioRepositorio = new UsuarioRepositorio();
const usuarioServicio = new UsuarioServicio(usuarioRepositorio);
const authControlador = new AuthControlador(usuarioServicio);
const equipoRepositorio = new EquipoRepositorio();
const equipoServicio = new EquipoServicio(equipoRepositorio);

// Montar las rutas
app.use(crearRutasReserva(reservaControlador));
app.use(tratarError);
app.use('/', crearAuthRutas(authControlador));
app.use('/admin', crearAdminRutas(equipoServicio, reservaServicio, usuarioRepositorio));
app.use('/', crearEquipoRutas(equipoServicio));