import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { serviceConfig } from '@/config/gateway.config.js';
import { firstValueFrom } from 'rxjs';
import { CircuitBreakerService } from '@/common/circuit-breaker/circuit-breaker.service.js';
import { CacheFallbackService } from '@/common/fallback/cache.fallback.js';
import { DefaultFallbackService } from '@/common/fallback/default.fallback.js';
import { TimeoutService } from '@/common/timeout/timeout.service.js';
import { RetryService } from '@/common/retry/retry.service.js';

interface UserInfo {
  userId: string;
  email: string;
  role: string;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly cacheFallbackService: CacheFallbackService,
    private readonly defaultFallbackService: DefaultFallbackService,
    private readonly timeoutService: TimeoutService,
    private readonly retryService: RetryService,
  ) {}

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: unknown,
    headers?: Record<string, string>,
    userInfo?: UserInfo,
  ) {
    const service = serviceConfig[serviceName];
    const url = `${service.url}${path}`;

    this.logger.log(`Proxying ${method} request to ${serviceName}: ${url}`);

    const fallback = this.createServiceFallback(serviceName, method, path);

    return this.circuitBreakerService.executeWithCircuitBreaker(
      async () => {
        return await this.retryService.executeWithExponentialBackoff(
          async () => {
            return await this.timeoutService.executeWithCustomTimeout(
              async () => {
                const enhancedHeaders = {
                  ...headers,
                  'x-user-id': userInfo?.userId,
                  'x-user-email': userInfo?.email,
                  'x-user-role': userInfo?.role,
                };

                const response = await firstValueFrom(
                  this.httpService.request({
                    method: method.toLowerCase() as HttpMethod,
                    url,
                    data,
                    headers: enhancedHeaders,
                    timeout: service.timeout,
                  }),
                );

                if (method.toLowerCase() === 'get') {
                  this.cacheFallbackService.setCachedData(
                    `${serviceName}-${path}`,
                    response.data,
                  );
                }

                return response.data;
              },
              service.timeout,
            );
          },
          4,
        );
      },
      `proxy-${serviceName}`,
      { failureThreshold: 3, timeout: 30000, resetTimeout: 30000 },
      fallback,
    );
  }

  async getServiceHealth(serviceName: keyof typeof serviceConfig) {
    try {
      const service = serviceConfig[serviceName];

      const response = await firstValueFrom(
        this.httpService.get(`${service}/health`, {
          timeout: 3000,
        }),
      );

      return { status: 'healthy', data: response.data };
    } catch (error) {
      if (error instanceof Error) {
        return { status: 'unhealthy', error: error.message };
      }
      return { status: 'unhealthy', error: 'Unknown error' };
    }
  }

  private createServiceFallback(
    serviceName: string,
    method: string,
    path: string,
  ) {
    switch (serviceName) {
      case 'users':
        if (path.includes('/auth/login')) {
          return this.defaultFallbackService.createErrorFallback(
            'users',
            'Authentication service unavailable',
          );
        }

        return this.defaultFallbackService.createErrorFallback(
          'users',
          'User service unavailable',
        );
      case 'products':
        if (method.toLowerCase() === 'get') {
          return this.cacheFallbackService.createCacheFallback(
            `products-${path}`,
            { products: [], total: 0, page: 1, limit: 10 },
          );
        }

        return this.defaultFallbackService.createErrorFallback(
          'products',
          'Product service unavailable',
        );
      case 'checkout':
      case 'payments':
        return this.defaultFallbackService.createErrorFallback(
          serviceName,
          `${serviceName} service unavailable`,
        );
      default:
        return this.defaultFallbackService.createErrorFallback(
          serviceName,
          'Service unavailable',
        );
    }
  }
}
