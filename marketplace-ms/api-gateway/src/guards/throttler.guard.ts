import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard implements ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return `${req.ip}-${req.headers['user-agent']}`;
  }
}
