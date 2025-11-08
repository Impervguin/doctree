

export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

export class IncorrectPasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IncorrectPasswordError';
    }
}

export class NotIdError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotIdError';
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}