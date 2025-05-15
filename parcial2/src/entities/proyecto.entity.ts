import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Profesor } from './profesor.entity';
import { Evaluacion } from './evaluacion.entity';

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  notaFinal: number;

  @Column()
  estado: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @ManyToOne(() => Estudiante, estudiante => estudiante.proyectos)
  lider: Estudiante;

  @ManyToOne(() => Profesor, profesor => profesor.mentorias)
  mentor: Profesor;

  @OneToMany(() => Evaluacion, evaluacion => evaluacion.proyecto)
  evaluaciones: Evaluacion[];
} 