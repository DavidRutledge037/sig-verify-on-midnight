import { DIDResolver } from '../services/DIDResolver';
import { BatchProcessor } from '../services/BatchProcessor';
import { NavigationService } from '../services/NavigationService';
import { DocumentSigning } from '../components/DocumentSigning';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { WalletContext } from '../contexts/WalletContext';

describe('Security Integration', () => {
    let resolver: DIDResolver;
    let batchProcessor: BatchProcessor;
    let navigationService: NavigationService;

    const mockWallet = {
        address: '0x123...abc',
        isConnected: true,
        connect: jest.fn(),
        disconnect: jest.fn()
    };

    beforeEach(() => {
        resolver = new DIDResolver();
        batchProcessor = new BatchProcessor(resolver);
        navigationService = new NavigationService();
    });

    test('secure DID creation and verification', async () => {
        // 1. Create DID with secure parameters
        const did = await resolver.create(mockWallet.address, {
            securityLevel: 'high',
            encryption: 'Ed25519'
        });

        // 2. Verify DID security properties
        const resolved = await resolver.resolve(did.id);
        expect(resolved.verificationMethod[0].type).toBe('Ed25519VerificationKey2020');

        // 3. Test signature verification
        const { getByText, getByLabelText } = render(
            <WalletContext.Provider value={mockWallet}>
                <DocumentSigning did={did.id} />
            </WalletContext.Provider>
        );

        // 4. Sign and verify with security checks
        const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
        fireEvent.change(getByLabelText(/Choose file/), { target: { files: [file] } });
        
        // Sign document
        fireEvent.click(getByText('Sign Document'));
        await waitFor(() => {
            expect(getByText(/Document signed successfully/)).toBeInTheDocument();
        });

        // Verify signature with additional security checks
        fireEvent.click(getByText('Verify Signature'));
        await waitFor(() => {
            expect(getByText(/Security checks passed/)).toBeInTheDocument();
        });
    });

    test('authorization and access control', async () => {
        // 1. Test unauthorized access
        const { getByText } = render(
            <WalletContext.Provider value={{ ...mockWallet, isConnected: false }}>
                <DocumentSigning />
            </WalletContext.Provider>
        );

        await waitFor(() => {
            expect(getByText(/Please connect your wallet/)).toBeInTheDocument();
        });

        // 2. Test role-based access
        const adminResult = await navigationService.navigateWithRetry(
            'settings',
            { userRoles: ['admin'] },
            console.error
        );
        expect(adminResult).toBe(true);

        const userResult = await navigationService.navigateWithRetry(
            'settings',
            { userRoles: ['user'] },
            console.error
        );
        expect(userResult).toBe(false);
    });
}); 