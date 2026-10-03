import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@comercio.com', description: 'Correo electrónico registrado' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
