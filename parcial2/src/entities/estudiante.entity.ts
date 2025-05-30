import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from './proyecto.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  semestre: number;

  @Column()
  programa: string;

  @Column('decimal', { precision: 3, scale: 2 })
  promedio: number;

  @OneToMany(() => Proyecto, proyecto => proyecto.lider)
  proyectos: Proyecto[];
} 