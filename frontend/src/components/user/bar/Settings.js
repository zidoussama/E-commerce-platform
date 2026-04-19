import React from 'react';
import { Box, Typography } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: '#333', fontWeight: 700 }}>
        Settings
      </Typography>
      <Typography sx={{ color: '#555', mt: 2 }}>
        This is the Settings page. Adjust your preferences here.
      </Typography>
    </Box>
  );
};

export default Settings;