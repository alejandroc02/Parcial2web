import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from '../entities/estudiante.entity';
import { Proyecto } from '../entities/proyecto.entity';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<Estudiante>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(Estudiante),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEstudiante', () => {
    it('should create a student with valid data', async () => {
      const estudiante = new Estudiante();
      estudiante.promedio = 4.0;
      estudiante.semestre = 5;
      estudiante.nombre = 'Juan Pérez';
      estudiante.cedula = 1234567890;
      estudiante.programa = 'Ingeniería de Sistemas';

      mockRepository.save.mockResolvedValue(estudiante);

      const result = await service.crearEstudiante(estudiante);
      expect(result).toEqual(estudiante);
      expect(mockRepository.save).toHaveBeenCalledWith(estudiante);
    });

    it('should throw error when promedio is <= 3.2', async () => {
      const estudiante = new Estudiante();
      estudiante.promedio = 3.0;
      estudiante.semestre = 5;

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(
        'El estudiante debe tener un promedio mayor a 3.2 y estar en semestre 4 o superior'
      );
    });

    it('should throw error when semestre is < 4', async () => {
      const estudiante = new Estudiante();
      estudiante.promedio = 4.0;
      estudiante.semestre = 3;

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(
        'El estudiante debe tener un promedio mayor a 3.2 y estar en semestre 4 o superior'
      );
    });
  });

  describe('eliminarEstudiante', () => {
    it('should delete a student without active projects', async () => {
      const estudiante = new Estudiante();
      estudiante.id = 1;
      estudiante.proyectos = [];

      mockRepository.findOne.mockResolvedValue(estudiante);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.eliminarEstudiante(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['proyectos'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(estudiante);
    });

    it('should throw error when student has active projects', async () => {
      const estudiante = new Estudiante();
      estudiante.id = 1;
      estudiante.proyectos = [
        { id: 1, estado: 2 } as Proyecto,
        { id: 2, estado: 3 } as Proyecto,
      ];

      mockRepository.findOne.mockResolvedValue(estudiante);

      await expect(service.eliminarEstudiante(1)).rejects.toThrow(
        'No se puede eliminar el estudiante porque tiene proyectos activos'
      );
    });

    it('should throw error when student is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.eliminarEstudiante(999)).rejects.toThrow(
        'Estudiante no encontrado'
      );
    });
  });
}); 