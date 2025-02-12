import { DIDDocument, DIDResolutionResult } from '../did.types';

export interface IDIDService extends IService {
    createDID(): Promise<DIDDocument>;
    verifyDID(did: DIDDocument): Promise<boolean>;
    resolveDID(didId: string): Promise<DIDResolutionResult>;
    revokeDID(didId: string): Promise<boolean>;
    isValidDIDFormat(did: string): boolean;
} 