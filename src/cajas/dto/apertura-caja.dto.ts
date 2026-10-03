import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AperturaCajaDto {
  @ApiProperty({ example: 1, description: 'ID del usuario (Cajero) que abre la caja' })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ example: 200.00, description: 'Monto de dinero base al abrir caja' })
  @IsNumber()
  @Min(0)
  montoApertura: number;
}