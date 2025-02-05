import { DIDResolver } from '../services/DIDResolver';
import { BatchProcessor } from '../services/BatchProcessor';
import { NavigationService } from '../services/NavigationService';
import { DocumentSigning } from '../components/DocumentSigning';
import { KYCVerification } from '../components/KYCVerification';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { WalletContext } from '../contexts/WalletContext';

describe('DID Workflow Integration', () => {
    let resolver: DIDResolver;
    let batchProcessor: BatchProcessor;
    let navigationService: NavigationService;

    const mockWallet = {
        address: '0x123...abc',
        isConnected: true,
        connect: vi.fn(),
        disconnect: vi.fn()
    };

    beforeEach(() => {
        resolver = new DIDResolver();
        batchProcessor = new BatchProcessor(resolver);
        navigationService = new NavigationService();
    });

    test('complete DID lifecycle', async () => {
        // 1. Create DID
        const did = await resolver.create(mockWallet.address);
        expect(did).toHaveProperty('id');
        expect(did).toHaveProperty('@context');

        // 2. Resolve and verify DID
        const resolved = await resolver.resolve(did.id);
        expect(resolved).toMatchObject(did);

        // 3. Sign document with DID
        const { getByText, getByLabelText } = render(
            <WalletContext.Provider value={mockWallet}>
                <DocumentSigning did={did.id} />
            </WalletContext.Provider>
        );

        const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
        fireEvent.change(getByLabelText(/Choose file/), { target: { files: [file] } });
        fireEvent.click(getByText('Sign Document'));

        await waitFor(() => {
            expect(getByText(/Document signed successfully/)).toBeInTheDocument();
        });

        // 4. Verify document signature
        fireEvent.click(getByText('Verify Signature'));
        await waitFor(() => {
            expect(getByText(/Signature verified/)).toBeInTheDocument();
        });
    });

    test('batch operations with KYC verification', async () => {
        // 1. Create multiple DIDs
        const dids = await Promise.all(
            Array.from({ length: 3 }, () => resolver.create(mockWallet.address))
        );

        // 2. Process batch verification
        const batchResult = await batchProcessor.processBatch(
            'verify',
            dids.map(d => d.id)
        );
        expect(batchResult.success).toBe(true);

        // 3. Perform KYC for each DID
        const { getByText, getByLabelText } = render(
            <WalletContext.Provider value={mockWallet}>
                <KYCVerification />
            </WalletContext.Provider>
        );

        for (const did of dids) {
            fireEvent.change(getByLabelText(/Full Name/), {
                target: { value: 'John Doe' }
            });
            fireEvent.change(getByLabelText(/Date of Birth/), {
                target: { value: '1990-01-01' }
            });
            fireEvent.click(getByText('Submit KYC'));

            await waitFor(() => {
                expect(getByText(/Verification In Progress/)).toBeInTheDocument();
            });
        }
    });
}); 