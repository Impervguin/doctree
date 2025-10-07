export class NodeNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NodeNotFoundError';
    }
}

export class DocumentNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DocumentNotFoundError';
    }
}

export class DocumentAlreadyAttachedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DocumentAlreadyAttachedError';
    }
}

export class DocumentNotAttachedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DocumentNotAttachedError';
    }
}

export class DocumentNotLinkedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DocumentNotLinkedError';
    }
}

export class NoSelfreferenceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NoSelfreferenceError';
    }  
}