// Definición de tipos de errores
export type CodigoError = 'DATOS_INVALIDOS' | 'NO_ENCONTRADO' | 'NO_DISPONIBLE' | 'PLAZO_NO_PERMITIDO';

// Clase de error de dominio
export class ErrorDominio extends Error {
    readonly codigo: CodigoError;

    // Constructor que recibe un código de error y un mensaje
    constructor(codigo: CodigoError, mensaje: string) {
        super(mensaje);
        this.codigo = codigo;
        this.name = 'errorDominio';
    }
}