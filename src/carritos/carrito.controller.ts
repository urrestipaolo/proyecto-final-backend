// src/carritos/carritos.controller.ts
import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CarritosService } from './carrito.service.js';
import { AgregarItemDto } from './dto/agregar-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Carritos E-commerce')
@Controller('carritos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CarritosController {
  constructor(private readonly carritosService: CarritosService) {}

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener carrito de compras del usuario' })
  obtenerCarrito(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritosService.obtenerOCrearCarrito(usuarioId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Agregar un producto al carrito' })
  agregarItem(@Body() dto: AgregarItemDto) {
    return this.carritosService.agregarItem(dto);
  }

  @Delete('items/:detalleId')
  @ApiOperation({ summary: 'Remover un item del carrito por su ID de detalle' })
  eliminarItem(@Param('detalleId', ParseIntPipe) detalleId: number) {
    return this.carritosService.eliminarItem(detalleId);
  }

  @Delete('usuario/:usuarioId/vaciar')
  @ApiOperation({ summary: 'Vaciar todo el contenido del carrito de un usuario' })
  vaciarCarrito(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritosService.vaciarCarrito(usuarioId);
  }
}

