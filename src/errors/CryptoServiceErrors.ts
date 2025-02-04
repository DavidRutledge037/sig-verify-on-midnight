export class CryptoServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CryptoServiceError';
    }
}

export class UnsupportedAlgorithmError extends CryptoServiceError {
    constructor(algorithm: string) {
        super(`Unsupported algorithm: ${algorithm}`);
        this.name = 'UnsupportedAlgorithmError';
    }
}

export class SigningError extends CryptoServiceError {
    constructor(error: Error) {
        super(`Failed to create signature: ${error.message}`);
        this.name = 'SigningError';
    }
}

export class VerificationError extends CryptoServiceError {
    constructor(error: Error) {
        super(`Failed to verify signature: ${error.message}`);
        this.name = 'VerificationError';
    }
} 