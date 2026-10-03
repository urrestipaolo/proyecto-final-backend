import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller.js';
import { VentasService } from './ventas.service.js';
import { PagosModule } from '../pagos/pagos.module.js';

@Module({
  imports: [PagosModule],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}