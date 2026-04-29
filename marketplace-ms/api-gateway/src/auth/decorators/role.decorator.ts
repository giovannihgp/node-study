import { SetMetadata } from '@nestjs/common';

export const ROLES_IS = 'roles';
export const Role = (...roles: string[]) => SetMetadata(ROLES_IS, roles);
