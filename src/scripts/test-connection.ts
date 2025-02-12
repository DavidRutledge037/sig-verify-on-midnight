import { StargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as dotenv from "dotenv";

dotenv.config();

async function testConnection() {
    try {
        console.log("\n=== Testing Midnight Network Connection ===");
        
        // Connect to network
        console.log("\nConnecting to:", process.env.MIDNIGHT_NODE_URL);
        const client = await StargateClient.connect(process.env.MIDNIGHT_NODE_URL!);
        
        // Get chain info
        const height = await client.getHeight();
        console.log("Current block height:", height);
        
        // Test wallet connection if mnemonic is available
        if (process.env.MIDNIGHT_MNEMONIC) {
            console.log("\nTesting wallet connection...");
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                process.env.MIDNIGHT_MNEMONIC,
                { prefix: "midnight" }
            );
            const accounts = await wallet.getAccounts();
            console.log("Wallet address:", accounts[0].address);
        }
        
        console.log("\n✅ Connection test successful!");
        
    } catch (error) {
        console.error("\n❌ Connection test failed:", error);
    }
}

testConnection(); 