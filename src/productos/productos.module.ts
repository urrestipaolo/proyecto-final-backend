import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { ProductosController } from './productos.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}