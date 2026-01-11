import { ZodError } from 'zod';

export class RequestValidationError extends Error {
  readonly zodError: ZodError;

  constructor(error: ZodError) {
    super('Request validation failed');
    this.name = 'RequestValidationError';
    this.zodError = error;
  }
}
