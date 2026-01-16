import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PassportService } from 'passport';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly passportService: PassportService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token is empty');

    const result = this.passportService.verify(token);

    if (!result.valid) throw new UnauthorizedException(result.reason);

    request.user = {
      id: result.userId,
    };

    return true;
  }

  private extractToken(request: Request) {
    const header = (request.headers.authorization ?? null) as string;

    if (!header)
      throw new UnauthorizedException('Authorization header missing');

    if (!header.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid token format');

    const token = header.split(' ')[1].trim();

    return token;
  }
}
