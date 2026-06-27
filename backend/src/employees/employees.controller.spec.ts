/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateSalaryRecordDto } from './dto/create-salary-record.dto';
import { validate } from 'class-validator';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  const mockEmployeesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addSalaryRecord: jest.fn(),
    getSalaryHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Route Mapping', () => {
    it('should call create', async () => {
      const dto: CreateEmployeeDto = {
        name: 'John Doe',
        email: 'john@example.com',
        departmentId: 'dept-id',
        roleId: 'role-id',
        countryId: 'country-id',
        salary: 5000,
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should call findAll', async () => {
      const query = { page: 1, limit: 10 };
      await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should call findOne', async () => {
      await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should call update', async () => {
      const dto: UpdateEmployeeDto = { name: 'Jane Doe' };
      await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });

    it('should call remove', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should call addSalaryRecord', async () => {
      const dto: CreateSalaryRecordDto = {
        amount: 6000,
        effectiveDate: new Date(),
      };
      await controller.addSalaryRecord('1', dto);
      expect(service.addSalaryRecord).toHaveBeenCalledWith('1', dto);
    });

    it('should call getSalaryHistory', async () => {
      await controller.getSalaryHistory('1');
      expect(service.getSalaryHistory).toHaveBeenCalledWith('1');
    });
  });

  describe('DTO Validation', () => {
    it('should reject CreateEmployeeDto with invalid fields', async () => {
      const dto = new CreateEmployeeDto();
      dto.name = ''; // invalid
      dto.email = 'not-an-email'; // invalid
      dto.departmentId = 'not-a-uuid'; // invalid
      dto.salary = -100; // invalid

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const errorProperties = errors.map((e) => e.property);
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('email');
      expect(errorProperties).toContain('departmentId');
      expect(errorProperties).toContain('salary');
      expect(errorProperties).toContain('roleId');
      expect(errorProperties).toContain('countryId');
    });

    it('should reject CreateSalaryRecordDto with invalid fields', async () => {
      const dto = new CreateSalaryRecordDto();
      dto.amount = -500; // invalid
      // effectiveDate is missing

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const errorProperties = errors.map((e) => e.property);
      expect(errorProperties).toContain('amount');
      expect(errorProperties).toContain('effectiveDate');
    });
  });
});
