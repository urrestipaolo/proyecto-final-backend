import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDireccionDto } from './dto/create-direccion.dto.js';
import { UpdateDireccionDto } from './dto/update-direccion.dto.js';

@Injectable()
export class DireccionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDireccionDto: CreateDireccionDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createDireccionDto.usuarioId },
    });
    if (!usuario) {
      throw new BadRequestException(`El usuario con ID ${createDireccionDto.usuarioId} no existe`);
    }

    return this.prisma.direccion.create({
      data: createDireccionDto,
    });
  }

  async findByUsuario(usuarioId: number) {
    return this.prisma.direccion.findMany({
      where: { usuarioId },
    });
  }

  async findOne(id: number) {
    const direccion = await this.prisma.direccion.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nombre: true, email: true } } },
    });
    if (!direccion) {
      throw new NotFoundException(`Dirección con ID ${id} no encontrada`);
    }
    return direccion;
  }

  async update(id: number, updateDireccionDto: UpdateDireccionDto) {
    await this.findOne(id);
    return this.prisma.direccion.update({
      where: { id },
      data: updateDireccionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.direccion.delete({
      where: { id },
    });
  }
}