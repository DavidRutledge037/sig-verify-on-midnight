export type Address = string;

export interface ZKProof {
    proof: string;
    publicInputs: string[];
    privateInputs?: string[];
}

export class Contract {
    protected owner: Address;
    
    constructor() {
        this.owner = '';
    }
}

export const msg = {
    sender: '' as Address,
    value: BigInt(0)
}; 