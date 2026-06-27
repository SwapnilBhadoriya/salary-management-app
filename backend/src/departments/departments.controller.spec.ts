import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './departments.controller';
import { DepartmentService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('DepartmentController', () => {
  let controller: DepartmentController;

  const mockDepartmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        {
          provide: DepartmentService,
          useValue: mockDepartmentService,
        },
      ],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a department', async () => {
      const dto: CreateDepartmentDto = { name: 'Engineering' };
      const expectedResult = {
        id: 'uuid-1',
        name: 'Engineering',
        createdAt: new Date(),
      };

      mockDepartmentService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(mockDepartmentService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all departments', async () => {
      const expectedResult = [
        { id: 'uuid-1', name: 'Engineering', createdAt: new Date() },
        { id: 'uuid-2', name: 'HR', createdAt: new Date() },
      ];

      mockDepartmentService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockDepartmentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a department by ID', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'Engineering', createdAt: new Date() };

      mockDepartmentService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(mockDepartmentService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should successfully update a department', async () => {
      const id = 'uuid-1';
      const dto: UpdateDepartmentDto = { name: 'Software Engineering' };
      const expectedResult = {
        id,
        name: 'Software Engineering',
        createdAt: new Date(),
      };

      mockDepartmentService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto);

      expect(mockDepartmentService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should successfully delete a department', async () => {
      const id = 'uuid-1';
      const expectedResult = { id, name: 'Engineering', createdAt: new Date() };

      mockDepartmentService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(mockDepartmentService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});

describe('CreateDepartmentDto Validation', () => {
  it('should pass with a valid name', async () => {
    const payload = { name: 'Engineering' };
    const dto = plainToInstance(CreateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when name is empty', async () => {
    const payload = { name: '' };
    const dto = plainToInstance(CreateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is missing', async () => {
    const payload = {};
    const dto = plainToInstance(CreateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is shorter than 2 characters', async () => {
    const payload = { name: 'A' };
    const dto = plainToInstance(CreateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is longer than 100 characters', async () => {
    const payload = { name: 'A'.repeat(101) };
    const dto = plainToInstance(CreateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is not a string', async () => {
    const payload = { name: 123 };
    const dto = plainToInstance(CreateDepartmentDto, payload as any);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UpdateDepartmentDto Validation', () => {
  it('should pass with a valid name', async () => {
    const payload = { name: 'Software Engineering' };
    const dto = plainToInstance(UpdateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when name is empty', async () => {
    const payload = { name: '' };
    const dto = plainToInstance(UpdateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is missing', async () => {
    const payload = {};
    const dto = plainToInstance(UpdateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is shorter than 2 characters', async () => {
    const payload = { name: 'A' };
    const dto = plainToInstance(UpdateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is longer than 100 characters', async () => {
    const payload = { name: 'A'.repeat(101) };
    const dto = plainToInstance(UpdateDepartmentDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is not a string', async () => {
    const payload = { name: 123 };
    const dto = plainToInstance(UpdateDepartmentDto, payload as any);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
