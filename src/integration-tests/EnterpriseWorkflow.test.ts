import { EnterpriseAdmin } from '../components/EnterpriseAdmin';
import { DIDResolver } from '../services/DIDResolver';
import { BatchProcessor } from '../services/BatchProcessor';
import { NavigationService } from '../services/NavigationService';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

describe('Enterprise Workflow Integration', () => {
    let resolver: DIDResolver;
    let batchProcessor: BatchProcessor;
    let navigationService: NavigationService;

    beforeEach(() => {
        resolver = new DIDResolver();
        batchProcessor = new BatchProcessor(resolver);
        navigationService = new NavigationService();
    });

    test('enterprise bulk operations workflow', async () => {
        // 1. Setup initial DIDs
        const dids = await Promise.all(
            Array.from({ length: 5 }, () => resolver.create('enterprise'))
        );

        // 2. Render enterprise admin
        const { getByText, getAllByRole } = render(
            <EnterpriseAdmin 
                resolver={resolver}
                batchProcessor={batchProcessor}
                navigationService={navigationService}
            />
        );

        // 3. Select DIDs for bulk operation
        const checkboxes = getAllByRole('checkbox');
        checkboxes.forEach(checkbox => {
            fireEvent.click(checkbox);
        });

        // 4. Start bulk verification
        fireEvent.click(getByText('Verify Selected'));

        // 5. Monitor progress
        await waitFor(() => {
            expect(getByText(/100%/)).toBeInTheDocument();
        });

        // 6. Check operation history
        fireEvent.click(getByText('History'));
        await waitFor(() => {
            const historyItems = screen.getAllByText(/Operation/);
            expect(historyItems).toHaveLength(1);
        });

        // 7. Generate report
        fireEvent.click(getByText('Generate Report'));
        await waitFor(() => {
            expect(getByText(/Report generated/)).toBeInTheDocument();
        });
    });

    test('navigation and caching integration', async () => {
        const { getByText } = render(
            <EnterpriseAdmin 
                resolver={resolver}
                batchProcessor={batchProcessor}
                navigationService={navigationService}
            />
        );

        // 1. Navigate between views
        fireEvent.click(getByText('Bulk Operations'));
        await waitFor(() => {
            expect(getByText(/Select DIDs/)).toBeInTheDocument();
        });

        // 2. Check cache hit
        fireEvent.click(getByText('Dashboard'));
        fireEvent.click(getByText('Bulk Operations'));
        
        // Should use cached route
        const cachedRoute = await navigationService.getCache().getRoute('bulk-operations');
        expect(cachedRoute).toBeTruthy();
    });
}); 