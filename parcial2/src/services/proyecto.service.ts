import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../entities/proyecto.entity';
import { Estudiante } from '../entities/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async crearProyecto(proyecto: Proyecto): Promise<Proyecto> {
    if (proyecto.presupuesto <= 0) {
      throw new Error('El presupuesto debe ser mayor a 0');
    }
    if (proyecto.titulo.length <= 15) {
      throw new Error('El título debe tener más de 15 caracteres');
    }
    return await this.proyectoRepository.save(proyecto);
  }

  async avanzarProyecto(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id }
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if (proyecto.estado >= 4) {
      throw new Error('El proyecto ya está en su estado máximo');
    }

    proyecto.estado += 1;
    return await this.proyectoRepository.save(proyecto);
  }

  async findAllEstudiantes(id: number): Promise<Estudiante[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['lider'],
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    return [proyecto.lider];
  }
} 