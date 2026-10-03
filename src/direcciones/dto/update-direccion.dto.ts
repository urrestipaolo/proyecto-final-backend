import { PartialType } from '@nestjs/swagger';
import { CreateDireccionDto } from './create-direccion.dto.js';

export class UpdateDireccionDto extends PartialType(CreateDireccionDto) {}