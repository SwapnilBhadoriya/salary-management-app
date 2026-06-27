import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './departments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('DepartmentService', () => {
  let service: DepartmentService;

  const mockPrismaService = {
    department: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    employee: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a department with trimmed name', async () => {
      const dto = { name: '  Engineering  ' };
      const expectedName = 'Engineering';
      const mockResult = {
        id: 'uuid-1',
        name: expectedName,
        createdAt: new Date(),
      };

      mockPrismaService.department.findMany.mockResolvedValue([]);
      mockPrismaService.department.create.mockResolvedValue(mockResult);

      const result = await service.create(dto);

      expect(mockPrismaService.department.findMany).toHaveBeenCalled();
      expect(mockPrismaService.department.create).toHaveBeenCalledWith({
        data: { name: expectedName },
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw ConflictException if department name already exists (case-insensitive)', async () => {
      const dto = { name: 'engineering' };
      const existingDept = {
        id: 'uuid-1',
        name: 'Engineering',
        createdAt: new Date(),
      };

      mockPrismaService.department.findMany.mockResolvedValue([existingDept]);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.department.findMany).toHaveBeenCalled();
      expect(mockPrismaService.department.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all departments ordered alphabetically by name', async () => {
      const mockDepts = [
        { id: 'uuid-2', name: 'HR', createdAt: new Date() },
        { id: 'uuid-1', name: 'Sales', createdAt: new Date() },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepts);

      const result = await service.findAll();

      expect(mockPrismaService.department.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockDepts);
    });
  });

  describe('findOne', () => {
    it('should return department when it exists', async () => {
      const mockDept = {
        id: 'uuid-1',
        name: 'Engineering',
        createdAt: new Date(),
      };
      mockPrismaService.department.findUnique.mockResolvedValue(mockDept);

      const result = await service.findOne('uuid-1');

      expect(mockPrismaService.department.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result).toEqual(mockDept);
    });

    it('should throw NotFoundException when department does not exist', async () => {
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.department.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-uuid' },
      });
    });
  });

  describe('update', () => {
    it('should successfully update the department name with trimmed value', async () => {
      const deptId = 'uuid-1';
      const dto = { name: '  Software Engineering  ' };
      const expectedName = 'Software Engineering';
      const existingDept = {
        id: deptId,
        name: 'Engineering',
        createdAt: new Date(),
      };
      const updatedDept = {
        id: deptId,
        name: expectedName,
        createdAt: new Date(),
      };

      mockPrismaService.department.findUnique.mockResolvedValue(existingDept);
      mockPrismaService.department.findMany.mockResolvedValue([]);
      mockPrismaService.department.update.mockResolvedValue(updatedDept);

      const result = await service.update(deptId, dto);

      expect(mockPrismaService.department.findUnique).toHaveBeenCalledWith({
        where: { id: deptId },
      });
      expect(mockPrismaService.department.findMany).toHaveBeenCalled();
      expect(mockPrismaService.department.update).toHaveBeenCalledWith({
        where: { id: deptId },
        data: { name: expectedName },
      });
      expect(result).toEqual(updatedDept);
    });

    it('should throw NotFoundException when updating non-existent department', async () => {
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid-uuid', { name: 'Design' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.department.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if new name is already taken by another department', async () => {
      const deptId = 'uuid-1';
      const dto = { name: 'Sales' };
      const existingDept = {
        id: deptId,
        name: 'Engineering',
        createdAt: new Date(),
      };
      const conflictingDept = {
        id: 'uuid-2',
        name: 'Sales',
        createdAt: new Date(),
      };

      mockPrismaService.department.findUnique.mockResolvedValue(existingDept);
      mockPrismaService.department.findMany.mockResolvedValue([
        conflictingDept,
      ]);

      await expect(service.update(deptId, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.department.findMany).toHaveBeenCalled();
      expect(mockPrismaService.department.update).not.toHaveBeenCalled();
    });

    it('should successfully update name if name is same (no change)', async () => {
      const deptId = 'uuid-1';
      const dto = { name: 'Engineering' };
      const existingDept = {
        id: deptId,
        name: 'Engineering',
        createdAt: new Date(),
      };

      mockPrismaService.department.findUnique.mockResolvedValue(existingDept);
      mockPrismaService.department.findMany.mockResolvedValue([existingDept]);
      mockPrismaService.department.update.mockResolvedValue(existingDept);

      const result = await service.update(deptId, dto);

      expect(mockPrismaService.department.update).toHaveBeenCalledWith({
        where: { id: deptId },
        data: { name: 'Engineering' },
      });
      expect(result).toEqual(existingDept);
    });
  });

  describe('remove', () => {
    it('should successfully delete a department if no employees are assigned', async () => {
      const deptId = 'uuid-1';
      const existingDept = {
        id: deptId,
        name: 'Engineering',
        createdAt: new Date(),
      };

      mockPrismaService.department.findUnique.mockResolvedValue(existingDept);
      mockPrismaService.employee.count.mockResolvedValue(0);
      mockPrismaService.department.delete.mockResolvedValue(existingDept);

      const result = await service.remove(deptId);

      expect(mockPrismaService.department.findUnique).toHaveBeenCalledWith({
        where: { id: deptId },
      });
      expect(mockPrismaService.employee.count).toHaveBeenCalledWith({
        where: { departmentId: deptId },
      });
      expect(mockPrismaService.department.delete).toHaveBeenCalledWith({
        where: { id: deptId },
      });
      expect(result).toEqual(existingDept);
    });

    it('should throw NotFoundException when deleting non-existent department', async () => {
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.department.delete).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when deleting department with associated employees', async () => {
      const deptId = 'uuid-1';
      const existingDept = {
        id: deptId,
        name: 'Engineering',
        createdAt: new Date(),
      };

      mockPrismaService.department.findUnique.mockResolvedValue(existingDept);
      mockPrismaService.employee.count.mockResolvedValue(3); // 3 employees assigned

      await expect(service.remove(deptId)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.department.delete).not.toHaveBeenCalled();
    });
  });
});
