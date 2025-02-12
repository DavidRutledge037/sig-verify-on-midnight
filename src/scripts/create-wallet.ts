import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as dotenv from "dotenv";

dotenv.config();

async function createWallet() {
    try {
        // Generate new wallet with mnemonic using Midnight prefix
        const wallet = await DirectSecp256k1HdWallet.generate(24, {
            prefix: "midnight" // Set the correct prefix for Midnight addresses
        });
        
        const accounts = await wallet.getAccounts();
        
        console.log("\n=== New Wallet Created ===");
        console.log("\nMnemonic (SAVE THIS SECURELY!):");
        console.log(wallet.mnemonic);
        console.log("\nAddress:", accounts[0].address);
        
        // Save mnemonic to .env file
        const envContent = `MIDNIGHT_MNEMONIC="${wallet.mnemonic}"`;
        console.log("\nAdd this to your .env file:");
        console.log(envContent);
        
    } catch (error) {
        console.error("Error creating wallet:", error);
    }
}

createWallet(); 