import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Electrónica', description: 'Nombre único de la categoría' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Dispositivos y accesorios electrónicos', description: 'Descripción opcional' })
  @IsString()
  @IsOptional()
  descripcion?: string;
}