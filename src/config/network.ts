import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// Define network configuration
export const NETWORK_CONFIG = {
  NETWORK: NetworkId.TestNet,
  CHAIN_ID: '2',
  NODE_URL: process.env.MIDNIGHT_NODE_URL || 'https://rpc.testnet-02.midnight.network',
  INDEXER_URL: process.env.MIDNIGHT_INDEXER_URL || 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
  INDEXER_WS_URL: process.env.MIDNIGHT_INDEXER_WS_URL || 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws',
  PROOF_SERVER_URL: process.env.PROOF_SERVER_URL || 'http://127.0.0.1:6300',
} as const;

// Initialize network settings
setNetworkId(NETWORK_CONFIG.NETWORK);

export const WALLET_CONFIG = {
  SIG_VERIFY_WALLET: process.env.SIG_VERIFY_WALLET || '20bd348909eae3cbb935c89878a81e958c30d06ced8b05c16b9676125451f981|030046261d416d73c39d79eea01bb411c102212a9a96a6f50eeb32552426c999348f32d8f603713cb4bc539acdec4286bc2fed257d2af15d16a3',
} as const;

export type { NetworkId };
