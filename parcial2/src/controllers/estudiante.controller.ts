import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { Estudiante } from '../entities/estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(@Body() estudiante: Estudiante): Promise<Estudiante> {
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  @Delete(':id')
  async eliminarEstudiante(@Param('id') id: number): Promise<void> {
    return await this.estudianteService.eliminarEstudiante(id);
  }
} 