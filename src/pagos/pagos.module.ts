import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller.js';
import { PagosService } from './pagos.service.js';

@Module({
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}