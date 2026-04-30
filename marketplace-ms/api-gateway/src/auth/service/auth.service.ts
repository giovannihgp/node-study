import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { serviceConfig } from '@/config/gateway.config.js';
import type { LoginDto } from '../dtos/login.dto.js';
import type { RegisterDto } from '../dtos/register.dto.js';
import { AxiosError } from 'axios';
import { BadRequestException } from '@nestjs/common';

export interface UserSession {
  valid: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  } | null;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firsrName: string;
    lastName: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  validateJwtToken(token: string): Promise<AuthResponse> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }

      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  async validateSessionToken(sessionToken: string): Promise<UserSession> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<UserSession>(
          `${serviceConfig.users.url}/sessions/validate/${sessionToken}`,
          { timeout: serviceConfig.users.timeout },
        ),
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException('Invalid session token');
        }

        throw new UnauthorizedException(
          error.response?.data || 'Session validation failed',
        );
      }

      throw new UnauthorizedException('Unknown error');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${serviceConfig.users.url}/login`, loginDto, {
          timeout: serviceConfig.users.timeout,
        }),
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException('Invalid login credentials');
        }

        throw new UnauthorizedException(
          error.response?.data || 'Auth service error',
        );
      }

      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }

      throw new UnauthorizedException('Unknon error');
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${serviceConfig.users.url}/auth/register`,
          registerDto,
          { timeout: serviceConfig.users.timeout },
        ),
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BadRequestException(
          error.response?.data || 'Registration failed',
        );
      }

      throw new BadRequestException('Unknown error');
    }
  }
}
