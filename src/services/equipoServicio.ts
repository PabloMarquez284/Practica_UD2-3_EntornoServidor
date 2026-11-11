//Importaciones
import { Equipo, RepositorioEquipos, TipoEquipo, EstadoEquipo } from '../types/index.js';
import { ErrorDominio } from '../domain/errorDominio.js';

// Creae clase con contructor privado y solo lectura
export class EquipoServicio {
    constructor(private readonly equipoRepositorio: RepositorioEquipos) {}

    // Obtener equipos con opción de filtrado por URL (query params)
    obtenerFiltrados(tipo?: string, soloOperativos?: boolean): Equipo[] {
        let lista = this.equipoRepositorio.obtenerTodos();

        if (tipo && (tipo === 'portatil' || tipo === 'sobremesa')) {
            lista = lista.filter(eq => eq.tipo === tipo);
        }

        if (soloOperativos) {
            lista = lista.filter(eq => eq.estado === 'operativo');
        }

        return lista;
    }

    crearEquipo(nombre: string, codigo: string, tipo: TipoEquipo): Equipo {
        if (!nombre || !codigo || !tipo) {
            throw new ErrorDominio('DATOS_INVALIDOS', 'Todos los campos del equipo son obligatorios.');
        }

        return this.equipoRepositorio.crear({
            codigo,
            nombre,
            tipo,
            estado: 'operativo'
        });
    }

    cambiarEstado(id: number, estado: EstadoEquipo): Equipo {
        const equipo = this.equipoRepositorio.obtenerPorId(id);
        if (!equipo) {
            throw new ErrorDominio('NO_ENCONTRADO', 'El equipo no existe.');
        }

        const actualizado = this.equipoRepositorio.actualizarEstado(id, estado);
        return actualizado!;
    }
}