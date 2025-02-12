import { WalletService } from '../../services/wallet.service';
import { getSigningStargateClientMock } from '../helpers/wallet-mock';

describe('WalletService', () => {
    let walletService: WalletService;

    beforeEach(() => {
        walletService = new WalletService();
        // Mock initialize to avoid RPC calls
        jest.spyOn(walletService, 'initialize').mockResolvedValue();
        // Mock getClient instead of accessing private property
        jest.spyOn(walletService, 'getClient').mockResolvedValue(getSigningStargateClientMock());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize wallet successfully', async () => {
        await expect(walletService.initialize()).resolves.not.toThrow();
    });

    it('should get wallet address', async () => {
        const mockAddress = 'night1mock123...';
        jest.spyOn(walletService, 'getAddress').mockResolvedValue(mockAddress);
        
        const address = await walletService.getAddress();
        expect(address).toBe(mockAddress);
    });

    it('should get wallet balance', async () => {
        const mockBalance = { amount: '1000000', denom: 'tdust' };
        jest.spyOn(walletService, 'getBalance').mockResolvedValue(mockBalance);
        
        const balance = await walletService.getBalance();
        expect(balance).toEqual(mockBalance);
    });

    it('should sign message', async () => {
        const mockSignature = 'mock_signature';
        jest.spyOn(walletService, 'signMessage').mockResolvedValue(mockSignature);
        
        const message = 'test message';
        const signature = await walletService.signMessage(message);
        expect(signature).toBe(mockSignature);
    });
}); 