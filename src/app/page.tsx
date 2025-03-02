'use client';

import { Box, Container, Typography, Card, Stack, useTheme, Button, Grid } from '@mui/material';
import { Header } from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import ChatIcon from '@mui/icons-material/Chat';

export default function Home() {
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Header />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          py: 0, 
          pb: 4,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
          <div style={{ height: '128px' }}></div>
          {/* Hero Section */}
          <Box 
            textAlign="center" 
            sx={{
              maxWidth: 800,
              mx: 'auto',
              mt: '28px',
              position: 'relative',
              zIndex: 2
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: '3.5rem',
                lineHeight: 1.2,
                mb: 3,
                background: 'linear-gradient(45deg, #1a1b1e 30%, #2d2e32 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Signatures That Stay Secret
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 500,
                lineHeight: 1.4,
                fontSize: '1.5rem',
                color: 'text.secondary',
                mb: 6
              }}
            >
              Enterprise-grade document signing with uncompromising privacy
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Link href="mailto:david@sigverify.com" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'common.white',
                    fontSize: '1.25rem',
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'warning.dark'
                    }
                  }}
                >
                  Request Demo
                </Button>
              </Link>
            </Stack>
          </Box>

          {/* Feature Cards Container */}
          <Container maxWidth="lg" sx={{ 
            position: 'fixed',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: -1
          }}>
            {/* Feature Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 3, 
              width: '100%',
              position: 'absolute',
              bottom: '15%',  
              left: 0,
              right: 0,
              zIndex: -1
            }}>
              <Link href="/learn/zero-knowledge" style={{ textDecoration: 'none' }}>
                <Card sx={{ 
                  p: 3,
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}>
                  <LockIcon sx={{ fontSize: 40, mb: 2, color: theme.palette.primary.main }} />
                  <Typography variant="h6" gutterBottom>
                    Zero-Knowledge Proofs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn how we keep your documents private
                  </Typography>
                </Card>
              </Link>

              <Link href="/enterprise" style={{ textDecoration: 'none' }}>
                <Card sx={{ 
                  p: 3,
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}>
                  <VerifiedUserIcon sx={{ fontSize: 40, mb: 2, color: theme.palette.primary.main }} />
                  <Typography variant="h6" gutterBottom>
                    Enterprise Ready
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Built for organizations of any size
                  </Typography>
                </Card>
              </Link>

              <Link href="/identity" style={{ textDecoration: 'none' }}>
                <Card sx={{ 
                  p: 3,
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}>
                  <SecurityIcon sx={{ fontSize: 40, mb: 2, color: theme.palette.primary.main }} />
                  <Typography variant="h6" gutterBottom>
                    Decentralized Identity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Control your digital identity
                  </Typography>
                </Card>
              </Link>
            </Box>
          </Container>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("/images/zkp-circuit-bg.svg")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: 0.03,
            zIndex: 1
          }}
        />
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 1,
          px: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
        }}
      >
        <Container 
          maxWidth={false}
          sx={{
            px: '16px',
            maxWidth: 'calc(100% - 32px)',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ visibility: 'hidden', width: '200px' }}>
              <Stack direction="row" spacing={2}>
                <Box component="a" href="#"><TwitterIcon /></Box>
              </Stack>
            </Box>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Powered by
              </Typography>
              <Image
                src="/images/Midnight Logo.png"
                alt="Midnight"
                width={100}
                height={25}
                style={{ 
                  objectFit: 'contain',
                  opacity: 0.9 
                }}
              />
            </Stack>

            <Box sx={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
              <Stack direction="row" spacing={2}>
                <Box 
                  component="a" 
                  href="#"
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <TwitterIcon />
                </Box>
                <Box 
                  component="a" 
                  href="#"
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <LinkedInIcon />
                </Box>
                <Box 
                  component="a" 
                  href="#"
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <TelegramIcon />
                </Box>
                <Box 
                  component="a" 
                  href="#"
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <ChatIcon />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
