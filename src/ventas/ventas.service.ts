import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVentaDto } from './dto/create-ventas.dto.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { EstadoOrdenEnum, TipoOrigenEnum } from '../generated/prisma/enums.js';
import type { Prisma } from '../generated/prisma/client.js';

const INCLUDE_VENTA = {
  usuario: { select: { id: true, nombre: true, email: true } },
  detalles: { include: { producto: true } },
} as const;

type ItemVenta = { productoId: number; cantidad: number };

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  // Venta directa (POS): los productos vienen en el body
  async create(dto: CreateVentaDto) {
    const { clienteId, tipoOrigen, metodoPago, detalles } = dto;

    if (!detalles || detalles.length === 0) {
      throw new BadRequestException('La venta debe incluir al menos un producto');
    }

    const usuario = await this.prisma.usuario.findUnique({ where: { id: clienteId } });
    if (!usuario) {
      throw new BadRequestException(`El cliente con ID ${clienteId} no existe`);
    }

    return this.prisma.$transaction(async (tx) => {
      const { total, lineas } = await this.descontarStockYCalcular(tx, detalles);

      return tx.ventaOrden.create({
        data: {
          usuarioId: clienteId,
          tipoOrigen,
          metodoPago,
          estado:
            tipoOrigen === TipoOrigenEnum.POS
              ? EstadoOrdenEnum.PAGADO
              : EstadoOrdenEnum.PENDIENTE,
          total,
          detalles: { create: lineas },
        },
        include: INCLUDE_VENTA,
      });
    });
  }

  // Compra web: los productos salen del carrito del usuario autenticado
  async checkout(usuarioId: number, dto: CheckoutDto) {
    return this.prisma.$transaction(async (tx) => {
      const carrito = await tx.carrito.findUnique({
        where: { usuarioId },
        include: { detalles: true },
      });

      if (!carrito || carrito.detalles.length === 0) {
        throw new BadRequestException('El carrito está vacío');
      }

      if (dto.direccionId) {
        const direccion = await tx.direccion.findFirst({
          where: { id: dto.direccionId, usuarioId },
        });
        if (!direccion) {
          throw new BadRequestException(
            'La dirección no existe o no pertenece al usuario',
          );
        }
      }

      // Se vacía el carrito primero. Si otra petición (doble clic) ya lo consumió,
      // el conteo no coincide y se aborta, evitando dos órdenes del mismo carrito.
      const { count } = await tx.detalleCarrito.deleteMany({
        where: { id: { in: carrito.detalles.map((d) => d.id) } },
      });
      if (count !== carrito.detalles.length) {
        throw new ConflictException('El carrito ya fue procesado');
      }

      const { total, lineas } = await this.descontarStockYCalcular(tx, carrito.detalles);

      return tx.ventaOrden.create({
        data: {
          usuarioId,
          direccionId: dto.direccionId,
          tipoOrigen: TipoOrigenEnum.WEB,
          metodoPago: dto.metodoPago,
          estado: EstadoOrdenEnum.PENDIENTE,
          total,
          detalles: { create: lineas },
        },
        include: INCLUDE_VENTA,
      });
    });
  }

  async findAll() {
    return this.prisma.ventaOrden.findMany({
      include: INCLUDE_VENTA,
      orderBy: { creadoEn: 'desc' },
    });
  }

  async findOne(id: number) {
    const venta = await this.prisma.ventaOrden.findUnique({
      where: { id },
      include: INCLUDE_VENTA,
    });
    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return venta;
  }

  private async descontarStockYCalcular(
    tx: Prisma.TransactionClient,
    items: ItemVenta[],
  ) {
    let total = 0;
    const lineas: {
      productoId: number;
      cantidad: number;
      precioUnitario: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const producto = await tx.producto.findUnique({ where: { id: item.productoId } });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${item.productoId} no encontrado`);
      }
      if (!producto.activo) {
        throw new BadRequestException(`El producto '${producto.nombre}' no está disponible`);
      }

      // Descuento atómico: solo actualiza si todavía hay stock suficiente
      const { count } = await tx.producto.updateMany({
        where: { id: producto.id, stock: { gte: item.cantidad } },
        data: { stock: { decrement: item.cantidad } },
      });
      if (count === 0) {
        throw new BadRequestException(
          `Stock insuficiente para el producto '${producto.nombre}'`,
        );
      }

      const precioUnitario = Number(producto.precioVenta);
      const subtotal = Math.round(precioUnitario * item.cantidad * 100) / 100;
      total += subtotal;

      lineas.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
      });
    }

    return { total: Math.round(total * 100) / 100, lineas };
  }
}