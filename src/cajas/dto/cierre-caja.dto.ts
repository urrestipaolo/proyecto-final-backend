import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CierreCajaDto {
  @ApiProperty({ example: 850.50, description: 'Monto total en efectivo al cerrar la caja' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  montoCierre: number;
}