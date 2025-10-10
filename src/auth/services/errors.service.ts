

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

export class Wrong2FACodeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Wrong2FACodeError';
    }
}

export class UserLockedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserLockedError';
    }
}

export class Need2FAError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Need2FAError';
    }
}

export class WrongResetPasswordTokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WrongResetPasswordTokenError';
    }
}