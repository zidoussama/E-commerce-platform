import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, CircularProgress, TextField, Grid
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.gradient,
  minHeight: '100vh',
  transition: 'background 0.3s ease, color 0.3s ease',
}));

const FormBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.border}`,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'background 0.3s ease, border-color 0.3s ease',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.border}`,
  background: theme.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 196, 180, 0.05)',
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  borderBottom: 'none',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.secondary.main,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(to right, #3a4a5b, #2a3b4c)' 
    : 'linear-gradient(to right, #f5f5f5, #f0f0f0)',
  borderBottom: `2px solid ${theme.palette.border}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 196, 180, 0.03)',
    },
    '&.Mui-focused': {
      boxShadow: `0 0 4px rgba(0, 196, 180, 0.3)`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.border,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: theme.palette.secondary.main,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'uppercase',
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.mode === 'dark' ? '#00a69a' : '#00a69a'})`,
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff',
  transition: 'background 0.3s ease, transform 0.2s ease',
  '&:hover': {
    background: `linear-gradient(to right, ${theme.palette.mode === 'dark' ? '#00a69a' : '#00a69a'}, ${theme.palette.mode === 'dark' ? '#008c80' : '#008c80'})`,
    transform: 'scale(1.02)',
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 196, 180, 0.5)',
    color: theme.palette.mode === 'dark' ? '#666' : '#ccc',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const PaginationButton = styled(Button)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : theme.palette.mode === 'dark' ? '#444' : '#333',
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: '4px',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: active ? (theme.palette.mode === 'dark' ? '#00a69a' : '#00a69a') : theme.palette.mode === 'dark' ? '#555' : '#444',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#666',
    color: theme.palette.mode === 'dark' ? '#777' : '#ccc',
  },
}));

const AddDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/deals');
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        const data = await response.json();
        setDeals(data);
        setTotalPages(Math.ceil(data.length / dealsPerPage));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = deals.slice(indexOfFirstDeal, indexOfLastDeal);

  const handleImageChange = (event) => {
    setSelectedImages(event.target.files);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddDeal = async () => {
    if (selectedImages.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const base64Images = await Promise.all(
        Array.from(selectedImages).map((file) => fileToBase64(file))
      );

      const response = await fetch('http://localhost:3001/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: base64Images,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add deal');
      }

      const newDeal = await response.json();
      const updatedDeals = [...deals, newDeal.deal];
      setDeals(updatedDeals);
      setTotalPages(Math.ceil(updatedDeals.length / dealsPerPage));
      setCurrentPage(1); // Reset to first page after adding
      setSelectedImages([]);
      document.getElementById('image-input').value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/deals/${dealId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete deal');
      }

      const updatedDeals = deals.filter((deal) => deal._id !== dealId);
      setDeals(updatedDeals);
      setTotalPages(Math.ceil(updatedDeals.length / dealsPerPage));
      if (updatedDeals.slice(indexOfFirstDeal, indexOfLastDeal).length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: theme => theme.palette.primary.main }} />
        </Box>
      </StyledContainer>
    );
  }

  if (error && deals.length === 0) {
    return (
      <StyledContainer>
        <Typography variant="h6" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', fontWeight: 500, textAlign: 'center', mt: 4 }}>
          {error}
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTypography variant="h4">
        Manage Deals
      </StyledTypography>

      <FormBox>
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
          Add New Deal
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <StyledTextField
              id="image-input"
              type="file"
              inputProps={{ multiple: true, accept: 'image/jpeg,image/png,image/jpg' }}
              onChange={handleImageChange}
              fullWidth
              variant="outlined"
              label="Select Images"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledButton
              variant="contained"
              onClick={handleAddDeal}
              disabled={uploading}
              fullWidth
            >
              {uploading ? <CircularProgress size={24} sx={{ color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff' }} /> : 'Add Deal'}
            </StyledButton>
          </Grid>
        </Grid>
        {error && (
          <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', mt: 1 }}>
            {error}
          </Typography>
        )}
      </FormBox>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Images</StyledTableHeadCell>
              <StyledTableHeadCell>Created At</StyledTableHeadCell>
              <StyledTableHeadCell>Actions</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1" sx={{ py: 2, color: 'text.primary' }}>
                    No deals available.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentDeals.map((deal) => (
                <StyledTableRow key={deal._id}>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {deal.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Deal image ${index + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: theme => `1px solid ${theme.palette.border}` }}
                        />
                      ))}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{new Date(deal.createdAt).toLocaleDateString()}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      onClick={() => handleDeleteDeal(deal._id)}
                      sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 119, 119, 0.1)' : 'rgba(255, 82, 82, 0.1)' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </PaginationButton>
          <PaginationButton active aria-label={`Current page, page ${currentPage}`}>
            {currentPage}
          </PaginationButton>
          <PaginationButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      )}
    </StyledContainer>
  );
};

export default AddDeals;