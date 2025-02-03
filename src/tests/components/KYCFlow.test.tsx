import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KYCFlow } from '../../components/KYCFlow';
import { WalletProvider } from '../../contexts/WalletContext';
import { KYCService } from '../../services/kyc/kycService';
import { WalletDIDService } from '../../services/did/walletDIDService';

// Mock the services
vi.mock('../../services/kyc/kycService');
vi.mock('../../services/did/walletDIDService');

describe('KYCFlow', () => {
  const mockAddress = 'addr1...';
  const mockWalletContext = {
    address: mockAddress,
    isConnected: true,
    connect: vi.fn(),
    disconnect: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Reset KYCService mock implementation
    (KYCService as jest.Mock).mockImplementation(() => ({
      initiateKYC: vi.fn().mockResolvedValue('session123'),
      generateZKProof: vi.fn().mockResolvedValue({ proof: 'proof123' })
    }));

    // Reset WalletDIDService mock implementation
    (WalletDIDService as jest.Mock).mockImplementation(() => ({
      createWalletDID: vi.fn().mockResolvedValue({ id: 'did:midnight:123' })
    }));
  });

  it('should render start button when wallet is connected', () => {
    render(
      <WalletProvider value={mockWalletContext}>
        <KYCFlow />
      </WalletProvider>
    );

    expect(screen.getByText('Start KYC Process')).toBeInTheDocument();
  });

  it('should disable start button when wallet is not connected', () => {
    render(
      <WalletProvider value={{ ...mockWalletContext, isConnected: false }}>
        <KYCFlow />
      </WalletProvider>
    );

    const startButton = screen.getByText('Start KYC Process');
    expect(startButton).toBeDisabled();
  });

  it('should show error when starting KYC without wallet', async () => {
    render(
      <WalletProvider value={{ ...mockWalletContext, address: null }}>
        <KYCFlow />
      </WalletProvider>
    );

    const startButton = screen.getByText('Start KYC Process');
    await fireEvent.click(startButton);

    expect(screen.getByText('Please connect your wallet first')).toBeInTheDocument();
  });

  it('should complete successful KYC flow', async () => {
    render(
      <WalletProvider value={mockWalletContext}>
        <KYCFlow />
      </WalletProvider>
    );

    const startButton = screen.getByText('Start KYC Process');
    await fireEvent.click(startButton);

    // Check KYC in progress
    await waitFor(() => {
      expect(screen.getByText('Completing KYC verification...')).toBeInTheDocument();
    });

    // Check DID creation
    await waitFor(() => {
      expect(screen.getByText('Creating your DID...')).toBeInTheDocument();
    });

    // Check completion
    await waitFor(() => {
      expect(screen.getByText('KYC and DID creation complete!')).toBeInTheDocument();
    });
  });

  it('should handle KYC service failure', async () => {
    // Mock KYC service failure
    (KYCService as jest.Mock).mockImplementation(() => ({
      initiateKYC: vi.fn().mockRejectedValue(new Error('KYC failed'))
    }));

    render(
      <WalletProvider value={mockWalletContext}>
        <KYCFlow />
      </WalletProvider>
    );

    const startButton = screen.getByText('Start KYC Process');
    await fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('KYC process failed')).toBeInTheDocument();
    });
  });

  it('should handle DID creation failure', async () => {
    // Mock DID service failure
    (WalletDIDService as jest.Mock).mockImplementation(() => ({
      createWalletDID: vi.fn().mockResolvedValue(null)
    }));

    render(
      <WalletProvider value={mockWalletContext}>
        <KYCFlow />
      </WalletProvider>
    );

    const startButton = screen.getByText('Start KYC Process');
    await fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('KYC process failed')).toBeInTheDocument();
    });
  });

  it('should show correct step indicators', async () => {
    render(
      <WalletProvider value={mockWalletContext}>
        <KYCFlow />
      </WalletProvider>
    );

    // Initial state
    expect(screen.getByText('Start KYC Process')).toBeInTheDocument();

    // Start KYC
    const startButton = screen.getByText('Start KYC Process');
    await fireEvent.click(startButton);

    // Check step progression
    await waitFor(() => {
      expect(screen.getByText('Completing KYC verification...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Creating your DID...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('KYC and DID creation complete!')).toBeInTheDocument();
    });
  });
}); 