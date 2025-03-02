'use client';

import { AppBar, Box, Container, Typography, Stack, Button } from '@mui/material';
import { WalletConnect } from './WalletConnect';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 1
      }}
    >
      <Container 
        maxWidth={false}
        sx={{
          px: '16px',
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Stack direction="row" alignItems="center" sx={{ '& > *:not(:first-child)': { ml: -2 } }}>
            <Image
              src="/images/Sig Verify.png"
              alt="Sig Verify"
              width={180}
              height={60}
              style={{ 
                objectFit: 'contain',
                width: '180px',
                height: '60px'
              }}
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                fontSize: '2.5rem',
                letterSpacing: '-0.02em',
                color: 'text.primary',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1a1b1e 30%, #2d2e32 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Sig Verify
            </Typography>
          </Stack>

          {/* Navigation Menu */}
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              '& .MuiButton-root': { 
                fontSize: '1.125rem', 
                fontWeight: 500, 
                textTransform: 'none', 
                minWidth: 'auto', 
                px: 3,
                color: pathname === '/' ? 'warning.main' : 'inherit'
              } 
            }}
          >
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/dashboard/sender" passHref style={{ textDecoration: 'none' }}>
              <Button color="inherit">Send</Button>
            </Link>
            <Link href="/dashboard/signer" passHref style={{ textDecoration: 'none' }}>
              <Button color="inherit">Sign</Button>
            </Link>
            <Link href="/about" passHref style={{ textDecoration: 'none' }}>
              <Button color="inherit">About</Button>
            </Link>
          </Stack>

          {/* Connect Wallet */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WalletConnect compact />
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
