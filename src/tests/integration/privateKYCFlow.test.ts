import { PrivateKYCManager } from '../../contracts/PrivateKYCManager';
import { MidnightSDK } from '../../sdk/midnight';
import { VerificationLevel } from '../../types/kyc';
import { midnightConfig } from '../../config/midnight';

describe('Private KYC Flow', () => {
    let kycManager: PrivateKYCManager;
    let sdk: MidnightSDK;

    beforeEach(() => {
        sdk = new MidnightSDK(midnightConfig);
        kycManager = new PrivateKYCManager(sdk);
    });

    it('should verify identity with privacy', async () => {
        const did = 'did:midnight:test';
        const proofs = new Map([
            ['identity', 'proof1'],
            ['address', 'proof2']
        ]);
        const allowedViewers = ['viewer1', 'viewer2'];

        await kycManager.verifyIdentityWithPrivacy(
            did,
            VerificationLevel.ADVANCED,
            proofs,
            allowedViewers
        );

        // Add assertions
    });
}); 