// Importación de dependencias
import dotenv from 'dotenv';

// Configuración de variables de entorno
dotenv.config();
if (!process.env.PORT || !process.env.NODE_ENV || !process.env.SESSION_SECRET) {
    throw new Error('Faltan variables de entorno obligatorias');
}

// Importación de la aplicación
import { app } from './app.js';

// Definición del puerto
const PORT = process.env.PORT || 3001;

// Llamada al servidor
app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});