import { vi } from 'vitest';
import { WalletService } from '../../services/wallet.service';

export class MockWalletService implements Partial<WalletService> {
    private mockAddress = 'midnight1mock123456789abcdef';
    private mockBalance = '1000000';

    initialize = vi.fn().mockResolvedValue(undefined);
    
    getAddress = vi.fn().mockResolvedValue(this.mockAddress);
    
    getBalance = vi.fn().mockResolvedValue(this.mockBalance);
    
    signMessage = vi.fn().mockImplementation(async (message: string) => {
        return `mock_signature_for_${message}`;
    });

    // Helper to simulate errors
    simulateError() {
        this.initialize.mockRejectedValueOnce(new Error('Mock wallet error'));
    }

    // Helper to change mock values
    setMockBalance(balance: string) {
        this.mockBalance = balance;
        this.getBalance.mockResolvedValue(balance);
    }
} 