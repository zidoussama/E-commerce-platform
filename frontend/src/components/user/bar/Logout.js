import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout actions
    Cookies.remove('token');
    Cookies.remove('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userAddress');
    
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000); // 2-second delay
    

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ color: '#333', fontWeight: 700, mb: 2 }}>
        Logout
      </Typography>
      <Typography sx={{ color: '#555', mb: 3 }}>
        You have been logged out successfully.
      </Typography>
    </Box>
  );
};

export default Logout;