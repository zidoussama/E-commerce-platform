import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import About from './footer/refound'; // Make sure this is a valid React component

const theme = createTheme({
  palette: {
    primary: { main: '#00BCD4' },
    secondary: { main: '#FFFFFF' },
    text: { primary: '#212121' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 10px rgba(0, 188, 212, 0.5)',
          },
        },
      },
    },
  },
});

const Footer = ({ setCurrentPage }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        component="footer"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          py: 4,
          px: 2,
        }}
      >
        {/* Logo or Title */}
        <Typography variant="h6" gutterBottom>
          Clothing Store
        </Typography>

        {/* Newsletter signup */}
        <Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
          <TextField
            placeholder="Newsletter Signup"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 25 } }}
          />
          <Button variant="contained" color="secondary" fullWidth sx={{ mt: 1 }}>
            Subscribe
          </Button>
        </Box>

        {/* Navigation links */}
        <Box sx={{ mt: 2 }}>
          <Button color="inherit" onClick={() => setCurrentPage(<About />)}>
            About
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage(<div>Contact</div>)}>
            Contact
          </Button>
          <Button color="inherit" onClick={() => setCurrentPage(<div>Privacy Policy</div>)}>
            Privacy Policy
          </Button>
        </Box>

        {/* Social media links */}
        <Box sx={{ mt: 2 }}>
          <IconButton color="inherit" href="https://facebook.com" target="_blank">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" href="https://twitter.com" target="_blank">
            <TwitterIcon />
          </IconButton>
          <IconButton color="inherit" href="https://instagram.com" target="_blank">
            <InstagramIcon />
          </IconButton>
          <IconButton color="inherit" href="https://linkedin.com" target="_blank">
            <LinkedInIcon />
          </IconButton>
        </Box>

        {/* Footer note */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          © 2025 Clothing Store. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
