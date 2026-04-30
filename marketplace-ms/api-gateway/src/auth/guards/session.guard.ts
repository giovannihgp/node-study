import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import type { AuthService } from '../service/auth.service.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const sessionToken = request.headers['x-session-token'];

    if (!sessionToken) {
      throw new UnauthorizedException('Session token required');
    }

    try {
      const session = await this.authService.validateSessionToken(sessionToken);

      if (!session.valid || !session.user) {
        throw new UnauthorizedException('Invalid session token');
      }

      request.user = session.user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof Error) {
        console.error(error.message);
      }

      throw new UnauthorizedException('Invalid session token');
    }
  }
}
