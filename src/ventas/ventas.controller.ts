import { Controller, Post, Body } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { PagosService } from '../pagos/pagos.service.js';

@Controller('ventas')
export class VentasController {
  constructor(
    private readonly ventasService: VentasService,
    private readonly pagosService: PagosService,
  ) {}

  @Post()
  async create(@Body() createVentaDto: any) {
    const ventaOrden = await this.ventasService.create(createVentaDto);

    let datosPago = null;
    if (
      createVentaDto.metodoPago === 'TARJETA' ||
      createVentaDto.metodoPago === 'TRANSFERENCIA_QR'
    ) {
      datosPago = await this.pagosService.crearIntencionPago(ventaOrden.id);
    }

    return {
      ventaOrden,
      pago: datosPago,
    };
  }
}