import { HashingService } from "../services/hashing";
import { MidnightService } from "../services/midnight";
import * as dotenv from "dotenv";

dotenv.config();

async function createAndRegisterHash() {
    try {
        // Initialize Midnight service
        const midnight = new MidnightService({
            nodeUrl: process.env.MIDNIGHT_NODE_URL!,
            chainId: process.env.MIDNIGHT_CHAIN_ID!,
            mnemonic: process.env.MIDNIGHT_MNEMONIC!
        });

        await midnight.connect();

        // Create hash
        const content = "Hello, Midnight!";
        const hash = HashingService.hashData(content);

        // Register hash on Midnight
        const result = await midnight.submitDocument(hash);

        console.log("\n=== Hash Registration Result ===");
        console.log("Content:", content);
        console.log("Hash:", hash);
        console.log("Transaction Hash:", result.transactionHash);
        console.log("Block Height:", result.blockHeight);

    } catch (error) {
        console.error("Error creating hash:", error);
    }
}

createAndRegisterHash(); 