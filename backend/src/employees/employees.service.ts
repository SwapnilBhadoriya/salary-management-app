import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateSalaryRecordDto } from './dto/create-salary-record.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeDate(dateInput: Date | string): Date {
    const date = new Date(dateInput);
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const {
      name,
      email,
      departmentId,
      roleId,
      countryId,
      salary,
      effectiveDate,
    } = createEmployeeDto;

    if (salary <= 0) {
      throw new BadRequestException('Salary must be a positive number');
    }

    const [deptCount, roleCount, countryCount, emailCount] = await Promise.all([
      this.prisma.department.count({ where: { id: departmentId } }),
      this.prisma.role.count({ where: { id: roleId } }),
      this.prisma.country.count({ where: { id: countryId } }),
      this.prisma.employee.count({ where: { email } }),
    ]);

    if (!deptCount) {
      throw new NotFoundException('Department not found');
    }

    if (!roleCount) {
      throw new NotFoundException('Role not found');
    }

    if (!countryCount) {
      throw new NotFoundException('Country not found');
    }

    if (emailCount > 0) {
      throw new ConflictException('Email already in use');
    }

    const normalizedEffectiveDate = this.normalizeDate(
      effectiveDate || new Date(),
    );

    return this.prisma.$transaction(async (tx) => {
      // Upsert the sequence to ensure it exists and increments safely
      const sequence = await tx.sequence.upsert({
        where: { name: 'employeeId' },
        update: { value: { increment: 1 } },
        create: { name: 'employeeId', value: 1 },
      });

      const paddedValue = sequence.value.toString().padStart(5, '0');
      const employeeId = `EMP-${paddedValue}`;

      return tx.employee.create({
        data: {
          employeeId,
          name,
          email,
          departmentId,
          roleId,
          countryId,
          salaryRecords: {
            create: [
              {
                amount: salary,
                effectiveDate: normalizedEffectiveDate,
              },
            ],
          },
        },
      });
    });
  }

  async findAll(query: Record<string, string>) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { employeeId: query.search },
        { email: query.search },
      ];
    }
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.roleId) where.roleId = query.roleId;
    if (query.countryId) where.countryId = query.countryId;

    const [total, employees] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: true,
          role: true,
          country: true,
          salaryRecords: {
            where: { effectiveDate: { lte: new Date() } },
            orderBy: { effectiveDate: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    const data = employees.map((emp) => ({
      ...emp,
      currentSalary: emp.salaryRecords.length > 0 ? emp.salaryRecords[0] : null,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        role: true,
        country: true,
        salaryRecords: {
          where: { effectiveDate: { lte: new Date() } },
          orderBy: { effectiveDate: 'desc' },
          take: 1,
        },
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return {
      ...employee,
      currentSalary:
        employee.salaryRecords.length > 0 ? employee.salaryRecords[0] : null,
    };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const emailCount = await this.prisma.employee.count({
        where: { email: updateEmployeeDto.email },
      });
      if (emailCount > 0) throw new ConflictException('Email already in use');
    }

    if (updateEmployeeDto.departmentId) {
      const dept = await this.prisma.department.findUnique({
        where: { id: updateEmployeeDto.departmentId },
      });
      if (!dept) throw new NotFoundException('Department not found');
    }
    if (updateEmployeeDto.roleId) {
      const role = await this.prisma.role.findUnique({
        where: { id: updateEmployeeDto.roleId },
      });
      if (!role) throw new NotFoundException('Role not found');
    }
    if (updateEmployeeDto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: { id: updateEmployeeDto.countryId },
      });
      if (!country) throw new NotFoundException('Country not found');
    }

    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.employee.delete({ where: { id } });
  }

  async addSalaryRecord(
    id: string,
    createSalaryRecordDto: CreateSalaryRecordDto,
  ) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    const normalizedDate = this.normalizeDate(
      createSalaryRecordDto.effectiveDate,
    );

    // Fetch the current active salary (latest where effectiveDate <= now)
    const currentSalary = await this.prisma.salaryRecord.findFirst({
      where: {
        employeeId: id,
        effectiveDate: { lte: new Date() },
      },
      orderBy: { effectiveDate: 'desc' },
    });

    if (
      currentSalary &&
      Number(currentSalary.amount) === createSalaryRecordDto.amount
    ) {
      throw new UnprocessableEntityException(
        'New salary amount must be different from the current active salary',
      );
    }

    // Check if there is already a record on the exact normalized date
    const exactDateRecord = await this.prisma.salaryRecord.findFirst({
      where: {
        employeeId: id,
        effectiveDate: normalizedDate,
      },
    });

    if (exactDateRecord) {
      throw new ConflictException(
        'A salary record already exists for this effective date',
      );
    }

    return this.prisma.salaryRecord.create({
      data: {
        employeeId: id,
        amount: createSalaryRecordDto.amount,
        effectiveDate: normalizedDate,
      },
    });
  }

  async getSalaryHistory(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.salaryRecord.findMany({
      where: { employeeId: id },
      orderBy: { effectiveDate: 'desc' },
    });
  }
}
