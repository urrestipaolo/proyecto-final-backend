import { SetMetadata } from '@nestjs/common';
import { RolEnum } from '../../generated/prisma/client.js';
export const Roles = (...roles: RolEnum[]) => SetMetadata('roles', roles);
