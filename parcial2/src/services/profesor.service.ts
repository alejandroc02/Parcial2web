import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from '../entities/profesor.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
  ) {}

  async crearProfesor(profesor: Profesor): Promise<Profesor> {
    if (profesor.extension.toString().length !== 5) {
      throw new Error('La extensión debe tener exactamente 5 dígitos');
    }
    return await this.profesorRepository.save(profesor);
  }

  async asignarEvaluador(id: number): Promise<Profesor> {
    const profesor = await this.profesorRepository.findOne({
      where: { id },
      relations: ['mentorias'],
    });

    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }

    const evaluacionesActivas = profesor.mentorias.filter(p => p.estado < 4).length;
    if (evaluacionesActivas >= 3) {
      throw new Error('El profesor ya tiene 3 o más evaluaciones activas');
    }

    profesor.esParEvaluador = true;
    return await this.profesorRepository.save(profesor);
  }
} 