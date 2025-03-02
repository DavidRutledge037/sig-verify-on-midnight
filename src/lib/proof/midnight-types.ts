// Mock types for @midnight-ntwrk/midnight-js-types
export interface SignatureProof {
  proof: string;
  publicInputs: {
    did: string;
    documentType: number;
  };
}

export interface NetworkId {
  testnet: string;
  mainnet: string;
}

export interface MidnightNetwork {
  id: string;
  name: string;
  isTestnet: boolean;
}
