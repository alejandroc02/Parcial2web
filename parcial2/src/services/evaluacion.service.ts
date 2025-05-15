import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Profesor } from '../entities/profesor.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(Evaluacion)
    private readonly evaluacionRepository: Repository<Evaluacion>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
  ) {}

  async crearEvaluacion(evaluacion: Evaluacion, evaluadorId: number): Promise<Evaluacion> {
    const evaluador = await this.profesorRepository.findOne({
      where: { id: evaluadorId },
      relations: ['mentorias'],
    });

    if (!evaluador) {
      throw new Error('Evaluador no encontrado');
    }

    const esMentor = evaluador.mentorias.some(p => p.id === evaluacion.proyecto.id);
    if (esMentor) {
      throw new Error('El evaluador no puede ser el mentor del proyecto');
    }

    return await this.evaluacionRepository.save(evaluacion);
  }
} 