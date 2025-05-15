import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from './proyecto.entity';

@Entity()
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  departamento: string;

  @Column()
  extension: number;

  @Column()
  esParEvaluador: boolean;

  @OneToMany(() => Proyecto, proyecto => proyecto.mentor)
  mentorias: Proyecto[];
} 