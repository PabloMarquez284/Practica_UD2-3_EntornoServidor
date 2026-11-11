// Importaciones
import { ReservaRepositorio } from './repositories/reservaRepositorio.js';
import { ReservaControlador } from './controllers/reservaControlador.js';
import { ReservaServicio } from './services/reservaServicio.js';
import { crearRutasReserva } from './routes/reservaRutas.js';
import { tratarError } from './middlewares/tratarError.js';
import express from 'express';
import session from 'express-session';

// Crear una instancia de la aplicación Express
const app = express();

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
app.use(crearRutasReserva(reservaControlador));
app.use(tratarError);

// Exportar la aplicación para su uso en otros módulos
export { app};