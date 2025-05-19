import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorService } from './profesor.service';
import { Profesor } from '../entities/profesor.entity';
import { Proyecto } from '../entities/proyecto.entity';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<Profesor>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesorService,
        {
          provide: getRepositoryToken(Profesor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearProfesor', () => {
    it('should create a professor with valid data', async () => {
      const profesor = new Profesor();
      profesor.nombre = 'Dra. María González';
      profesor.cedula = 1234567890;
      profesor.departamento = 'Sistemas';
      profesor.extension = 12345;
      profesor.esParEvaluador = false;

      mockRepository.save.mockResolvedValue(profesor);

      const result = await service.crearProfesor(profesor);
      expect(result).toEqual(profesor);
      expect(mockRepository.save).toHaveBeenCalledWith(profesor);
    });

    it('should throw error when extension is not 5 digits', async () => {
      const profesor = new Profesor();
      profesor.extension = 1234;

      await expect(service.crearProfesor(profesor)).rejects.toThrow(
        'La extensión debe tener exactamente 5 dígitos'
      );
    });
  });

  describe('asignarEvaluador', () => {
    it('should assign professor as evaluator successfully', async () => {
      const profesor = new Profesor();
      profesor.id = 1;
      profesor.mentorias = [];
      profesor.esParEvaluador = false;

      mockRepository.findOne.mockResolvedValue(profesor);
      mockRepository.save.mockResolvedValue({ ...profesor, esParEvaluador: true });

      const result = await service.asignarEvaluador(1);
      expect(result.esParEvaluador).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when professor has 3 or more active evaluations', async () => {
      const profesor = new Profesor();
      profesor.id = 1;
      profesor.mentorias = [
        { id: 1, estado: 2 } as Proyecto,
        { id: 2, estado: 3 } as Proyecto,
        { id: 3, estado: 1 } as Proyecto,
      ];

      mockRepository.findOne.mockResolvedValue(profesor);

      await expect(service.asignarEvaluador(1)).rejects.toThrow(
        'El profesor ya tiene 3 o más evaluaciones activas'
      );
    });

    it('should throw error when professor is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.asignarEvaluador(999)).rejects.toThrow(
        'Profesor no encontrado'
      );
    });
  });
}); 