import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AgregarItemDto } from './dto/agregar-item.dto.js';

@Injectable()
export class CarritosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerOCrearCarrito(usuarioId: number) {
    let carrito = await this.prisma.carrito.findUnique({
      where: { usuarioId },
      include: {
        detalles: {
          include: { producto: true },
        },
      },
    });

    if (!carrito) {
      carrito = await this.prisma.carrito.create({
        data: { usuarioId },
        include: {
          detalles: {
            include: { producto: true },
          },
        },
      });
    }

    return carrito;
  }

  async agregarItem(dto: AgregarItemDto) {
    const { usuarioId, productoId, cantidad } = dto;

    // 1. Validar existencia del producto y stock
    const producto = await this.prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }

    if (producto.stock < cantidad) {
      throw new BadRequestException(`Stock insuficiente. Disponible: ${producto.stock}`);
    }

    // 2. Obtener carrito activo del usuario
    const carrito = await this.obtenerOCrearCarrito(usuarioId);

    // 3. Verificar si el ítem ya existe en el carrito
    const itemExistente = await this.prisma.detalleCarrito.findFirst({
      where: {
        carritoId: carrito.id,
        productoId,
      },
    });

    if (itemExistente) {
      return this.prisma.detalleCarrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: itemExistente.cantidad + cantidad },
      });
    }

    return this.prisma.detalleCarrito.create({
      data: {
        carritoId: carrito.id,
        productoId,
        cantidad,
      },
    });
  }

  async eliminarItem(detalleId: number) {
    const detalle = await this.prisma.detalleCarrito.findUnique({ where: { id: detalleId } });
    if (!detalle) {
      throw new NotFoundException(`Item de carrito con ID ${detalleId} no encontrado`);
    }

    return this.prisma.detalleCarrito.delete({
      where: { id: detalleId },
    });
  }

  async vaciarCarrito(usuarioId: number) {
    const carrito = await this.obtenerOCrearCarrito(usuarioId);
    return this.prisma.detalleCarrito.deleteMany({
      where: { carritoId: carrito.id },
    });
  }
}