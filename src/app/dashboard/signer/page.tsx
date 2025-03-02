'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Header } from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import GetAppIcon from '@mui/icons-material/GetApp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface PendingDocument {
  id: string;
  name: string;
  from: string;
  hash: string;
  requiresKyc: boolean;
}

interface SignedDocument {
  id: string;
  name: string;
  signedDate: string;
  downloadUrl: string;
}

export default function SignerDashboard() {
  const { address, did, kycVerified } = useWallet();
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([
    {
      id: '1',
      name: 'Contract.pdf',
      from: 'did:midnight:123',
      hash: '0x1234567890abcdef',
      requiresKyc: true
    },
    {
      id: '2',
      name: 'Agreement.docx',
      from: 'email@example.com',
      hash: '0xabcdef1234567890',
      requiresKyc: false
    }
  ]);

  const [signedDocuments, setSignedDocuments] = useState<SignedDocument[]>([
    {
      id: '1',
      name: 'Proposal.pdf',
      signedDate: 'Feb 27, 2025',
      downloadUrl: '#'
    }
  ]);

  const handleSign = async (documentId: string) => {
    // TODO: Implement signing with Lace Wallet
    console.log('Signing document:', documentId);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Welcome Banner */}
        <Typography variant="h5" gutterBottom>
          Welcome, {did || address}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Pending Documents */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Documents to Sign
          </Typography>
          <List>
            {pendingDocuments.map((doc) => (
              <ListItem
                key={doc.id}
                divider
                sx={{
                  py: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">
                        {doc.name}
                      </Typography>
                      {doc.requiresKyc && (
                        <Tooltip title="KYC verification required before signing">
                          <Chip
                            label="KYC Required"
                            size="small"
                            color="warning"
                            icon={<InfoOutlinedIcon />}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        From: {doc.from}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hash: {doc.hash}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleSign(doc.id)}
                    disabled={doc.requiresKyc && !kycVerified}
                  >
                    Sign with Lace
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Signed Documents */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Signed Documents
          </Typography>
          <List>
            {signedDocuments.map((doc) => (
              <ListItem
                key={doc.id}
                divider
                sx={{
                  py: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}
              >
                <ListItemText
                  primary={doc.name}
                  secondary={`Signed ${doc.signedDate}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Download Document">
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => window.open(doc.downloadUrl, '_blank')}
                    >
                      <GetAppIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 1,
          px: 2,
          borderTop: `1px solid ${useTheme().palette.divider}`,
          backgroundColor: useTheme().palette.background.paper,
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
                <Box component="a" href="#"><Typography variant="body2">Support</Typography></Box>
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
              <Stack direction="row" spacing={3}>
                <Link 
                  href="/support"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Support
                  </Typography>
                </Link>
                <Link 
                  href="/docs"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Docs
                  </Typography>
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
