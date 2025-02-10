import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { DIDManager } from "../identity/did";
import { MidnightService } from "../services/midnight";
import * as dotenv from "dotenv";

dotenv.config();

async function createAndRegisterDID() {
    try {
        // Create wallet from mnemonic
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            process.env.MIDNIGHT_MNEMONIC!,
            { prefix: "midnight" }
        );
        
        // Initialize Midnight service
        const midnight = new MidnightService({
            nodeUrl: process.env.MIDNIGHT_NODE_URL!,
            chainId: process.env.MIDNIGHT_CHAIN_ID!,
            mnemonic: process.env.MIDNIGHT_MNEMONIC!
        });

        await midnight.connect();

        // Create DID
        const didManager = new DIDManager();
        const identity = await didManager.createDID('z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK');

        // Register DID on Midnight
        const result = await midnight.submitDID(identity);

        console.log("\n=== DID Registration Result ===");
        console.log("DID:", identity.id);
        console.log("Transaction Hash:", result.transactionHash);
        console.log("Block Height:", result.blockHeight);

    } catch (error) {
        console.error("Error creating DID:", error);
    }
}

createAndRegisterDID(); 