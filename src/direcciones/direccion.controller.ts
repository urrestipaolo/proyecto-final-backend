
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DireccionesService } from './direccion.service.js';
import { CreateDireccionDto } from './dto/create-direccion.dto.js';
import { UpdateDireccionDto } from './dto/update-direccion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Direcciones')
@Controller('direcciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva dirección de envío' })
  create(@Body() createDireccionDto: CreateDireccionDto) {
    return this.direccionesService.create(createDireccionDto);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener todas las direcciones de un usuario' })
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.direccionesService.findByUsuario(usuarioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener dirección por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar dirección' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDireccionDto: UpdateDireccionDto) {
    return this.direccionesService.update(id, updateDireccionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar dirección' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.direccionesService.remove(id);
  }
}

