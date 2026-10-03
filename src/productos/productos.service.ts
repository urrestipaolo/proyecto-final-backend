import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    // Validar si la categoría existe
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: createProductoDto.categoriaId },
    });
    if (!categoria) {
      throw new BadRequestException(`La categoría con ID ${createProductoDto.categoriaId} no existe`);
    }

    return this.prisma.producto.create({
      data: createProductoDto,
      include: { categoria: true },
    });
  }

  async findAll() {
    return this.prisma.producto.findMany({
      include: { categoria: true },
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);

    if (updateProductoDto.categoriaId) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: updateProductoDto.categoriaId },
      });
      if (!categoria) {
        throw new BadRequestException(`La categoría con ID ${updateProductoDto.categoriaId} no existe`);
      }
    }

    return this.prisma.producto.update({
      where: { id },
      data: updateProductoDto,
      include: { categoria: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.producto.delete({
      where: { id },
    });
  }
}