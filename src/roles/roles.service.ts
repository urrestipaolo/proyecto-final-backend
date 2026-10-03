import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRoleDto } from './dto/create-roles.dto.js';
import { UpdateRoleDto } from './dto/update-roles.dto.js';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.prisma.rol.findUnique({
      where: { nombre: createRoleDto.nombre },
    });
    if (existing) {
      throw new ConflictException(`El rol ${createRoleDto.nombre} ya existe`);
    }
    return this.prisma.rol.create({
      data: createRoleDto,
    });
  }

  async findAll() {
    return this.prisma.rol.findMany();
  }

  async findOne(id: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { id },
    });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);
    return this.prisma.rol.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.rol.delete({
      where: { id },
    });
  }
}