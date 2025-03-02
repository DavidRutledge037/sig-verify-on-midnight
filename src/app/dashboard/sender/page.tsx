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
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { Header } from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useWallet } from '@/contexts/WalletContext';
import { styled } from '@mui/material/styles';

// Styled components
const UploadZone = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.warning.main,
  }
}));

interface Document {
  name: string;
  recipient: string;
  status: 'Pending' | 'Signed';
  id: string;
}

export default function SenderDashboard() {
  const { address } = useWallet();
  const [requireKyc, setRequireKyc] = useState(true);
  const [recipient, setRecipient] = useState('');
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: '1',
      name: 'Contract.pdf',
      recipient: 'did:midnight:456',
      status: 'Pending'
    },
    {
      id: '2',
      name: 'Agreement.docx',
      recipient: 'email@example.com',
      status: 'Signed'
    }
  ]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // TODO: Handle file drop
  };

  const handleRefresh = () => {
    // TODO: Refresh document list
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Welcome Banner */}
        <Typography variant="h5" gutterBottom>
          Welcome, {address}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Document
              </Typography>
              
              <Stack spacing={3}>
                <UploadZone
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography>
                    Drop your file here or click to browse
                  </Typography>
                </UploadZone>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={requireKyc}
                      onChange={(e) => setRequireKyc(e.target.checked)}
                      color="warning"
                    />
                  }
                  label="Require Signer KYC"
                />

                <TextField
                  fullWidth
                  label="Recipient DID or Email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="did:midnight:... or email"
                />

                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  fullWidth
                >
                  Send for Signing
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Status Section */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">
                  Signing Requests
                </Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  color="inherit"
                >
                  Refresh
                </Button>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doc Name</TableCell>
                      <TableCell>Recipient</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.recipient}</TableCell>
                        <TableCell>{doc.status}</TableCell>
                        <TableCell align="right">
                          {doc.status === 'Pending' ? (
                            <Tooltip title="View Details">
                              <IconButton size="small" color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Download">
                              <IconButton size="small" color="primary">
                                <GetAppIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
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
                  href="/privacy"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    Privacy
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
