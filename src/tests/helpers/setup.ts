import '@jest/globals';
import { MidnightSDK } from '../../sdk/midnight';
import { midnightConfig } from '../../config/midnight';

export const setupTestSDK = () => {
    return new MidnightSDK({
        ...midnightConfig,
        nodeUrl: 'http://localhost:26657',
        chainId: 'midnight-test'
    });
}; 