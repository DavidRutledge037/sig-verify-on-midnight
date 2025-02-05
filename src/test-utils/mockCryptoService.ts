export const mockCryptoService = () => ({
    generateKeyPair: vi.fn().mockResolvedValue({
        publicKey: 'mock-public-key',
        privateKey: 'mock-private-key'
    }),
    sign: vi.fn().mockResolvedValue('mock-signature'),
    verify: vi.fn().mockResolvedValue(true)
}); 