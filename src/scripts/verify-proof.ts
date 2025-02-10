import { ProofService } from "../services/proof";
import * as dotenv from "dotenv";

dotenv.config();

async function verifyProofs(didId: string, hash: string) {
    try {
        const proofService = new ProofService(
            process.env.MIDNIGHT_NODE_URL!,
            process.env.MIDNIGHT_CHAIN_ID!
        );

        await proofService.connect();

        // Get and verify DID proof
        console.log("\n=== DID Proof ===");
        const didProof = await proofService.getDIDProof(didId);
        if (didProof) {
            console.log(JSON.stringify(didProof, null, 2));
            const isValid = await proofService.verifyProof(didProof);
            console.log("Proof verification:", isValid ? "✅ Valid" : "❌ Invalid");
        }

        // Get and verify hash proof
        console.log("\n=== Hash Proof ===");
        const hashProof = await proofService.getHashProof(hash);
        if (hashProof) {
            console.log(JSON.stringify(hashProof, null, 2));
            const isValid = await proofService.verifyProof(hashProof);
            console.log("Proof verification:", isValid ? "✅ Valid" : "❌ Invalid");
        }

    } catch (error) {
        console.error("Error verifying proofs:", error);
    }
}

// Get DID and hash from command line arguments
const didId = process.argv[2];
const hash = process.argv[3];

if (!didId || !hash) {
    console.error("Please provide DID and hash: npm run verify-proof <did> <hash>");
} else {
    verifyProofs(didId, hash);
} 