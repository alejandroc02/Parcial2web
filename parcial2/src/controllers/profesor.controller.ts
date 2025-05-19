import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { ProfesorService } from '../services/profesor.service';
import { Profesor } from '../entities/profesor.entity';

@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async crearProfesor(@Body() profesor: Profesor): Promise<Profesor> {
    return await this.profesorService.crearProfesor(profesor);
  }

  @Put(':id/asignar-evaluador')
  async asignarEvaluador(@Param('id') id: number): Promise<Profesor> {
    return await this.profesorService.asignarEvaluador(id);
  }
} 