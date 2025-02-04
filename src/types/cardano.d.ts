interface CardanoLace {
    enable: () => Promise<void>;
    getUsedAddresses: () => Promise<string[]>;
    // Add other Lace wallet methods as needed
}

interface Cardano {
    lace?: CardanoLace;
}

interface Window {
    cardano?: Cardano;
} 