import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoOrdenEnum } from '../generated/prisma/enums.js';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const {
      usuarioId,
      cajaId,
      direccionId,
      tipoOrigen,
      metodoPago,
      detalles,
    } = dto;

    // 1. Validar que detalles sea un arreglo válido
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      throw new BadRequestException('Debe incluir al menos un producto en detalles');
    }

    // 2. Calcular total de la venta
    const total = detalles.reduce(
      (acc: number, item: any) => acc + (Number(item.cantidad) * Number(item.precioUnitario)),
      0,
    );

    // 3. Construir el objeto de datos filtrando valores nulos para Prisma
    const dataToCreate: any = {
      usuarioId: Number(usuarioId),
      tipoOrigen,
      metodoPago,
      total,
      estado: EstadoOrdenEnum.PENDIENTE,
      detalles: {
        create: detalles.map((d: any) => ({
          productoId: Number(d.productoId),
          cantidad: Number(d.cantidad),
          precioUnitario: Number(d.precioUnitario),
          subtotal: Number(d.cantidad) * Number(d.precioUnitario),
        })),
      },
    };

    // Solo agregar cajaId y direccionId si realmente tienen valor (no null/undefined)
    if (cajaId) dataToCreate.cajaId = Number(cajaId);
    if (direccionId) dataToCreate.direccionId = Number(direccionId);

    try {
      const ventaOrden = await this.prisma.ventaOrden.create({
        data: dataToCreate,
        include: { detalles: true },
      });

      return ventaOrden;
    } catch (error) {
      // Si falla Prisma (por ejemplo por una clave foránea inexistente)
      console.error('Error de Prisma al crear venta:', error);
      throw new BadRequestException(
        `Error al registrar la venta en la base de datos: ${'Verifica que los IDs (usuario, caja, dirección, productos) existan.'}`
      );
    }
  }

  async actualizarEstadoPago(ventaOrdenId: number, estado: EstadoOrdenEnum) {
    const orden = await this.prisma.ventaOrden.findUnique({
      where: { id: ventaOrdenId },
    });

    if (!orden) {
      throw new NotFoundException(`La orden #${ventaOrdenId} no existe`);
    }

    return await this.prisma.ventaOrden.update({
      where: { id: ventaOrdenId },
      data: { estado },
    });
  }
}