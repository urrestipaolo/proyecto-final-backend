// src/direcciones/direcciones.module.ts
import { Module } from '@nestjs/common';
import { DireccionesService } from './direccion.service.js';
import { DireccionesController } from './direccion.controller.js';

@Module({
  controllers: [DireccionesController],
  providers: [DireccionesService],
  exports: [DireccionesService],
})
export class DireccionesModule {}