import { 
    CryptoServiceError, 
    SigningError,
    VerificationError 
} from '../errors/CryptoServiceErrors';
import { MidnightSignatureParams } from '../types/DID';
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export class CryptoService {
    async sign(
        content: string,
        privateKeyHex: string,
    ): Promise<{ signature: string; params: MidnightSignatureParams }> {
        try {
            if (!this.validatePrivateKey(privateKeyHex)) {
                throw new SigningError(new Error('Invalid private key'));
            }

            const cleanPrivateKey = privateKeyHex.replace('0x', '');
            const privateKeyBytes = hexToBytes(cleanPrivateKey);
            
            const messageBytes = new TextEncoder().encode(content);
            const messageHash = sha256(messageBytes);
            
            // Sign using the raw message hash
            const signature = secp256k1.sign(messageHash, privateKeyBytes);
            
            const params: MidnightSignatureParams = {
                type: 'MidnightSignature2024',
                created: new Date().toISOString(),
                verificationMethod: '', // Will be filled by DocumentSigning service
                proofPurpose: 'assertionMethod'
            };

            return {
                signature: signature.toCompactHex(),
                params
            };
        } catch (error) {
            throw new SigningError(error as Error);
        }
    }

    async verify(
        content: string,
        signatureHex: string,
        publicKeyHex: string,
        params: MidnightSignatureParams
    ): Promise<boolean> {
        try {
            if (!this.validatePublicKey(publicKeyHex)) {
                throw new VerificationError(new Error('Invalid public key'));
            }

            const messageBytes = new TextEncoder().encode(content);
            const messageHash = sha256(messageBytes);
            
            try {
                const signature = secp256k1.Signature.fromCompact(signatureHex);
                const publicKeyBytes = hexToBytes(publicKeyHex.replace('0x', ''));
                
                return secp256k1.verify(signature, messageHash, publicKeyBytes);
            } catch (error) {
                throw new VerificationError(new Error('Invalid signature'));
            }
        } catch (error) {
            if (error instanceof VerificationError) {
                throw error;
            }
            throw new VerificationError(error as Error);
        }
    }

    async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
        try {
            const privateKeyBytes = secp256k1.utils.randomPrivateKey();
            const privateKeyHex = bytesToHex(privateKeyBytes);
            
            // Generate public key and ensure it starts with '04'
            const publicKeyBytes = secp256k1.getPublicKey(privateKeyBytes, false);
            const publicKeyHex = '04' + bytesToHex(publicKeyBytes.slice(1));
            
            return {
                publicKey: publicKeyHex,
                privateKey: privateKeyHex
            };
        } catch (error) {
            throw new CryptoServiceError(`Failed to generate key pair: ${(error as Error).message}`);
        }
    }

    validatePrivateKey(privateKeyHex: string): boolean {
        try {
            const cleanKey = privateKeyHex.replace('0x', '');
            if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
                return false;
            }
            const keyBytes = hexToBytes(cleanKey);
            return secp256k1.utils.isValidPrivateKey(keyBytes);
        } catch {
            return false;
        }
    }

    validatePublicKey(publicKeyHex: string): boolean {
        try {
            const cleanKey = publicKeyHex.replace('0x', '');
            
            // Check if it's a valid uncompressed public key format
            if (!cleanKey.startsWith('04') || cleanKey.length !== 130) {
                return false;
            }

            // Convert to point to validate the key
            const point = secp256k1.ProjectivePoint.fromHex(cleanKey);
            return point.assertValidity() === undefined;
        } catch {
            return false;
        }
    }

    // Helper method to normalize public key format
    private normalizePublicKey(publicKeyHex: string): string {
        const cleanKey = publicKeyHex.replace('0x', '');
        if (cleanKey.length === 130 && cleanKey.startsWith('04')) {
            return cleanKey;
        }
        throw new Error('Invalid public key format');
    }
} 