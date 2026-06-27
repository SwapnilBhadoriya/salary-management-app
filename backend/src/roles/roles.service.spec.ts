import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './roles.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RoleService', () => {
  let service: RoleService;

  const mockPrismaService = {
    role: {
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
        RoleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a role with trimmed name', async () => {
      const dto = { name: '  Software Engineer  ' };
      const expectedName = 'Software Engineer';
      const mockResult = {
        id: 'uuid-1',
        name: expectedName,
        createdAt: new Date(),
      };

      mockPrismaService.role.findMany.mockResolvedValue([]);
      mockPrismaService.role.create.mockResolvedValue(mockResult);

      const result = await service.create(dto);

      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
      expect(mockPrismaService.role.create).toHaveBeenCalledWith({
        data: { name: expectedName },
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw ConflictException if role name already exists (case-insensitive)', async () => {
      const dto = { name: 'software engineer' };
      const existingRole = {
        id: 'uuid-1',
        name: 'Software Engineer',
        createdAt: new Date(),
      };

      mockPrismaService.role.findMany.mockResolvedValue([existingRole]);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
      expect(mockPrismaService.role.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all roles ordered alphabetically by name', async () => {
      const mockRoles = [
        { id: 'uuid-2', name: 'Designer', createdAt: new Date() },
        { id: 'uuid-1', name: 'Developer', createdAt: new Date() },
      ];

      mockPrismaService.role.findMany.mockResolvedValue(mockRoles);

      const result = await service.findAll();

      expect(mockPrismaService.role.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findOne', () => {
    it('should return role when it exists', async () => {
      const mockRole = {
        id: 'uuid-1',
        name: 'Developer',
        createdAt: new Date(),
      };
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);

      const result = await service.findOne('uuid-1');

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role does not exist', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-uuid' },
      });
    });
  });

  describe('update', () => {
    it('should successfully update the role name with trimmed value', async () => {
      const roleId = 'uuid-1';
      const dto = { name: '  Lead Developer  ' };
      const expectedName = 'Lead Developer';
      const existingRole = {
        id: roleId,
        name: 'Developer',
        createdAt: new Date(),
      };
      const updatedRole = {
        id: roleId,
        name: expectedName,
        createdAt: new Date(),
      };

      mockPrismaService.role.findUnique.mockResolvedValue(existingRole);
      mockPrismaService.role.findMany.mockResolvedValue([]);
      mockPrismaService.role.update.mockResolvedValue(updatedRole);

      const result = await service.update(roleId, dto);

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
      expect(mockPrismaService.role.update).toHaveBeenCalledWith({
        where: { id: roleId },
        data: { name: expectedName },
      });
      expect(result).toEqual(updatedRole);
    });

    it('should throw NotFoundException when updating non-existent role', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid-uuid', { name: 'Lead' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.role.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if new name is already taken by another role', async () => {
      const roleId = 'uuid-1';
      const dto = { name: 'Designer' };
      const existingRole = {
        id: roleId,
        name: 'Developer',
        createdAt: new Date(),
      };
      const conflictingRole = {
        id: 'uuid-2',
        name: 'Designer',
        createdAt: new Date(),
      };

      mockPrismaService.role.findUnique.mockResolvedValue(existingRole);
      mockPrismaService.role.findMany.mockResolvedValue([conflictingRole]);

      await expect(service.update(roleId, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
      expect(mockPrismaService.role.update).not.toHaveBeenCalled();
    });

    it('should successfully update name if name is same (no change)', async () => {
      const roleId = 'uuid-1';
      const dto = { name: 'Developer' };
      const existingRole = {
        id: roleId,
        name: 'Developer',
        createdAt: new Date(),
      };

      mockPrismaService.role.findUnique.mockResolvedValue(existingRole);
      mockPrismaService.role.findMany.mockResolvedValue([existingRole]);
      mockPrismaService.role.update.mockResolvedValue(existingRole);

      const result = await service.update(roleId, dto);

      expect(mockPrismaService.role.update).toHaveBeenCalledWith({
        where: { id: roleId },
        data: { name: 'Developer' },
      });
      expect(result).toEqual(existingRole);
    });
  });

  describe('remove', () => {
    it('should successfully delete a role if no employees are assigned', async () => {
      const roleId = 'uuid-1';
      const existingRole = {
        id: roleId,
        name: 'Developer',
        createdAt: new Date(),
      };

      mockPrismaService.role.findUnique.mockResolvedValue(existingRole);
      mockPrismaService.employee.count.mockResolvedValue(0);
      mockPrismaService.role.delete.mockResolvedValue(existingRole);

      const result = await service.remove(roleId);

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(mockPrismaService.employee.count).toHaveBeenCalledWith({
        where: { roleId },
      });
      expect(mockPrismaService.role.delete).toHaveBeenCalledWith({
        where: { id: roleId },
      });
      expect(result).toEqual(existingRole);
    });

    it('should throw NotFoundException when deleting non-existent role', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-uuid')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.role.delete).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when deleting role with associated employees', async () => {
      const roleId = 'uuid-1';
      const existingRole = {
        id: roleId,
        name: 'Developer',
        createdAt: new Date(),
      };

      mockPrismaService.role.findUnique.mockResolvedValue(existingRole);
      mockPrismaService.employee.count.mockResolvedValue(2); // 2 employees assigned

      await expect(service.remove(roleId)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.role.delete).not.toHaveBeenCalled();
    });
  });
});
