export enum CircuitBreakerStateEnum {
  CLOSE = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALP_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
}

export interface CircuitBreakerState {
  state: CircuitBreakerStateEnum;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

export interface CircuitBreakerResult<T> {
  sucess: boolean;
  data?: T;
  error?: Error;
  fromCache?: boolean;
}
