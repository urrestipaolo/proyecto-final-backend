import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetodoPagoEnum } from '../../generated/prisma/enums.js';

export class CheckoutDto {
  @ApiProperty({ enum: MetodoPagoEnum, example: MetodoPagoEnum.TARJETA })
  @IsEnum(MetodoPagoEnum)
  metodoPago: MetodoPagoEnum;

  @ApiPropertyOptional({ example: 1, description: 'ID de una dirección del usuario (entrega a domicilio)' })
  @IsOptional()
  @IsInt()
  direccionId?: number;
}