import { MidnightConfig } from '../sdk/midnight';

export const midnightConfig: MidnightConfig = {
    nodeUrl: process.env.MIDNIGHT_NODE_URL || 'http://localhost:26657',
    chainId: process.env.MIDNIGHT_CHAIN_ID || 'midnight-1',
    privacyLevel: 'shielded'
}; 