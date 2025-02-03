declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_MIDNIGHT_NODE_URL: string;
        REACT_APP_MIDNIGHT_CHAIN_ID: string;
        REACT_APP_IPFS_GATEWAY: string;
        REACT_APP_IPFS_NODE: string;
        NODE_ENV: 'development' | 'production' | 'test';
    }
} 