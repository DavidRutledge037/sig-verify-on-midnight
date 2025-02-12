import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as dotenv from "dotenv";

dotenv.config();

async function checkWallet() {
    try {
        // Get existing mnemonic from environment
        const mnemonic = process.env.MIDNIGHT_MNEMONIC;
        
        if (!mnemonic) {
            throw new Error('No mnemonic found in environment');
        }

        // Load wallet
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
            prefix: "midnight"
        });

        // Get account
        const [account] = await wallet.getAccounts();
        console.log("\n=== Wallet Details ===");
        console.log("Address:", account.address);
        
        return account.address;
    } catch (error) {
        console.error("Error checking wallet:", error);
        throw error;
    }
}

checkWallet(); 