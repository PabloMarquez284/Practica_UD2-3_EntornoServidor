// Importaciones
import app from './app.js';

// Definición del puerto
const PORT = process.env.PORT || 3000;

// Llamada al servidor
app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});