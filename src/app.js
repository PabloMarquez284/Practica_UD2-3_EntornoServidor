// Importaciones
import express from 'express';
import dotenv from 'dotenv';

// Configuración de variables de entorno
dotenv.config();
if (!process.env.PORT || !process.env.NODE_ENV || !process.env.SESSION_SECRET) {
    throw new Error('Faltan variables de entorno obligatorias');
}

// Configuración inicial
const app = express();

// Middlewares Globales
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exportación de la aplicación
export default app;