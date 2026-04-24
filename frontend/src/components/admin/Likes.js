import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, Divider, Collapse, IconButton, Button
} from '@mui/material';
import { styled } from '@mui/system';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.gradient,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  transition: 'background 0.3s ease, color 0.3s ease',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.gradient,
  borderRadius: '12px',
  border: `1.5px solid ${theme.palette.border}`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledItemCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '12px',
  border: `1px solid ${theme.palette.border}`,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05), inset 0 1px 3px rgba(0, 0, 0, 0.03)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: theme.spacing(2),
  border: `1px solid ${theme.palette.border}`,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 500,
  fontFamily: 'Georgia, serif',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.5px',
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: '1.1rem',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.divider,
  margin: theme.spacing(2, 0),
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

const LikesAdmin = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const response = await fetch(`/api/likes/liked-products`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch liked products');
        }

        const data = await response.json();
        setLikedProducts(data);
        setTotalPages(Math.ceil(data.length / productsPerPage));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching liked products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = likedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleToggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setExpandedProduct(null); // Collapse any expanded product when changing pages
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setExpandedProduct(null); // Collapse any expanded product when changing pages
    }
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={40} sx={{ color: theme => theme.palette.primary.main }} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', fontWeight: 500, fontFamily: 'Georgia, serif' }}>
            {error}
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTypography variant="h4" component="h1">
        Liked Products
      </StyledTypography>

      {likedProducts.length === 0 ? (
        <Typography sx={{ color: 'secondary.main', textAlign: 'center', mt: 4, fontWeight: 500, fontStyle: 'italic' }}>
          No products have been liked yet.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentProducts.map(item => (
              <Grid item xs={12} key={item.product._id}>
                <StyledCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StyledCardMedia
                        component="img"
                        image={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                        alt={item.product.name}
                      />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {item.product.name}
                        </Typography>
                        <StyledPrice>
                          ${item.product.price.toFixed(2)}
                        </StyledPrice>
                        <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                          Liked by {item.likedBy.length} user{item.likedBy.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => handleToggleExpand(item.product._id)} sx={{ color: 'primary.main' }}>
                      {expandedProduct === item.product._id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedProduct === item.product._id}>
                    <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500, mb: 1, fontFamily: 'Georgia, serif' }}>
                      Users Who Liked This Product:
                    </Typography>
                    {item.likedBy.map(user => (
                      <Box key={user._id} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          {user.firstname} {user.lastname} ({user.email})
                        </Typography>
                      </Box>
                    ))}
                    <StyledDivider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500, fontFamily: 'Georgia, serif' }}>
                        Total Likes
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {item.likedBy.length}
                      </Typography>
                    </Box>
                  </Collapse>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
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
        </>
      )}
    </StyledContainer>
  );
};

export default LikesAdmin;