import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolEnum } from '../../generated/prisma/enums.js';

export class CreateRoleDto {
  @ApiProperty({
    enum: RolEnum,
    example: RolEnum.CLIENTE,
    description: 'Nombre del rol (ADMIN, CAJERO, CLIENTE)',
  })
  @IsEnum(RolEnum)
  @IsNotEmpty()
  nombre: RolEnum;
}