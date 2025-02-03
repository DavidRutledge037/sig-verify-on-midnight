import { MidnightSDK } from '../sdk/midnight';
import { KeyManagementService } from './KeyManagementService';

export interface UserCredentials {
    did: string;
    publicKey: string;
    privateKey: string;  // In production, this would be handled by wallet
}

export class AuthenticationService {
    private sdk: MidnightSDK;
    private keyManager: KeyManagementService;
    private activeUser: UserCredentials | null = null;

    constructor(sdk: MidnightSDK) {
        this.sdk = sdk;
        this.keyManager = new KeyManagementService();
    }

    async login(address: string): Promise<UserCredentials> {
        // In production, this would connect to Midnight wallet
        const credentials = await this.sdk.getAddress();
        this.activeUser = {
            did: `did:midnight:${address}`,
            publicKey: 'public_key',
            privateKey: 'private_key'
        };
        return this.activeUser;
    }

    async getActiveUser(): Promise<UserCredentials | null> {
        return this.activeUser;
    }
} 