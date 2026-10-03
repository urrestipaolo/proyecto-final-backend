import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-roles.dto.js';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}