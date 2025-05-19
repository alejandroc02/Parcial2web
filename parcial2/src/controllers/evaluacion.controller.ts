import { Controller, Post, Body, Param } from '@nestjs/common';
import { EvaluacionService } from '../services/evaluacion.service';
import { Evaluacion } from '../entities/evaluacion.entity';

@Controller('evaluaciones')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post(':evaluadorId')
  async crearEvaluacion(
    @Body() evaluacion: Evaluacion,
    @Param('evaluadorId') evaluadorId: number,
  ): Promise<Evaluacion> {
    return await this.evaluacionService.crearEvaluacion(evaluacion, evaluadorId);
  }
} 