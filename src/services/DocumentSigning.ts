import { DIDManagement } from './DIDManagement';
import { CryptoService } from './CryptoService';
import { SignedDocument, DocumentSigningOptions } from '../types/Document';
import { MidnightDIDDocument, MidnightVerificationMethod } from '../types/DID';
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

        const didDoc = await this.didManagement.resolveDID(signerDID) as MidnightDIDDocument;
        
        if (!didDoc.verificationMethod || didDoc.verificationMethod.length === 0) {
            throw new NoVerificationMethodsError();
        }

        const verificationMethod = this.findVerificationMethod(didDoc, keyId);

        if (!verificationMethod) {
            throw new KeyNotFoundError(keyId || 'default');
        }

        if (!verificationMethod.privateKeyHex) {
            throw new PrivateKeyNotAvailableError();
        }

        try {
            const { signature, params } = await this.cryptoService.sign(
                content,
                verificationMethod.privateKeyHex
            );

            // Update signature params with verification method
            params.verificationMethod = verificationMethod.id;
            if (options?.proofPurpose) {
                params.proofPurpose = options.proofPurpose;
            }

            return {
                content,
                signature,
                signatureParams: params,
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

        const didDoc = await this.didManagement.resolveDID(document.signerDID) as MidnightDIDDocument;
        
        try {
            const verificationMethod = this.findVerificationMethod(didDoc, document.keyId);

            if (!verificationMethod) {
                return false;
            }

            // Verify the signature matches the verification method
            if (verificationMethod.id !== document.signatureParams.verificationMethod) {
                return false;
            }

            // Verify timestamp is not in the future
            const signatureDate = new Date(document.signatureParams.created);
            if (signatureDate > new Date()) {
                return false;
            }

            return await this.cryptoService.verify(
                document.content,
                document.signature,
                verificationMethod.publicKeyHex,
                document.signatureParams
            );
        } catch (error) {
            if (error instanceof CryptoServiceError) {
                console.error('Verification failed:', error);
            }
            return false;
        }
    }

    private findVerificationMethod(
        didDoc: MidnightDIDDocument, 
        keyId?: string
    ): MidnightVerificationMethod | undefined {
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
            document.signatureParams &&
            typeof document.signatureParams.type === 'string' &&
            typeof document.signatureParams.created === 'string' &&
            typeof document.signatureParams.verificationMethod === 'string' &&
            typeof document.signatureParams.proofPurpose === 'string' &&
            (!document.keyId || typeof document.keyId === 'string')
        );
    }
} 