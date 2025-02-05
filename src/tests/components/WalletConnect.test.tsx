import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletConnect } from '../../components/WalletConnect';

const mockUseWallet = {
  address: "mock-address",
  connect: vi.fn(),
  signMessage: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn()
};

vi.mock('../../hooks/useWallet', () => ({
  useWallet: () => mockUseWallet
}));

describe('WalletConnect', () => {
  it('renders without crashing', () => {
    render(<WalletConnect />);
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
  });
});
