import { SigningStargateClient } from "@cosmjs/stargate";

export class MockSigningStargateClient {
    async getChainId(): Promise<string> {
        return 'midnight-testnet';
    }

    async getBalance(address: string, denom: string): Promise<{ amount: string; denom: string }> {
        return { amount: '1000000', denom: 'tdust' };
    }

    async signAndBroadcast(address: string, messages: any[], fee: any, memo: string): Promise<any> {
        return {
            code: 0,
            transactionHash: 'mock_tx_hash',
            rawLog: 'mock_success'
        };
    }
}

export const getSigningStargateClientMock = (): SigningStargateClient => {
    return new MockSigningStargateClient() as unknown as SigningStargateClient;
}; 