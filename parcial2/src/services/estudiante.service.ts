import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async crearEstudiante(estudiante: Estudiante): Promise<Estudiante> {
    if (estudiante.promedio <= 3.2 || estudiante.semestre < 4) {
      throw new Error('El estudiante debe tener un promedio mayor a 3.2 y estar en semestre 4 o superior');
    }
    return await this.estudianteRepository.save(estudiante);
  }

  async eliminarEstudiante(id: number): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const proyectosActivos = estudiante.proyectos.filter(p => p.estado < 4);
    if (proyectosActivos.length > 0) {
      throw new Error('No se puede eliminar el estudiante porque tiene proyectos activos');
    }

    await this.estudianteRepository.remove(estudiante);
  }
} 