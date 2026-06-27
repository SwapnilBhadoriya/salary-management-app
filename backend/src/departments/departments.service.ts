import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDepartmentDto {
  name: string;
}

export interface UpdateDepartmentDto {
  name: string;
}

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto) {
    const trimmedName = dto.name.trim();
    const departments = await this.prisma.department.findMany();
    const existing = departments.find(
      (d) => d.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(
        `Department with name "${trimmedName}" already exists`,
      );
    }

    return this.prisma.department.create({
      data: { name: trimmedName },
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }
    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    await this.findOne(id);

    const trimmedName = dto.name.trim();
    const departments = await this.prisma.department.findMany();
    const conflicting = departments.find(
      (d) => d.name.toLowerCase() === trimmedName.toLowerCase() && d.id !== id,
    );
    if (conflicting) {
      throw new ConflictException(
        `Department with name "${trimmedName}" already exists`,
      );
    }

    return this.prisma.department.update({
      where: { id },
      data: { name: trimmedName },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const employeeCount = await this.prisma.employee.count({
      where: { departmentId: id },
    });
    if (employeeCount > 0) {
      throw new ConflictException(
        `Cannot delete department with active employees`,
      );
    }

    return this.prisma.department.delete({
      where: { id },
    });
  }
}
