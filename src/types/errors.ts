export class DIDError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DIDError';
    }
}

export class StorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StorageError';
    }
}

export class ProofError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProofError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class WalletError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WalletError';
    }
} 