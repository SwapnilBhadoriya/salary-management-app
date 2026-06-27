import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const trimmedName = dto.name.trim();
    const roles = await this.prisma.role.findMany();
    const existing = roles.find(
      (r) => r.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(
        `Role with name "${trimmedName}" already exists`,
      );
    }

    return this.prisma.role.create({
      data: { name: trimmedName },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);

    const trimmedName = dto.name.trim();
    const roles = await this.prisma.role.findMany();
    const conflicting = roles.find(
      (r) => r.name.toLowerCase() === trimmedName.toLowerCase() && r.id !== id,
    );
    if (conflicting) {
      throw new ConflictException(
        `Role with name "${trimmedName}" already exists`,
      );
    }

    return this.prisma.role.update({
      where: { id },
      data: { name: trimmedName },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const employeeCount = await this.prisma.employee.count({
      where: { roleId: id },
    });
    if (employeeCount > 0) {
      throw new ConflictException(
        `Cannot delete role with ID "${id}" because it has associated employees`,
      );
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}
