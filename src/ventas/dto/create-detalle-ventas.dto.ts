import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleVentaDto {
  @ApiProperty({ example: 1, description: 'ID del producto a vender' })
  @IsNumber()
  @IsNotEmpty()
  productoId: number;

  @ApiProperty({ example: 2, description: 'Cantidad comprada' })
  @IsNumber()
  @Min(1)
  cantidad: number;
}