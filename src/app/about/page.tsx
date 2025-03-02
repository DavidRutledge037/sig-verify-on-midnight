'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Grid,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import { Header } from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import GavelIcon from '@mui/icons-material/Gavel';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

export default function About() {
  const theme = useTheme();

  const useCases = [
    {
      title: 'Legal Contracts',
      icon: <GavelIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      description: 'Secure contract signing with privacy-preserving verification for law firms and legal departments.'
    },
    {
      title: 'Financial Agreements',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      description: 'Confidential financial document handling for banks, investment firms, and financial institutions.'
    },
    {
      title: 'Healthcare Records',
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      description: 'HIPAA-compliant document signing for healthcare providers and insurance companies.'
    }
  ];

  const features = [
    {
      title: 'Zero-Knowledge Proofs',
      icon: <SecurityIcon sx={{ fontSize: 56, color: 'warning.main' }} />,
      description: 'Our zk-SNARK technology ensures document integrity while maintaining complete privacy. Verify signatures without revealing sensitive information.',
      cta: 'Learn about ZKP'
    },
    {
      title: 'Enterprise Ready',
      icon: <BusinessIcon sx={{ fontSize: 56, color: 'warning.main' }} />,
      description: "Built for scale with features like role-based access control, audit trails, and compliance reporting. Ready for your organization's needs.",
      cta: 'Enterprise Features'
    },
    {
      title: 'Decentralized Identity',
      icon: <FingerprintIcon sx={{ fontSize: 56, color: 'warning.main' }} />,
      description: 'User-controlled identity verification through DIDs, enabling secure and private document signing across organizations.',
      cta: 'Explore DID'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1a1b1e 30%, #2d2e32 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            About Sig Verify
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            Sig Verify transforms enterprise document signing with privacy-first technology. 
            Built on the Midnight Network, it uses Zero-Knowledge Proofs to secure signatures 
            and Decentralized Identity to empower users—perfect for legal, financial, and 
            healthcare sectors.
          </Typography>
        </Box>

        {/* Use Cases Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Use Cases
          </Typography>
          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  {useCase.icon}
                  <Typography variant="h6" sx={{ my: 2 }}>
                    {useCase.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {useCase.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technology Section */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Technology
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Powered by zk-SNARKs, Compact contracts, and Lace Wallet
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    {feature.icon}
                    <Typography variant="h5" sx={{ my: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="warning"
                      component={Link}
                      href={`#${feature.title.toLowerCase().replace(' ', '-')}`}
                    >
                      {feature.cta}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 6,
            px: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Transform Your Document Signing?
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Get in touch with our team to learn how Sig Verify can help your organization.
          </Typography>
          <Button
            variant="contained"
            color="warning"
            size="large"
            sx={{ px: 6, py: 1.5 }}
          >
            Contact Sales
          </Button>
        </Box>
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
