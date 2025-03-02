'use client';

import { Button, Box, Typography, Stack } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import React, { useState } from 'react';

interface WalletConnectProps {
  compact?: boolean;
  onConnectionChange?: (connected: boolean, address: string | null) => void;
}

// Helper function to truncate address
const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function WalletConnect({ compact = false, onConnectionChange }: WalletConnectProps) {
  const router = useRouter();
  const { isConnected, address, connect, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const connected = await connect();
      if (connected) {
        router.push('/kyc-did');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            whiteSpace: 'nowrap'
          }}
        >
          {isConnected && address ? formatAddress(address) : 'Connect your Midnight Lace Wallet'}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              padding: 2,
              background: 'linear-gradient(45deg, #FF69B4, #FFA500)',
              borderRadius: '10px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }
          }}
        >
          <Button
            onClick={isConnected ? handleDisconnect : handleConnect}
            sx={{
              minWidth: '120px',
              px: 1,
              py: 0.25,
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'background.paper',
                transform: 'translateY(-2px)',
              },
              position: 'relative',
              height: '44px',
              transition: 'transform 0.2s ease-in-out'
            }}
            disabled={isLoading}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              <Image
                src="/images/Lace Logo.png"
                alt="Lace Wallet"
                width={96}
                height={96}
                style={{ width: '96px', height: '96px', objectFit: 'contain' }}
              />
            </Box>
            {isLoading && "Connecting..."}
          </Button>
        </Box>

        {/* Connection Status Indicator */}
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: isConnected ? '#4CAF50' : '#f44336',
            boxShadow: isConnected 
              ? '0 0 8px 2px rgba(76, 175, 80, 0.3)' 
              : '0 0 8px 2px rgba(244, 67, 54, 0.3)',
            transition: 'all 0.3s ease'
          }}
        />
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
      <Stack spacing={2} alignItems="center">
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}
        >
          {isConnected && address ? formatAddress(address) : 'Connect your Midnight Lace Wallet'}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              padding: 2,
              background: 'linear-gradient(45deg, #FF69B4, #FFA500)',
              borderRadius: '10px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }
          }}
        >
          <Button
            onClick={isConnected ? handleDisconnect : handleConnect}
            sx={{
              px: 4,
              py: 1.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: 'background.paper',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'background.paper',
                transform: 'translateY(-2px)',
              },
              minWidth: '200px',
            }}
            disabled={isLoading}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              <Image
                src="/images/Lace Logo.png"
                alt="Lace Wallet"
                width={96}
                height={96}
                style={{ width: '96px', height: '96px', objectFit: 'contain' }}
              />
            </Box>
            {isLoading && "Connecting..."}
          </Button>
        </Box>

        {/* Connection Status Indicator */}
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: isConnected ? '#4CAF50' : '#f44336',
            boxShadow: isConnected 
              ? '0 0 8px 2px rgba(76, 175, 80, 0.3)' 
              : '0 0 8px 2px rgba(244, 67, 54, 0.3)',
            transition: 'all 0.3s ease'
          }}
        />
      </Stack>
    </Box>
  );
}
