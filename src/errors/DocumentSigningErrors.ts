export class DocumentSigningError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DocumentSigningError';
    }
}

export class EmptyContentError extends DocumentSigningError {
    constructor() {
        super('Content cannot be empty');
        this.name = 'EmptyContentError';
    }
}

export class NoVerificationMethodsError extends DocumentSigningError {
    constructor() {
        super('No verification methods available');
        this.name = 'NoVerificationMethodsError';
    }
}

export class KeyNotFoundError extends DocumentSigningError {
    constructor(keyId: string) {
        super(`Key not found: ${keyId}`);
        this.name = 'KeyNotFoundError';
    }
}

export class PrivateKeyNotAvailableError extends DocumentSigningError {
    constructor() {
        super('Private key not available for signing');
        this.name = 'PrivateKeyNotAvailableError';
    }
}

export class InvalidDocumentFormatError extends DocumentSigningError {
    constructor() {
        super('Invalid document format');
        this.name = 'InvalidDocumentFormatError';
    }
}

export class SigningOperationError extends DocumentSigningError {
    constructor(error: Error) {
        super(`Failed to create signature: ${error.message}`);
        this.name = 'SigningOperationError';
    }
} 