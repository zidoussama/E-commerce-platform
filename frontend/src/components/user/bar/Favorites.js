import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, CircularProgress, IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: 'cover',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#00c4b4',
  fontSize: '1.2rem',
  marginTop: theme.spacing(1),
}));

const Favorites = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeStatus, setLikeStatus] = useState({}); // Track like status for each product
  const [likeCounts, setLikeCounts] = useState({}); // Store like counts for each product

  const token = Cookies.get('token');
  const userId = token ? jwtDecode(token).id : null;
  const isLoggedIn = !!userId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchLikedProducts = async () => {
      try {
        // Step 1: Fetch the user's likes
        const likesResponse = await fetch(
          `/api/likes?userId=${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!likesResponse.ok) {
          const errorData = await likesResponse.json();
          if (likesResponse.status === 401) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('userId');
            navigate('/login');
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch liked products');
        }

        const likesData = await likesResponse.json();
        if (likesData.length === 0) {
          setLikedProducts([]);
          setLoading(false);
          return;
        }

        // Step 2: Extract product IDs and fetch product details
        const productIds = likesData.map(like => like.product._id || like.product);
        const productPromises = productIds.map(productId =>
          fetch(`/api/products/${productId}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`Failed to fetch product ${productId}`);
              }
              return res.json();
            })
            .catch(err => {
              console.error(err.message);
              return null; // Return null for failed fetches
            })
        );

        const products = await Promise.all(productPromises);
        const validProducts = products.filter(product => product !== null);

        // Step 3: Set like status for each product (all are liked)
        const initialLikeStatus = validProducts.reduce((acc, product) => {
          acc[product._id] = true;
          return acc;
        }, {});

        setLikedProducts(validProducts);
        setLikeStatus(initialLikeStatus);

        // Step 4: Fetch like counts for all products
        const likeCountsResponse = await fetch(`/api/likes/count`);
        if (!likeCountsResponse.ok) {
          throw new Error('Failed to fetch like counts');
        }
        const likeCountsData = await likeCountsResponse.json();
        const likeCountsMap = likeCountsData.reduce((acc, item) => {
          acc[item.productId] = item.count;
          return acc;
        }, {});
        setLikeCounts(likeCountsMap);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching liked products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [userId, token, isLoggedIn, navigate]);

  const handleToggleLike = async (productId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      if (likeStatus[productId]) {
        // Unlike the product
        const response = await fetch(`/api/likes/remove`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            productId: productId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('userId');
            navigate('/login');
            return;
          }
          throw new Error(errorData.message || 'Failed to unlike product');
        }

        setLikeStatus(prev => ({ ...prev, [productId]: false }));
        setLikedProducts(prev => prev.filter(product => product._id !== productId));
      } else {
        // Like the product (though this shouldn't happen on Favorites page)
        const response = await fetch(`/api/likes/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            productId: productId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('userId');
            navigate('/login');
            return;
          }
          throw new Error(errorData.message || 'Failed to like product');
        }

        setLikeStatus(prev => ({ ...prev, [productId]: true }));
      }
    } catch (err) {
      console.error('Like toggle error:', err);
      setError(err.message);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#00c4b4' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ color: '#ff5252', fontWeight: 500 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: '#333', fontWeight: 700, mb: 4 }}>
        Favorites
      </Typography>

      {likedProducts.length === 0 ? (
        <Typography sx={{ color: '#555', textAlign: 'center', mt: 4 }}>
          No favorite products found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {likedProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <StyledCard>
                <StyledCardMedia
                  component="img"
                  image={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                />
                <StyledCardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                    {product.category?.name || 'Uncategorized'}
                  </Typography>
                  <StyledPrice>
                    ${product.price.toFixed(2)}
                  </StyledPrice>
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    Liked by {likeCounts[product._id] || 0} {likeCounts[product._id] === 1 ? 'user' : 'users'}
                  </Typography>
                </StyledCardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleViewProduct(product._id)}
                    sx={{
                      backgroundColor: '#00c4b4',
                      color: '#fff',
                      borderRadius: '12px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#00b3a6',
                      },
                    }}
                  >
                    View Product
                  </Button>
                  <IconButton
                    onClick={() => handleToggleLike(product._id)}
                    sx={{ color: likeStatus[product._id] ? '#ff5252' : '#00c4b4' }}
                  >
                    {likeStatus[product._id] ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;