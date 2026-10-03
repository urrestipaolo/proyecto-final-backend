import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgregarItemDto {
  @ApiProperty({ example: 1, description: 'ID del usuario cliente' })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ example: 5, description: 'ID del producto a agregar al carrito' })
  @IsNumber()
  @IsNotEmpty()
  productoId: number;

  @ApiProperty({ example: 1, description: 'Cantidad seleccionada' })
  @IsNumber()
  @Min(1)
  cantidad: number;
}