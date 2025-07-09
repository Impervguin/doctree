class NodeNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ConflictException extends Error {
  constructor(message: string) {
    super(message);
  }
}