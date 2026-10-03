// src/carritos/carritos.module.ts
import { Module } from '@nestjs/common';
import { CarritosService } from './carrito.service.js';
import { CarritosController } from './carrito.controller.js';

@Module({
  controllers: [CarritosController],
  providers: [CarritosService],
  exports: [CarritosService],
})
export class CarritosModule {}