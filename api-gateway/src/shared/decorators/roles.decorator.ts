import { SetMetadata } from '@nestjs/common';
import type { Role } from 'contracts/gen/account';

export const ROLES_KEY = 'required_roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
