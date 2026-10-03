import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDireccionDto {
  @ApiProperty({ example: 1, description: 'ID del usuario dueño de la dirección' })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ example: 'Av. Principal 123, Depto 402', description: 'Dirección exacta' })
  @IsString()
  @IsNotEmpty()
  direccionLinea: string;

  @ApiPropertyOptional({ example: 'Frente al parque central', description: 'Referencia para entrega' })
  @IsString()
  @IsOptional()
  referencia?: string;

  @ApiProperty({ example: 'Lima', description: 'Ciudad' })
  @IsString()
  @IsNotEmpty()
  ciudad: string;
}