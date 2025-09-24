// src/theme.js
import { createTheme } from '@mui/material/styles';

// Translating your new .dark CSS variables into a Material UI theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    // Core Colors
    primary: {
      main: 'rgb(203, 166, 247)', // --primary (lavender)
      contrastText: 'rgb(30, 30, 46)', // --primary-foreground
    },
    secondary: {
      main: 'rgb(88, 91, 112)', // --secondary (greyish-blue)
      contrastText: 'rgb(205, 214, 244)', // --secondary-foreground
    },
    // Background and Text
    background: {
      default: 'rgb(24, 24, 37)', // --background
      paper: 'rgb(30, 30, 46)', // --card
    },
    text: {
      primary: 'rgb(205, 214, 244)', // --foreground
      secondary: 'rgb(166, 173, 200)', // --muted-foreground
    },
    // Status & Accent Colors
    error: {
      main: 'rgb(243, 139, 168)', // --destructive (pastel red/pink)
    },
    success: {
        main: 'rgb(166, 227, 161)', // --chart-3 (pastel green)
    },
    warning: {
      main: 'rgb(250, 179, 135)', // --chart-4 color
    },
    // Custom Accent Color
    accent: {
        main: 'rgb(137, 220, 235)', // --accent (cyan)
        contrastText: 'rgb(30, 30, 46)', // --accent-foreground
    },
    divider: 'rgb(49, 50, 68)', // --border
    charts: {
      color1: 'rgb(203, 166, 247)', // --chart-1 (lavender)
      color2: 'rgb(137, 220, 235)', // --chart-2 (cyan)
      color3: 'rgb(166, 227, 161)', // --chart-3 (green)
      color4: 'rgb(250, 179, 135)', // --chart-4 (orange)
      color5: 'rgb(243, 139, 168)', // --destructive, a good fit for another chart color
    },
  },
  // Typography and Shapes
  typography: {
    fontFamily: "'Montserrat', sans-serif", // --font-sans
    button: {
      textTransform: 'none', // Buttons will not be all caps
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: '0.35rem', // --radius
  },
  // Global Component Overrides
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '0.35rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.35rem',
        },
      },
    },
  },
});

export default theme;



