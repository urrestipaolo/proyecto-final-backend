import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriasService } from './categoria.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolEnum } from '../generated/prisma/enums.js';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear categoría (Solo Admin)' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de categorías (Público)' })
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID con sus productos' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar categoría (Solo Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar categoría (Solo Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }
}