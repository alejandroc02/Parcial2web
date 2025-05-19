import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from '../entities/proyecto.entity';
import { Estudiante } from '../entities/estudiante.entity';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let proyectoRepository: Repository<Proyecto>;
  let estudianteRepository: Repository<Estudiante>;

  const mockProyectoRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEstudianteRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        {
          provide: getRepositoryToken(Proyecto),
          useValue: mockProyectoRepository,
        },
        {
          provide: getRepositoryToken(Estudiante),
          useValue: mockEstudianteRepository,
        },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearProyecto', () => {
    it('should create a project with valid data', async () => {
      const proyecto = new Proyecto();
      proyecto.titulo = 'Sistema de Gestión Ambiental Inteligente';
      proyecto.area = 'Sostenibilidad';
      proyecto.presupuesto = 5000000;
      proyecto.estado = 1;
      proyecto.fechaInicio = '2024-03-15';
      proyecto.fechaFin = '2024-12-15';

      mockProyectoRepository.save.mockResolvedValue(proyecto);

      const result = await service.crearProyecto(proyecto);
      expect(result).toEqual(proyecto);
      expect(mockProyectoRepository.save).toHaveBeenCalledWith(proyecto);
    });

    it('should throw error when presupuesto is <= 0', async () => {
      const proyecto = new Proyecto();
      proyecto.presupuesto = 0;
      proyecto.titulo = 'Sistema de Gestión Ambiental Inteligente';

      await expect(service.crearProyecto(proyecto)).rejects.toThrow(
        'El presupuesto debe ser mayor a 0'
      );
    });

    it('should throw error when titulo length is <= 15', async () => {
      const proyecto = new Proyecto();
      proyecto.presupuesto = 5000000;
      proyecto.titulo = 'Proyecto Corto';

      await expect(service.crearProyecto(proyecto)).rejects.toThrow(
        'El título debe tener más de 15 caracteres'
      );
    });
  });

  describe('avanzarProyecto', () => {
    it('should advance project state successfully', async () => {
      const proyecto = new Proyecto();
      proyecto.id = 1;
      proyecto.estado = 2;

      mockProyectoRepository.findOne.mockResolvedValue(proyecto);
      mockProyectoRepository.save.mockResolvedValue({ ...proyecto, estado: 3 });

      const result = await service.avanzarProyecto(1);
      expect(result.estado).toBe(3);
      expect(mockProyectoRepository.save).toHaveBeenCalled();
    });

    it('should throw error when project is in final state', async () => {
      const proyecto = new Proyecto();
      proyecto.id = 1;
      proyecto.estado = 4;

      mockProyectoRepository.findOne.mockResolvedValue(proyecto);

      await expect(service.avanzarProyecto(1)).rejects.toThrow(
        'El proyecto ya está en su estado máximo'
      );
    });

    it('should throw error when project is not found', async () => {
      mockProyectoRepository.findOne.mockResolvedValue(null);

      await expect(service.avanzarProyecto(999)).rejects.toThrow(
        'Proyecto no encontrado'
      );
    });
  });

  describe('findAllEstudiantes', () => {
    it('should return project leader', async () => {
      const proyecto = new Proyecto();
      proyecto.id = 1;
      const lider = new Estudiante();
      lider.id = 1;
      proyecto.lider = lider;

      mockProyectoRepository.findOne.mockResolvedValue(proyecto);

      const result = await service.findAllEstudiantes(1);
      expect(result).toEqual([lider]);
    });

    it('should throw error when project is not found', async () => {
      mockProyectoRepository.findOne.mockResolvedValue(null);

      await expect(service.findAllEstudiantes(999)).rejects.toThrow(
        'Proyecto no encontrado'
      );
    });
  });
}); 