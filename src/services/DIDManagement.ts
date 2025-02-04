import { DIDResolver } from './DIDResolver';

export class DIDManagement {
    private cache: Map<string, any>;

    constructor(private resolver: DIDResolver) {
        this.cache = new Map();
    }

    async resolveDID(did: string) {
        if (!this.isValidDIDFormat(did)) {
            throw new Error('Invalid DID format');
        }

        if (this.cache.has(did)) {
            return this.cache.get(did);
        }

        const result = await this.resolver.resolve(did);
        this.cache.set(did, result);
        return result;
    }

    private isValidDIDFormat(did: string): boolean {
        return /^did:[a-zA-Z0-9]+:.+$/.test(did);
    }
} 