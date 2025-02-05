import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WalletConnect } from '../../components/WalletConnect'

describe('WalletConnect', () => {
  it('renders without crashing', () => {
    render(<WalletConnect />)
    expect(screen.getByText('Wallet Connect')).toBeInTheDocument()
  })
})
