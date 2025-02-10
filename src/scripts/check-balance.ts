import { StargateClient } from "@cosmjs/stargate";
import * as dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

// Try different RPC endpoints
const RPC_ENDPOINTS = [
    "http://65.108.44.149:26657",                  // Direct IP
    "http://testnet-rpc.midnight.stakewith.us",    // Alternative domain
    "http://rpc.testnet.midnight.stakewith.us",    // Original domain
];

async function findWorkingEndpoint(): Promise<string> {
    for (const endpoint of RPC_ENDPOINTS) {
        try {
            console.log(`Testing endpoint: ${endpoint}`);
            const response = await axios.get(`${endpoint}/status`, { timeout: 5000 });
            if (response.data?.result?.node_info?.network) {
                console.log(`Found working endpoint: ${endpoint}`);
                return endpoint;
            }
        } catch (err) {
            console.log(`Endpoint ${endpoint} failed`);
        }
    }
    throw new Error("No working RPC endpoint found");
}

async function checkBalance(address: string) {
    try {
        // Validate address format
        if (!address.startsWith('midnight')) {
            throw new Error('Invalid address format. Address must start with "midnight"');
        }

        console.log("\nConnecting to Midnight testnet...");
        const rpcEndpoint = await findWorkingEndpoint();
        console.log("Using RPC Endpoint:", rpcEndpoint);
        
        const client = await StargateClient.connect(rpcEndpoint);
        
        console.log("\nChecking balance for:", address);
        const balance = await client.getAllBalances(address);
        
        console.log("\n=== Balance Check ===");
        console.log("Address:", address);
        console.log("Balances:", balance.map(b => ({
            amount: b.amount,
            denom: b.denom
        })));
        
        if (balance.length === 0) {
            console.log("\nNo tokens found. Get testnet tokens from:");
            console.log("https://faucet.testnet.midnight.stakewith.us");
            console.log("\nPaste your address there to receive test tokens.");
        }
        
    } catch (err) {
        const error = err as Error;
        console.error("\nError:", error?.message || 'Unknown error');
        if (axios.isAxiosError(err)) {
            console.error("Network error details:", err.response?.data || err.message);
        }
        console.log("\nTroubleshooting:");
        console.log("1. The testnet RPC endpoints might be down");
        console.log("2. Visit https://docs.midnight.network/hackathon/zk-identity-hackathon for current testnet information");
        console.log("3. Check the Midnight Discord for testnet status updates");
        console.log("\nTried the following endpoints:");
        RPC_ENDPOINTS.forEach(endpoint => console.log(`- ${endpoint}`));
    }
}

// If no address provided, try to get it from environment
const address = process.argv[2];
if (!address) {
    console.error("Please provide an address: npm run check-balance YOUR_ADDRESS");
    console.error("Example: npm run check-balance midnight1234...");
} else {
    checkBalance(address);
} 