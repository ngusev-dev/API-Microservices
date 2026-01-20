import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../guards';
import type { Role } from 'contracts/gen/account';
import { Roles } from './roles.decorator';

export const Protected = (...roles: Role[]) => {
  if (!roles.length) return applyDecorators(UseGuards(AuthGuard));

  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
};
