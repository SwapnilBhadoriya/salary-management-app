import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './roles.controller';
import { RoleService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('RoleController', () => {
  let controller: RoleController;

  const mockRoleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a role', async () => {
      const dto: CreateRoleDto = { name: 'Software Engineer' };
      const expectedResult = {
        id: 'uuid-1',
        name: 'Software Engineer',
        createdAt: new Date(),
      };

      mockRoleService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(mockRoleService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const expectedResult = [
        { id: 'uuid-1', name: 'Software Engineer', createdAt: new Date() },
        { id: 'uuid-2', name: 'Designer', createdAt: new Date() },
      ];

      mockRoleService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockRoleService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a role by ID', async () => {
      const id = 'uuid-1';
      const expectedResult = {
        id,
        name: 'Software Engineer',
        createdAt: new Date(),
      };

      mockRoleService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(mockRoleService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should successfully update a role', async () => {
      const id = 'uuid-1';
      const dto: UpdateRoleDto = { name: 'Lead Engineer' };
      const expectedResult = {
        id,
        name: 'Lead Engineer',
        createdAt: new Date(),
      };

      mockRoleService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto);

      expect(mockRoleService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should successfully delete a role', async () => {
      const id = 'uuid-1';
      const expectedResult = {
        id,
        name: 'Software Engineer',
        createdAt: new Date(),
      };

      mockRoleService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(mockRoleService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});

describe('CreateRoleDto Validation', () => {
  it('should pass with a valid name', async () => {
    const payload = { name: 'Software Engineer' };
    const dto = plainToInstance(CreateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when name is empty', async () => {
    const payload = { name: '' };
    const dto = plainToInstance(CreateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is missing', async () => {
    const payload = {};
    const dto = plainToInstance(CreateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is shorter than 2 characters', async () => {
    const payload = { name: 'A' };
    const dto = plainToInstance(CreateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is longer than 100 characters', async () => {
    const payload = { name: 'A'.repeat(101) };
    const dto = plainToInstance(CreateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is not a string', async () => {
    const payload = { name: 123 };
    const dto = plainToInstance(CreateRoleDto, payload as any);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UpdateRoleDto Validation', () => {
  it('should pass with a valid name', async () => {
    const payload = { name: 'Lead Engineer' };
    const dto = plainToInstance(UpdateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when name is empty', async () => {
    const payload = { name: '' };
    const dto = plainToInstance(UpdateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is missing', async () => {
    const payload = {};
    const dto = plainToInstance(UpdateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is shorter than 2 characters', async () => {
    const payload = { name: 'A' };
    const dto = plainToInstance(UpdateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is longer than 100 characters', async () => {
    const payload = { name: 'A'.repeat(101) };
    const dto = plainToInstance(UpdateRoleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is not a string', async () => {
    const payload = { name: 123 };
    const dto = plainToInstance(UpdateRoleDto, payload as any);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
