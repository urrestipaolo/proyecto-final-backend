import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const existing = await this.prisma.categoria.findUnique({
      where: { nombre: createCategoriaDto.nombre },
    });
    if (existing) {
      throw new ConflictException(`La categoría '${createCategoriaDto.nombre}' ya existe`);
    }
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  async findAll() {
    return this.prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: true,
      },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    await this.findOne(id);
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}