import { IsIn, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleVentaDto {
  @ApiProperty({ example: 1, description: 'ID del producto a vender' })
  @IsInt()
  @IsNotEmpty()
  productoId: number;

  @ApiProperty({ example: 2, description: 'Cantidad comprada' })
  @IsInt()
  @Min(1)
  cantidad: number;
}