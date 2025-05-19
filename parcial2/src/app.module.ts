import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Profesor } from './entities/profesor.entity';
import { Proyecto } from './entities/proyecto.entity';
import { Evaluacion } from './entities/evaluacion.entity';
import { EstudianteService } from './services/estudiante.service';
import { ProfesorService } from './services/profesor.service';
import { ProyectoService } from './services/proyecto.service';
import { EvaluacionService } from './services/evaluacion.service';
import { ProyectoController } from './controllers/proyecto.controller';
import { EstudianteController } from './controllers/estudiante.controller';
import { ProfesorController } from './controllers/profesor.controller';
import { EvaluacionController } from './controllers/evaluacion.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [Estudiante, Profesor, Proyecto, Evaluacion],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Estudiante, Profesor, Proyecto, Evaluacion]),
  ],
  controllers: [
    EstudianteController,
    ProyectoController,
    ProfesorController,
    EvaluacionController,
  ],
  providers: [
    EstudianteService,
    ProfesorService,
    ProyectoService,
    EvaluacionService,
  ],
  exports: [TypeOrmModule]
})
export class AppModule {}
