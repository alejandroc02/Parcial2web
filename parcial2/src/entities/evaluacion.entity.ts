import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from './proyecto.entity';

@Entity()
export class Evaluacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proyecto, proyecto => proyecto.evaluaciones)
  proyecto: Proyecto;
} 