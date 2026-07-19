import pino from 'pino';

export function createLogger(level: string) {
  return pino({
    level,
    base: { service: 'ksforge-sentinel' },
    redact: {
      paths: ['token', '*.token', 'authorization', '*.authorization'],
      censor: '[REDACTED]'
    }
  });
}

export type Logger = ReturnType<typeof createLogger>;
