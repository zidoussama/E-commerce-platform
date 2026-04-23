import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, CircularProgress, IconButton, TextField, Divider, Chip
} from '@mui/material';
import { styled } from '@mui/system';
import { Delete, Favorite, FavoriteBorder } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f7fa',
  minHeight: 'calc(100vh - 64px)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#00c4b4',
  fontSize: '1.1rem',
}));

const StyledOriginalPrice = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: '#888',
  textDecoration: 'line-through',
  marginRight: theme.spacing(1),
}));

const StyledSummaryBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  position: 'sticky',
  top: theme.spacing(4),
}));

const StyledCheckoutButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#333',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
    color: '#888',
  },
}));

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesData, setLikesData] = useState({}); // Track likes for each product

  const token = Cookies.get('token');
  const userId = token ? jwtDecode(token).id : null;
  const isLoggedIn = !!userId;
  const navigate = useNavigate();

  const fetchLikeStatus = async (productId) => {
    if (!isLoggedIn) return { hasLiked: false };

    try {
      const likeResponse = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/likes?userId=${userId}&productId=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (!likeResponse.ok) {
        const errorData = await likeResponse.json();
        if (likeResponse.status === 401) {
          Cookies.remove('token');
          Cookies.remove('role');
          localStorage.removeItem('userId');
          navigate('/login');
          return { hasLiked: false };
        }
        throw new Error(errorData.message || 'Failed to fetch like status');
      }
      const likeData = await likeResponse.json();
      return { hasLiked: likeData.length > 0 };
    } catch (err) {
      console.error('Like status fetch error:', err);
      setError(err.message);
      return { hasLiked: false };
    }
  };

 
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cart?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
          throw new Error(errorData.message || 'Failed to fetch cart');
        }

        const data = await response.json();
        setCart(data);

        // Fetch like status and count for all products in the cart
        const likesPromises = data.items.map(item =>
          Promise.all([
            fetchLikeStatus(item.product._id),
            //fetchLikeCount(item.product._id)
          ])
        );
        const likesResults = await Promise.all(likesPromises);
        const likesMap = {};
        data.items.forEach((item, index) => {
          likesMap[item.product._id] = {
            hasLiked: likesResults[index][0].hasLiked,
            likeCount: likesResults[index][1]
          };
        });
        setLikesData(likesMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId, token, isLoggedIn, navigate]);

  const handleAddToCart = async (productId, quantity = 1, size = null) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: quantity,
          size: size
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
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      console.error('Add to cart error:', err);
      setError(err.message);
    }
  };

  const handleUpdateQuantity = async (productId, size, quantity, stock) => {
    let newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > stock) {
      newQuantity = stock;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: newQuantity,
          size: size
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
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      console.error('Update quantity error:', err);
      setError(err.message);
    }
  };

  const handleRemoveItem = async (productId, size) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          size: size
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
        throw new Error(errorData.message || 'Failed to remove item');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      console.error('Remove item error:', err);
      setError(err.message);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId
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
        throw new Error(errorData.message || 'Failed to clear cart');
      }

      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      console.error('Clear cart error:', err);
      setError(err.message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleToggleLike = async (productId) => {
    if (!isLoggedIn) {
      setError('Please log in to like this product');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const currentLikeData = likesData[productId] || { hasLiked: false, likeCount: 0 };
      if (currentLikeData.hasLiked) {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/likes/remove`, {
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

        setLikesData(prev => ({
          ...prev,
          [productId]: {
            hasLiked: false,
            
          }
        }));
      } else {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/likes/add`, {
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

        setLikesData(prev => ({
          ...prev,
          [productId]: {
            hasLiked: true,
            
          }
        }));
      }
    } catch (err) {
      console.error('Like toggle error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StyledContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#00c4b4' }} />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ color: '#ff5252', fontWeight: 500 }}>
          {error}
        </Typography>
      </StyledContainer>
    );
  }

  const totalPrice = cart?.items?.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const retailPrice = totalPrice * 1.2;
  const discount = retailPrice - totalPrice;
  const shippingThreshold = 30;
  const remainingForFreeShipping = shippingThreshold - totalPrice > 0 ? (shippingThreshold - totalPrice).toFixed(2) : 0;

  return (
    <StyledContainer>
      <Grid container spacing={4}>
        {/* Left Section: Cart Items */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
            ALL ITEMS ({cart?.items?.length || 0})
          </Typography>
          {remainingForFreeShipping > 0 && (
            <Typography sx={{ color: '#00c4b4', mb: 2 }}>
              Add ${remainingForFreeShipping} more to cart for FREE STANDARD SHIPPING!
            </Typography>
          )}
          {cart?.items?.length === 0 ? (
            <Typography sx={{ color: '#555', textAlign: 'center', mt: 4 }}>
              Your cart is empty.
            </Typography>
          ) : (
            cart.items.map(item => {
              const productId = item.product._id;
              const likeData = likesData[productId] || { hasLiked: false, likeCount: 0 };
              return (
                <StyledCard key={`${productId}-${item.size || 'no-size'}`}>
                  <StyledCardMedia
                    component="img"
                    image={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                    alt={item.product.name}
                  />
                  <StyledCardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
                      {item.product.name}
                    </Typography>
                    {item.size && (
                      <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                        Size: {item.size}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StyledOriginalPrice>
                        ${(item.product.price * 1.2).toFixed(2)}
                      </StyledOriginalPrice>
                      <StyledPrice>
                        ${item.product.price.toFixed(2)}
                      </StyledPrice>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          let newQuantity = parseInt(e.target.value);
                          if (isNaN(newQuantity) || newQuantity < 1) {
                            newQuantity = 1;
                          } else if (newQuantity > item.product.stock) {
                            newQuantity = item.product.stock;
                          }
                          setCart(prevCart => ({
                            ...prevCart,
                            items: prevCart.items.map(cartItem =>
                              cartItem.product._id === item.product._id && cartItem.size === item.size
                                ? { ...cartItem, quantity: newQuantity }
                                : cartItem
                            )
                          }));
                          handleUpdateQuantity(item.product._id, item.size, newQuantity, item.product.stock);
                        }}
                        inputProps={{ min: 1, max: item.product.stock }}
                        sx={{ width: 80, mr: 2 }}
                        size="small"
                      />
                      {item.product.stock < 5 && (
                        <Chip
                          label="Almost Sold Out"
                          size="small"
                          sx={{ ml: 2, backgroundColor: '#ff5252', color: '#fff' }}
                        />
                      )}
                    </Box>
                  </StyledCardContent>
                  <CardActions>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={() => handleToggleLike(productId)}
                        sx={{ color: likeData.hasLiked ? '#ff5252' : '#888' }}
                      >
                        {likeData.hasLiked ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      <Typography variant="body2" sx={{ color: '#888', ml: 0.5 }}>
                        {likeData.likeCount}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveItem(item.product._id, item.size)}
                      sx={{ color: '#ff5252' }}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </StyledCard>
              );
            })
          )}
        </Grid>

        {/* Right Section: Order Summary */}
        <Grid item xs={12} md={4}>
          <StyledSummaryBox>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#555' }}>Retail Price:</Typography>
              <Typography sx={{ color: '#555' }}>${retailPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ color: '#555' }}>Promotions:</Typography>
              <Typography sx={{ color: '#ff5252' }}>-${discount.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#333' }}>Estimated Price:</Typography>
              <Typography sx={{ fontWeight: 700, color: '#00c4b4' }}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <StyledCheckoutButton
              fullWidth
              onClick={handleCheckout}
              disabled={cart?.items?.length === 0}
            >
              Checkout Now ({cart?.items?.length || 0})
            </StyledCheckoutButton>
          </StyledSummaryBox>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Cart;