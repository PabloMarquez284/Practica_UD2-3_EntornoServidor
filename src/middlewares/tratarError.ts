// Imporaciones
import { Request, Response, NextFunction } from "express";
import { ErrorDominio } from "../domain/errorDominio.js";

// Middleware para tratar errores
export function tratarError(err: any, req: Request, res: Response, next: NextFunction) {
    // Si los encabezados ya han sido enviados, delegamos el manejo del error al siguiente middleware
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ErrorDominio) {
        // Manejo de errores de dominio
        switch (err.codigo) {
            case 'DATOS_INVALIDOS':
                res.status(400).json({ error: err.message });
                break;
            case 'NO_ENCONTRADO':
                res.status(404).json({ error: err.message });
                break;
            case 'NO_DISPONIBLE':
                res.status(409).json({ error: err.message });
                break;
            case 'PLAZO_NO_PERMITIDO':
                res.status(403).json({ error: err.message });
                break;
            default:
                res.status(500).json({ error: 'Error de dominio desconocido' });
        }   
    } else {
        // Manejo de errores genéricos
        console.error('Fallo interno al procesar una petición:', err);
        return res.status(500).render('error', { mensaje: 'No se ha podido procesar la solicitud' });
    }
}

// Exportación del middleware
export default tratarError;