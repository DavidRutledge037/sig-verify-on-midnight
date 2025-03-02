import { createTheme } from '@mui/material/styles';

const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        variants: [],
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        },
        '&:active': {
          transform: 'translateY(1px)',
        },
      },
      contained: {
        '&.lace-gradient': {
          backgroundImage: 'linear-gradient(45deg, #FF69B4 30%, #FFA500 90%)',
          '&:hover': {
            backgroundImage: 'linear-gradient(45deg, #FF69B4 40%, #FFA500 100%)',
          },
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        variants: [],
        borderRadius: 16,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        variants: [],
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'rotate(10deg)',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#FF69B4',
      light: '#FFA500',
      dark: '#FF4081',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.6,
    },
  },
  components: commonComponents,
  shape: {
    borderRadius: 12,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#E0E0E0',
    },
    secondary: {
      main: '#FF69B4',
      light: '#FFA500',
      dark: '#FF4081',
    },
    background: {
      default: '#1A1B1E',
      paper: '#2C2D32',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      color: '#FFFFFF',
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.6,
    },
  },
  components: {
    ...commonComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiCard.styleOverrides.root,
          background: 'linear-gradient(145deg, #2C2D32, #1A1B1E)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});
