import { Contract, Address } from '../types';

export class DIDManager extends Contract {
    private didDocuments: Map<string, string>;

    constructor() {
        super();
        this.didDocuments = new Map();
    }

    public async createDID(address: Address, publicKey: string): Promise<string> {
        const did = `did:midnight:${address}`;
        if (this.didDocuments.has(did)) {
            throw new Error('DID already exists');
        }
        this.didDocuments.set(did, publicKey);
        return did;
    }
}
