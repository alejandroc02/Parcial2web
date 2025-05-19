import { Controller, Post, Body, Param, Put, Get } from '@nestjs/common';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../entities/proyecto.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async crearProyecto(@Body() proyecto: Proyecto): Promise<Proyecto> {
    return await this.proyectoService.crearProyecto(proyecto);
  }

  @Put(':id/avanzar')
  async avanzarProyecto(@Param('id') id: number): Promise<Proyecto> {
    return await this.proyectoService.avanzarProyecto(id);
  }

  @Get(':id/estudiantes')
  async findAllEstudiantes(@Param('id') id: number) {
    return await this.proyectoService.findAllEstudiantes(id);
  }
} 