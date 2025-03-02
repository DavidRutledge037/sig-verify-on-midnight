'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Alert,
  useTheme
} from '@mui/material';
import { Header } from '@/components/Header';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { MidnightLaceWallet } from '@/lib/wallet/midnight-lace';
import { hashDocument } from '@/lib/utils/hash';

// Styled components
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface KycFormData {
  fullName: string;
  idNumber: string;
  agreeToPrivacy: boolean;
  document?: File | null;
}

const STORAGE_KEY = 'kyc_form_data';

// Custom hook for managing form state
const useKycFormState = () => {
  // Initialize state from localStorage or defaults
  const [formData, setFormData] = useState<KycFormData>(() => {
    if (typeof window === 'undefined') return { fullName: '', idNumber: '', agreeToPrivacy: false };
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, document: null };
      } catch (e) {
        console.error('Failed to parse saved form data:', e);
      }
    }
    return { fullName: '', idNumber: '', agreeToPrivacy: false };
  });

  // Update localStorage when form data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { document, ...dataToSave } = formData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData]);

  // Clear form data
  const clearForm = useCallback(() => {
    setFormData({ fullName: '', idNumber: '', agreeToPrivacy: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Update form data with type safety
  const updateFormData = useCallback((update: Partial<KycFormData>) => {
    setFormData(prev => ({ ...prev, ...update }));
  }, []);

  return { formData, updateFormData, clearForm };
};

const steps = ['KYC Verification', 'DID Generation', 'Dashboard Access'];

export default function KycDid() {
  // State management
  const { isConnected, did, kycVerified, setDid, setKycVerified } = useWallet();
  const [activeStep, setActiveStep] = useState(0);
  const { formData, updateFormData, clearForm } = useKycFormState();
  const [didToResolve, setDidToResolve] = useState('');
  const [resolvedData, setResolvedData] = useState<null | { role: string; kycStatus: string }>(null);
  const [wallet, setWallet] = useState<MidnightLaceWallet | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet in browser only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setWallet(MidnightLaceWallet.getInstance());
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
        setError('Failed to initialize wallet. Please make sure you are using a supported browser.');
      }
    }
  }, []);

  // Update active step based on wallet state
  useEffect(() => {
    const initWallet = async () => {
      if (!wallet) return;
      
      try {
        console.log('Connecting wallet...');
        const connected = await wallet.connect();
        if (!connected) {
          setError('Failed to connect wallet. Please make sure the Midnight Lace extension is installed and unlocked.');
          return;
        }
        console.log('Wallet connected!');
        setError(null);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError('Error connecting to wallet. Please try again.');
      }
    };

    if (isConnected) {
      initWallet();
    }

    if (isConnected && kycVerified && did) {
      setActiveStep(2);
    } else if (isConnected && kycVerified) {
      setActiveStep(1);
    } else if (isConnected) {
      setActiveStep(0);
    }
  }, [isConnected, kycVerified, did, wallet]);

  const router = useRouter();

  // Form handlers
  const handleKycSubmit = async () => {
    if (!wallet) {
      setError('Wallet not initialized. Please make sure the Midnight Lace extension is installed.');
      return;
    }

    try {
      setError(null);

      // Make sure wallet is connected
      console.log('Ensuring wallet connection...');
      const connected = await wallet.connect();
      if (!connected) {
        setError('Failed to connect wallet. Please make sure the Midnight Lace extension is installed and unlocked.');
        return;
      }

      // Submit KYC
      console.log('Submitting KYC...');
      const kycData = {
        name: formData.fullName,
        id_number: formData.idNumber,
        timestamp: Math.floor(Date.now() / 1000)
      };

      console.log('KYC Data:', kycData);
      await wallet.executeContract('kyc_verification', 'submit_kyc', [kycData]);

      // Check KYC status
      const currentDid = await wallet.getDID();
      if (currentDid) {
        setDid(currentDid);
        setKycVerified(true);
        clearForm();
        setActiveStep(1);
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit KYC. Please try again.');
    }
  };

  const handleDidGeneration = async () => {
    if (!wallet) {
      setError('Wallet not initialized. Please make sure the Midnight Lace extension is installed.');
      return;
    }

    try {
      // Check wallet connection
      const connected = await wallet.connect();
      if (!connected) {
        setError('Failed to connect wallet. Please make sure the Midnight Lace extension is installed and unlocked.');
        return;
      }

      // DID is already generated from the wallet
      const currentDid = await wallet.getDID();
      if (!currentDid) {
        throw new Error('Failed to get DID');
      }
      setDid(currentDid);
      setActiveStep(2);
      router.push('/dashboard/sender');
    } catch (error) {
      console.error('Error getting DID:', error);
      setError('Error getting DID. Please try again.');
    }
  };

  const handleDidResolution = async () => {
    if (!wallet) {
      setError('Wallet not initialized. Please make sure the Midnight Lace extension is installed.');
      return;
    }

    try {
      // Check wallet connection
      const connected = await wallet.connect();
      if (!connected) {
        setError('Failed to connect wallet. Please make sure the Midnight Lace extension is installed and unlocked.');
        return;
      }

      // Query KYC status for the given DID
      const status = await wallet.queryContract('kyc_verification', 'get_kyc_status', [didToResolve]);
      console.log('Resolved DID Status:', status);

      setResolvedData({
        role: 'Sender', // For now, everyone is a sender
        kycStatus: status.status || 'Unknown'
      });
    } catch (error) {
      console.error('Error resolving DID:', error);
      setError('Error resolving DID. Please try again.');
      setResolvedData({
        role: 'Unknown',
        kycStatus: 'Error'
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Status Bar */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            '& .MuiAlert-message': {
              flex: 1,
              display: 'flex',
              gap: 2
            }
          }}
        >
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
            <Typography>
              Midnight Lace Wallet Active
            </Typography>
            <Typography>
              {kycVerified ? 'KYC Verified' : 'KYC Pending'}
            </Typography>
            <Typography>
              {did ? 'DID Generated' : 'DID Pending'}
            </Typography>
          </Stack>
        </Alert>

        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* KYC Section */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>KYC Verification</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Submit details for enterprise access.
          </Typography>
          
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'warning.main',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'warning.main',
                }
              }}
            />
            
            <TextField
              fullWidth
              label="ID Number"
              value={formData.idNumber}
              onChange={(e) => updateFormData({ idNumber: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'warning.main',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'warning.main',
                }
              }}
            />
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ width: 'fit-content' }}
            >
              Upload Identification
              <VisuallyHiddenInput type="file" onChange={(e) => {
                const file = e.target.files?.[0] || null;
                updateFormData({ document: file });
              }} />
            </Button>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => updateFormData({ agreeToPrivacy: e.target.checked })}
                />
              }
              label="I agree to the privacy policy and terms of service"
            />
            
            <Box>
              <Button
                variant="contained"
                color="warning"
                onClick={handleKycSubmit}
                disabled={!formData.agreeToPrivacy}
                sx={{ mr: 2 }}
              >
                Submit KYC
              </Button>
              <Typography component="span" color="text.secondary">
                KYC Status: {kycVerified ? 'Verified' : 'Pending'}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* DID Section */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>DID Management</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create or resolve your Decentralized Identity.
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Button
                variant="contained"
                color="warning"
                onClick={handleDidGeneration}
                disabled={!kycVerified}
                sx={{ mr: 2 }}
              >
                Generate DID
              </Button>
              {did && (
                <Typography component="span" color="text.secondary">
                  Your DID: {did}
                </Typography>
              )}
            </Box>
            
            <Divider />
            
            <Box>
              <TextField
                fullWidth
                label="Enter DID to Resolve"
                value={didToResolve}
                onChange={(e) => setDidToResolve(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="contained"
                color="warning"
                onClick={handleDidResolution}
                disabled={!didToResolve}
              >
                Resolve
              </Button>
              
              {resolvedData && (
                <Typography sx={{ mt: 2 }}>
                  Role: {resolvedData.role} | KYC: {resolvedData.kycStatus}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
}
