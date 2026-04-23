import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import ReactPaginate from 'react-paginate';

// Styled components for the product cards
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: '#fff',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.12)',
  },
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: 'cover',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#333',
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#00c4b4',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  boxShadow: '0 2px 10px rgba(0, 196, 180, 0.3)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Styled component for the pagination
const StyledPagination = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  '& .pagination': {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    gap: '8px',
    alignItems: 'center',
  },
  '& .pagination li': {
    display: 'inline-block',
  },
  '& .pagination a': {
    padding: '8px 12px',
    borderRadius: '4px',
    color: '#888',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    textDecoration: 'none',
  },
  '& .pagination .active a': {
    backgroundColor: '#00c4b4',
    color: '#fff',
    borderColor: '#00c4b4',
  },
  '& .pagination .disabled a': {
    color: '#ccc',
    cursor: 'not-allowed',
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  // Hide the break (ellipsis) since the screenshot doesn't show it
  '& .pagination .break': {
    display: 'none',
  },
}));

const ProductList = ({ searchQuery, selectedCategory, setProductDetail }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // react-paginate uses 0-based indexing
  const productsPerPage = 16; // 25 products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset to page 0 when searchQuery or selectedCategory changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category?._id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage)); // Ensure at least 1 page
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#00c4b4' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error" sx={{ color: '#ff5252', fontWeight: 500 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {filteredProducts.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: '#555', mt: 4 }}>
          No products found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <StyledCard>
                  <StyledCardMedia
                    component="img"
                    image={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <StyledTypography variant="h6">
                      {product.name}
                    </StyledTypography>
                    <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                      {product.category?.name || 'Uncategorized'}
                    </Typography>
                    <StyledPrice variant="h6">
                      ${product.price.toFixed(2)}
                    </StyledPrice>
                    <StyledButton
                      variant="contained"
                      sx={{
                        mt: 1,
                        backgroundColor: '#00c4b4',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#00b3a6',
                        },
                      }}
                      onClick={() => setProductDetail(product._id)}
                    >
                      Show Details
                    </StyledButton>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination - Always shown */}
          <StyledPagination>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={''} // Disable break (ellipsis)
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2} // Show only 2 page numbers as per screenshot
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
              disabledClassName={'disabled'}
              breakClassName={'break'}
              forcePage={currentPage}
            />
          </StyledPagination>
        </>
      )}
    </Box>
  );
};

export default ProductList;