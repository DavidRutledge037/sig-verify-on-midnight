import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    // Database
    MONGODB_URI: z.string().default('mongodb://localhost:27017'),
    DATABASE_NAME: z.string().default('sig_verify'),
    
    // Midnight Network - using official endpoints with port
    MIDNIGHT_NODE_URLS: z.array(z.string()).default([
        'https://rpc.testnet.midnight.network:26657',
        'https://api.testnet.midnight.network:1317'
    ]),
    MIDNIGHT_CHAIN_ID: z.string().default('midnight-testnet'),
    MIDNIGHT_MNEMONIC: z.string().optional(),
    DENOM: z.string().default('tdust'),
    
    // Faucet
    FAUCET_URL: z.string().default('https://faucet.testnet.midnight.network'),
    
    // Server
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const env = envSchema.parse(process.env);

// Export the first RPC endpoint as default, but make all available
export const MIDNIGHT_NODE_URL = env.MIDNIGHT_NODE_URLS[0];
export const MIDNIGHT_NODE_URLS = env.MIDNIGHT_NODE_URLS;
export default env; 