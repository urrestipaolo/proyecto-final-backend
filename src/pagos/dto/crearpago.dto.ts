import { IsInt } from 'class-validator';

export class CrearPagoDto {
  @IsInt()
  ventaId: number;
}