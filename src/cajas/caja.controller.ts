// src/cajas/cajas.controller.ts
import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CajasService } from './caja.service.js';
import { AperturaCajaDto } from './dto/apertura-caja.dto.js';
import { CierreCajaDto } from './dto/cierre-caja.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolEnum } from '../generated/prisma/enums.js';

@ApiTags('Cajas POS')
@Controller('cajas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CajasController {
  constructor(private readonly cajasService: CajasService) {}

  @Post('apertura')
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO)
  @ApiOperation({ summary: 'Abrir turno de caja (Cajero/Admin)' })
  abrirCaja(@Body() aperturaDto: AperturaCajaDto) {
    return this.cajasService.abrirCaja(aperturaDto);
  }

  @Patch(':id/cierre')
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO)
  @ApiOperation({ summary: 'Cerrar turno de caja y registrar cuadre' })
  cerrarCaja(@Param('id', ParseIntPipe) id: number, @Body() cierreDto: CierreCajaDto) {
    return this.cajasService.cerrarCaja(id, cierreDto);
  }

  @Get()
  @Roles(RolEnum.ADMIN)
  @ApiOperation({ summary: 'Historial global de aperturas/cierres de caja (Admin)' })
  findAll() {
    return this.cajasService.findAll();
  }

  @Get(':id')
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO)
  @ApiOperation({ summary: 'Obtener detalle de una caja y sus ventas asociadas' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cajasService.findOne(id);
  }
}

