import React, { useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext.js';
import { useNotification } from '../contexts/NotificationContext.js';

export function NetworkSelector() {
    const { sdk } = useWallet();
    const { showNotification } = useNotification();
    const [currentNetwork, setCurrentNetwork] = React.useState('midnight-1');

    React.useEffect(() => {
        const getNetwork = async () => {
            if (sdk) {
                const network = await sdk.getNetwork();
                setCurrentNetwork(network);
            }
        };
        getNetwork();
    }, [sdk]);

    const handleNetworkChange = useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newNetwork = event.target.value;
        try {
            await sdk?.switchNetwork(newNetwork);
            setCurrentNetwork(newNetwork);
            showNotification(`Switched to ${newNetwork}`);
        } catch (error) {
            showNotification('Failed to switch network', 'error');
        }
    }, [sdk, showNotification]);

    return (
        <select 
            value={currentNetwork}
            onChange={handleNetworkChange}
            data-testid="network-selector"
        >
            <option value="midnight-1">Mainnet</option>
            <option value="midnight-testnet">Testnet</option>
        </select>
    );
} 