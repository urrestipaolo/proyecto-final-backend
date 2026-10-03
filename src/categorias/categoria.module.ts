import { Module } from '@nestjs/common';
import { CategoriasService } from './categoria.service.js';
import { CategoriasController } from './categoria.controller.js';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}