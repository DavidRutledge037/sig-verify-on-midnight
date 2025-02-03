export const config = {
    midnight: {
        nodeUrl: process.env.REACT_APP_MIDNIGHT_NODE_URL || 'http://localhost:26657',
        chainId: process.env.REACT_APP_MIDNIGHT_CHAIN_ID || 'midnight-1',
        privacyLevel: 'shielded' as const
    },
    ipfs: {
        gateway: process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
        node: process.env.REACT_APP_IPFS_NODE || 'http://localhost:5001'
    }
}; 