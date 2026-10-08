import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-ventas.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolEnum } from '../generated/prisma/enums.js';
import { CheckoutDto } from './dto/checkout.dto.js';

@ApiTags('Ventas')
@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('checkout')
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO, RolEnum.CLIENTE)
  @ApiOperation({ summary: 'Comprar los productos del carrito del usuario autenticado' })
  checkout(@Req() req: { user: { userId: number } }, @Body() dto: CheckoutDto) {
    return this.ventasService.checkout(req.user.userId, dto); 
  }

  @Post()
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO, RolEnum.CLIENTE)
  @ApiOperation({ summary: 'Registrar nueva venta y descontar stock automáticamente' })
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO)
  @ApiOperation({ summary: 'Listar historial completo de ventas (Admin y Cajero)' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @Roles(RolEnum.ADMIN, RolEnum.CAJERO, RolEnum.CLIENTE)
  @ApiOperation({ summary: 'Obtener detalle de una venta por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }
}