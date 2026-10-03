import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AperturaCajaDto } from './dto/apertura-caja.dto.js';
import { CierreCajaDto } from './dto/cierre-caja.dto.js';
import { EstadoCajaEnum } from '../generated/prisma/enums.js';

@Injectable()
export class CajasService {
  constructor(private readonly prisma: PrismaService) {}

  async abrirCaja(aperturaDto: AperturaCajaDto) {
    // Verificar si el usuario ya tiene una caja abierta
    const cajaAbierta = await this.prisma.caja.findFirst({
      where: {
        usuarioId: aperturaDto.usuarioId,
        estado: EstadoCajaEnum.ABIERTA,
      },
    });

    if (cajaAbierta) {
      throw new BadRequestException(`El cajero ya tiene la Caja ID ${cajaAbierta.id} abierta`);
    }

    return this.prisma.caja.create({
      data: {
        usuarioId: aperturaDto.usuarioId,
        montoApertura: aperturaDto.montoApertura,
        estado: EstadoCajaEnum.ABIERTA,
      },
    });
  }

  async cerrarCaja(cajaId: number, cierreDto: CierreCajaDto) {
    const caja = await this.prisma.caja.findUnique({ where: { id: cajaId } });

    if (!caja) {
      throw new NotFoundException(`Caja con ID ${cajaId} no encontrada`);
    }

    if (caja.estado === EstadoCajaEnum.CERRADA) {
      throw new BadRequestException(`La caja con ID ${cajaId} ya se encuentra cerrada`);
    }

    return this.prisma.caja.update({
      where: { id: cajaId },
      data: {
        montoCierre: cierreDto.montoCierre,
        fechaCierre: new Date(),
        estado: EstadoCajaEnum.CERRADA,
      },
    });
  }

  async findAll() {
    return this.prisma.caja.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        _count: { select: { ventas: true } },
      },
      orderBy: { fechaApertura: 'desc' },
    });
  }

  async findOne(id: number) {
    const caja = await this.prisma.caja.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nombre: true } },
        ventas: true,
      },
    });

    if (!caja) {
      throw new NotFoundException(`Caja con ID ${id} no encontrada`);
    }

    return caja;
  }
}