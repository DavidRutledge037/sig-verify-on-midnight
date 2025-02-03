interface Window {
    midnight?: {
        connect(): Promise<void>;
        disconnect(): Promise<void>;
        getAddress(): Promise<string>;
        getPublicKey(): Promise<string>;
        getNetwork(): Promise<string>;
        isConnected(): Promise<boolean>;
        signTransaction(tx: any): Promise<string>;
        signMessage(msg: string): Promise<string>;
        switchNetwork(network: string): Promise<void>;
    };
} 