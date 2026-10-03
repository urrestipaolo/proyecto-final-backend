import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;

  @ApiProperty({ example: 'PROD-001', description: 'SKU único del producto' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Teclado Mecánico RGB', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 80.00, description: 'Precio de compra/costo' })
  @IsNumber()
  @Min(0)
  precioCompra: number;

  @ApiProperty({ example: 120.00, description: 'Precio de venta al público' })
  @IsNumber()
  @Min(0)
  precioVenta: number;

  @ApiProperty({ example: 50, description: 'Stock inicial disponible' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: true, description: 'Estado activo o inactivo del producto' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}