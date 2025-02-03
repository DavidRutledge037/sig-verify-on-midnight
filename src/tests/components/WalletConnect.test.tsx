import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { WalletConnect } from '../../components/WalletConnect';
import { WalletProvider } from '../../contexts/WalletContext';

describe('WalletConnect', () => {
  const mockWalletContext = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    address: null,
    isConnected: false
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render connect button when not connected', () => {
    render(
      <WalletProvider value={mockWalletContext}>
        <WalletConnect />
      </WalletProvider>
    );

    expect(screen.getByText('Connect Lace Wallet')).toBeInTheDocument();
  });

  it('should handle successful connection', async () => {
    const connectedContext = {
      ...mockWalletContext,
      connect: vi.fn().mockImplementation(async () => {
        // Update context values after successful connection
        connectedContext.isConnected = true;
        connectedContext.address = 'addr1...';
        return true;
      })
    };

    render(
      <WalletProvider value={connectedContext}>
        <WalletConnect />
      </WalletProvider>
    );

    const connectButton = screen.getByText('Connect Lace Wallet');
    await fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText(/addr1.../)).toBeInTheDocument();
    });
  });

  it('should handle connection failure', async () => {
    const failingContext = {
      ...mockWalletContext,
      connect: vi.fn().mockRejectedValue(new Error('Connection failed'))
    };

    render(
      <WalletProvider value={failingContext}>
        <WalletConnect />
      </WalletProvider>
    );

    const connectButton = screen.getByText('Connect Lace Wallet');
    await fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to connect wallet')).toBeInTheDocument();
    });
  });

  it('should handle disconnect', async () => {
    const connectedContext = {
      ...mockWalletContext,
      isConnected: true,
      address: 'addr1...',
      disconnect: vi.fn().mockResolvedValue(true)
    };

    render(
      <WalletProvider value={connectedContext}>
        <WalletConnect />
      </WalletProvider>
    );

    const disconnectButton = screen.getByText('Disconnect');
    await fireEvent.click(disconnectButton);

    expect(connectedContext.disconnect).toHaveBeenCalled();
  });
}); 