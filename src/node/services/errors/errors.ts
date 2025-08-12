import { HttpException } from '@nestjs/common';

export class NodeNotFoundError extends HttpException {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, 409);
  }
}