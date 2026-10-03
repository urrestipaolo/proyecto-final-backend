// src/cajas/cajas.module.ts
import { Module } from '@nestjs/common';
import { CajasService } from './caja.service.js';
import { CajasController } from './caja.controller.js';

@Module({
  controllers: [CajasController],
  providers: [CajasService],
  exports: [CajasService],
})
export class CajasModule {}