import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'cliente@correo.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  passwordHash: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: '+51987654321', description: 'Teléfono de contacto' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({ example: 3, description: 'ID del rol asignado (1: ADMIN, 2: CAJERO, 3: CLIENTE)' })
  @IsInt()
  @IsNotEmpty()
  rolId: number;
}