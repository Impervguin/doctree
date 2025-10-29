import { HttpException } from '@nestjs/common';

export class NotFoundError extends HttpException {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, 409);
  }
}

export class ReadOnlyModeError extends HttpException {
  constructor(message: string = 'This operation is not allowed in read-only mode') {
    super(message, 403);
  }
}