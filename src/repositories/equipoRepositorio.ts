// IMportaciones
import { Equipo, RepositorioEquipos, EstadoEquipo } from '../types/index.js';

// Crear clase que implemente RepositorioEquipos
export class EquipoRepositorio implements RepositorioEquipos {
    private equipos: Map<number, Equipo> = new Map();
    private proximoId: number = 1;

    constructor() {
        // Carga inicial de equipos de prueba requeridos en el enunciado
        this.crear({ codigo: 'EQ-001', nombre: 'Portátil Dell XPS', tipo: 'portatil', estado: 'operativo' });
        this.crear({ codigo: 'EQ-002', nombre: 'Sobremesa HP Elite', tipo: 'sobremesa', estado: 'operativo' });
        this.crear({ codigo: 'EQ-003', nombre: 'Portátil Lenovo ThinkPad', tipo: 'portatil', estado: 'fuera de servicio' });
    }

    obtenerTodos(): Equipo[] {
        return Array.from(this.equipos.values());
    }

    obtenerPorId(id: number): Equipo | undefined {
        return this.equipos.get(id);
    }

    crear(equipo: Omit<Equipo, 'id'>): Equipo {
        const nuevoEquipo: Equipo = { ...equipo, id: this.proximoId++ };
        this.equipos.set(nuevoEquipo.id, nuevoEquipo);
        return nuevoEquipo;
    }

    actualizarEstado(id: number, estado: EstadoEquipo): Equipo | undefined {
        const equipo = this.equipos.get(id);
        if (equipo) {
            equipo.estado = estado;
            this.equipos.set(id, equipo);
        }
        return equipo;
    }
}