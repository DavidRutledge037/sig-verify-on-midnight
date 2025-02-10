import { ProofService } from '../services/proof';
import { HashingService } from '../services/hashing';
import { DIDManager } from '../identity/did';
import { MidnightService } from '../services/midnight';

async function main() {
    // Initialize services with Midnight testnet
    const nodeUrl = 'https://rpc.testnet.midnight.stakewith.us';
    const chainId = 'midnight-testnet-1';

    const midnight = new MidnightService({
        nodeUrl,
        chainId,
        mnemonic: process.env.MIDNIGHT_MNEMONIC || '' // You'll need to provide this
    });

    const proofService = new ProofService(nodeUrl, chainId);

    try {
        // Connect to services
        await midnight.connect();
        await proofService.connect();

        // Create and submit a DID
        const didManager = new DIDManager();
        const identity = await didManager.createDID('z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK');
        const didResult = await midnight.submitDID(identity);
        console.log('\nDID Transaction:', didResult);

        // Create and submit a document hash
        const documentContent = 'Hello, Midnight!';
        const hash = HashingService.hashData(documentContent);
        const hashResult = await midnight.submitDocument(hash, identity.id);
        console.log('\nHash Transaction:', hashResult);

        // Wait a few blocks for finality
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Get and verify proofs
        const didProof = await proofService.getDIDProof(identity.id);
        const hashProof = await proofService.getHashProof(hash);

        console.log('\n=== DID Proof ===');
        if (didProof) {
            console.log(JSON.stringify(didProof, null, 2));
            const isValid = await proofService.verifyProof(didProof);
            console.log('Proof verification:', isValid ? '✅ Valid' : '❌ Invalid');
        } else {
            console.log('DID not found on Midnight network');
        }

        console.log('\n=== Hash Proof ===');
        if (hashProof) {
            console.log(JSON.stringify(hashProof, null, 2));
            const isValid = await proofService.verifyProof(hashProof);
            console.log('Proof verification:', isValid ? '✅ Valid' : '❌ Invalid');
        } else {
            console.log('Hash not found on Midnight network');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        midnight.disconnect();
        proofService.disconnect();
    }
}

main(); 