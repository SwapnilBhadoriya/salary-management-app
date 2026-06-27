/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmploymentStatus } from './enums/employment-status.enum';
import { EmploymentType } from './enums/employment-type.enum';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let prismaService: any;

  const mockPrismaService = {
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
    sequence: {
      upsert: jest.fn(),
    },
    employee: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    salaryRecord: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    department: { count: jest.fn(), findUnique: jest.fn() },
    role: { count: jest.fn(), findUnique: jest.fn() },
    country: { count: jest.fn(), findUnique: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateEmployeeDto = {
      name: 'John',
      email: 'john@example.com',
      departmentId: 'dept-1',
      roleId: 'role-1',
      countryId: 'country-1',
      status: EmploymentStatus.ACTIVE,
      type: EmploymentType.FULL_TIME,
      salary: 5000,
    };

    it('should create an employee and generate first sequence ID (EMP-00001)', async () => {
      mockPrismaService.department.count.mockResolvedValue(1);
      mockPrismaService.role.count.mockResolvedValue(1);
      mockPrismaService.country.count.mockResolvedValue(1);
      mockPrismaService.employee.count.mockResolvedValue(0); // email not taken

      mockPrismaService.sequence.upsert.mockResolvedValue({ value: 1 });

      const expectedEmployee = {
        id: 'uuid',
        employeeId: 'EMP-00001',
        ...createDto,
      };
      mockPrismaService.employee.create.mockResolvedValue(expectedEmployee);

      const result = await service.create(createDto);

      expect(mockPrismaService.sequence.upsert).toHaveBeenCalledWith({
        where: { name: 'employeeId' },
        update: { value: { increment: 1 } },
        create: { name: 'employeeId', value: 1 },
      });
      expect(mockPrismaService.employee.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          employeeId: 'EMP-00001',
          name: 'John',
          email: 'john@example.com',
          status: EmploymentStatus.ACTIVE,
          type: EmploymentType.FULL_TIME,
        }),
      });
      expect(result).toEqual(expectedEmployee);
    });

    it('should throw NotFoundException if relations are invalid', async () => {
      mockPrismaService.department.count.mockResolvedValue(0); // Invalid department

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockPrismaService.department.count.mockResolvedValue(1);
      mockPrismaService.role.count.mockResolvedValue(1);
      mockPrismaService.country.count.mockResolvedValue(1);
      mockPrismaService.employee.count.mockResolvedValue(1); // email taken

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('addSalaryRecord', () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    it('should throw NotFoundException if employee not found', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);
      await expect(
        service.addSalaryRecord('1', { amount: 6000, effectiveDate: today }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnprocessableEntityException if new amount equals current active salary', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue({ id: '1' });
      // Current active salary
      mockPrismaService.salaryRecord.findFirst.mockResolvedValue({
        amount: 6000,
        effectiveDate: new Date('2025-01-01'),
      });

      await expect(
        service.addSalaryRecord('1', { amount: 6000, effectiveDate: today }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should successfully add a new salary record', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue({ id: '1' });
      // Current active salary is different
      mockPrismaService.salaryRecord.findFirst.mockResolvedValue({
        amount: 5000,
      });
      // No duplicate date found
      mockPrismaService.salaryRecord.findFirst
        .mockResolvedValueOnce({ amount: 5000 })
        .mockResolvedValueOnce(null);

      const newRecord = { id: 's1', amount: 6000, effectiveDate: today };
      mockPrismaService.salaryRecord.create.mockResolvedValue(newRecord);

      const result = await service.addSalaryRecord('1', {
        amount: 6000,
        effectiveDate: today,
      });
      expect(result).toEqual(newRecord);
    });
  });

  describe('update', () => {
    const existingEmployee = {
      id: '1',
      email: 'old@example.com',
      departmentId: 'dept-1',
      roleId: 'role-1',
      countryId: 'country-1',
    };

    it('should throw NotFoundException if employee not found', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      await expect(
        service.update('1', {
          status: EmploymentStatus.DEACTIVE,
          type: EmploymentType.CONTRACTOR,
        }) as any,
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new email is already in use', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(existingEmployee);
      // New email is different, and count > 0 implies someone else uses it
      mockPrismaService.employee.count.mockResolvedValue(1);

      await expect(
        service.update('1', {
          email: 'new@example.com',
          status: EmploymentStatus.ACTIVE,
          type: EmploymentType.PART_TIME,
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if department is invalid', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(existingEmployee);
      mockPrismaService.department.findUnique.mockResolvedValue(null);

      await expect(
        service.update('1', {
          departmentId: 'invalid-dept',
          status: EmploymentStatus.ACTIVE,
          type: EmploymentType.FULL_TIME,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should successfully update an employee', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(existingEmployee);
      // Email unchanged or changed safely
      mockPrismaService.employee.count.mockResolvedValue(0);
      mockPrismaService.department.findUnique.mockResolvedValue({
        id: 'new-dept',
      });

      const updatedDto = {
        departmentId: 'new-dept',
        status: EmploymentStatus.DEACTIVE,
        type: EmploymentType.CONTRACTOR,
      };
      const expectedResult = { ...existingEmployee, ...updatedDto };
      mockPrismaService.employee.update.mockResolvedValue(expectedResult);

      const result = await service.update('1', updatedDto);

      expect(mockPrismaService.employee.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updatedDto,
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
