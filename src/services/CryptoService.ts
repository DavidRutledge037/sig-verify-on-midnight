import { CryptoAlgorithm } from '../types/DID';
import { 
    CryptoServiceError, 
    UnsupportedAlgorithmError,
    SigningError,
    VerificationError 
} from '../errors/CryptoServiceErrors';

export class CryptoService {
    async sign(
        content: string,
        privateKey: CryptoKey,
        algorithm: CryptoAlgorithm
    ): Promise<string> {
        try {
            const contentBuffer = new TextEncoder().encode(content);
            const signature = await window.crypto.subtle.sign(
                algorithm,
                privateKey,
                contentBuffer
            );
            return Buffer.from(signature).toString('base64');
        } catch (error) {
            throw new SigningError(error as Error);
        }
    }

    async verify(
        content: string,
        signature: string,
        publicKey: CryptoKey,
        algorithm: CryptoAlgorithm
    ): Promise<boolean> {
        try {
            const contentBuffer = new TextEncoder().encode(content);
            const signatureBuffer = Buffer.from(signature, 'base64');

            return await window.crypto.subtle.verify(
                algorithm,
                publicKey,
                signatureBuffer,
                contentBuffer
            );
        } catch (error) {
            throw new VerificationError(error as Error);
        }
    }

    async generateKeyPair(algorithm: CryptoAlgorithm): Promise<CryptoKeyPair> {
        try {
            if (algorithm.name === 'ECDSA') {
                return await window.crypto.subtle.generateKey(
                    {
                        name: 'ECDSA',
                        namedCurve: 'P-256'
                    },
                    true,
                    ['sign', 'verify']
                );
            } else if (algorithm.name === 'RSASSA-PKCS1-v1_5') {
                return await window.crypto.subtle.generateKey(
                    {
                        name: 'RSASSA-PKCS1-v1_5',
                        modulusLength: 2048,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: algorithm.hash
                    },
                    true,
                    ['sign', 'verify']
                );
            }
            throw new UnsupportedAlgorithmError(algorithm.name);
        } catch (error) {
            if (error instanceof CryptoServiceError) {
                throw error;
            }
            throw new CryptoServiceError(`Failed to generate key pair: ${(error as Error).message}`);
        }
    }
} 