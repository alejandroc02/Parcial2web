import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionService } from './evaluacion.service';
import { Evaluacion } from '../entities/evaluacion.entity';
import { Profesor } from '../entities/profesor.entity';
import { Proyecto } from '../entities/proyecto.entity';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let evaluacionRepository: Repository<Evaluacion>;
  let profesorRepository: Repository<Profesor>;

  const mockEvaluacionRepository = {
    save: jest.fn(),
  };

  const mockProfesorRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionService,
        {
          provide: getRepositoryToken(Evaluacion),
          useValue: mockEvaluacionRepository,
        },
        {
          provide: getRepositoryToken(Profesor),
          useValue: mockProfesorRepository,
        },
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    evaluacionRepository = module.get<Repository<Evaluacion>>(getRepositoryToken(Evaluacion));
    profesorRepository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEvaluacion', () => {
    it('should create an evaluation successfully', async () => {
      const evaluacion = new Evaluacion();
      evaluacion.proyecto = { id: 1 } as Proyecto;

      const evaluador = new Profesor();
      evaluador.id = 1;
      evaluador.mentorias = [];

      mockProfesorRepository.findOne.mockResolvedValue(evaluador);
      mockEvaluacionRepository.save.mockResolvedValue(evaluacion);

      const result = await service.crearEvaluacion(evaluacion, 1);
      expect(result).toEqual(evaluacion);
      expect(mockEvaluacionRepository.save).toHaveBeenCalledWith(evaluacion);
    });

    it('should throw error when evaluator is not found', async () => {
      const evaluacion = new Evaluacion();
      evaluacion.proyecto = { id: 1 } as Proyecto;

      mockProfesorRepository.findOne.mockResolvedValue(null);

      await expect(service.crearEvaluacion(evaluacion, 999)).rejects.toThrow(
        'Evaluador no encontrado'
      );
    });

    it('should throw error when evaluator is project mentor', async () => {
      const evaluacion = new Evaluacion();
      evaluacion.proyecto = { id: 1 } as Proyecto;

      const evaluador = new Profesor();
      evaluador.id = 1;
      evaluador.mentorias = [{ id: 1 } as Proyecto];

      mockProfesorRepository.findOne.mockResolvedValue(evaluador);

      await expect(service.crearEvaluacion(evaluacion, 1)).rejects.toThrow(
        'El evaluador no puede ser el mentor del proyecto'
      );
    });
  });
}); 