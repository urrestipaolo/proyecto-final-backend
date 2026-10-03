import { IsArray, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TipoOrigenEnum, MetodoPagoEnum } from '../../generated/prisma/enums.js';
import { CreateDetalleVentaDto } from './create-detalle-ventas.dto.js';

export class CreateVentaDto {
  @ApiProperty({ example: 1, description: 'ID del cliente/usuario' })
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({
    enum: TipoOrigenEnum,
    example: TipoOrigenEnum.POS, // o WEB / ECOMMERCE según tu enum
    description: 'Origen de la venta',
  })
  @IsEnum(TipoOrigenEnum)
  @IsNotEmpty()
  tipoOrigen: TipoOrigenEnum;

  @ApiProperty({
    enum: MetodoPagoEnum,
    example: MetodoPagoEnum.EFECTIVO, // o TARJETA, TRANSFERENCIA, etc.
    description: 'Método de pago utilizado',
  })
  @IsEnum(MetodoPagoEnum)
  @IsNotEmpty()
  metodoPago: MetodoPagoEnum;

  @ApiProperty({ type: [CreateDetalleVentaDto], description: 'Lista de productos a comprar' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];
}