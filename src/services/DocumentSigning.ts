import { DIDManagement } from './DIDManagement';
import { CryptoService } from './CryptoService';
import { SignedDocument, DocumentSigningOptions } from '../types/Document';
import { DIDDocument, VerificationMethod } from '../types/DID';
import {
    EmptyContentError,
    NoVerificationMethodsError,
    KeyNotFoundError,
    PrivateKeyNotAvailableError,
    InvalidDocumentFormatError,
    SigningOperationError
} from '../errors/DocumentSigningErrors';
import { CryptoServiceError } from '../errors/CryptoServiceErrors';

export class DocumentSigning {
    private cryptoService: CryptoService;

    constructor(
        private didManagement: DIDManagement,
        cryptoService?: CryptoService
    ) {
        this.cryptoService = cryptoService || new CryptoService();
    }

    async createSignedDocument(
        content: string, 
        signerDID: string, 
        keyId?: string,
        options?: DocumentSigningOptions
    ): Promise<SignedDocument> {
        if (!content) {
            throw new EmptyContentError();
        }

        const didDoc = await this.didManagement.resolveDID(signerDID) as DIDDocument;
        
        if (!didDoc.verificationMethod || didDoc.verificationMethod.length === 0) {
            throw new NoVerificationMethodsError();
        }

        const verificationMethod = this.findVerificationMethod(didDoc, keyId);

        if (!verificationMethod) {
            throw new KeyNotFoundError(keyId || 'default');
        }

        if (!verificationMethod.privateKey) {
            throw new PrivateKeyNotAvailableError();
        }

        try {
            const signature = await this.cryptoService.sign(
                content,
                verificationMethod.privateKey,
                verificationMethod.algorithm
            );

            return {
                content,
                signature,
                signerDID,
                keyId: keyId || verificationMethod.id.split('#')[1]
            };
        } catch (error) {
            if (error instanceof CryptoServiceError) {
                throw error;
            }
            throw new SigningOperationError(error as Error);
        }
    }

    async verifySignature(document: SignedDocument): Promise<boolean> {
        if (!this.isValidDocument(document)) {
            throw new InvalidDocumentFormatError();
        }

        const didDoc = await this.didManagement.resolveDID(document.signerDID) as DIDDocument;
        
        try {
            const verificationMethod = this.findVerificationMethod(didDoc, document.keyId);

            if (!verificationMethod) {
                return false;
            }

            return await this.cryptoService.verify(
                document.content,
                document.signature,
                verificationMethod.publicKey,
                verificationMethod.algorithm
            );
        } catch (error) {
            if (error instanceof CryptoServiceError) {
                // Log the error but return false for verification failures
                console.error('Verification failed:', error);
            }
            return false;
        }
    }

    private findVerificationMethod(didDoc: DIDDocument, keyId?: string): VerificationMethod | undefined {
        if (!keyId) {
            return didDoc.verificationMethod[0];
        }
        return didDoc.verificationMethod.find(vm => vm.id.endsWith(`#${keyId}`));
    }

    private isValidDocument(document: any): document is SignedDocument {
        return (
            document &&
            typeof document.content === 'string' &&
            typeof document.signature === 'string' &&
            typeof document.signerDID === 'string' &&
            (!document.keyId || typeof document.keyId === 'string')
        );
    }
} 