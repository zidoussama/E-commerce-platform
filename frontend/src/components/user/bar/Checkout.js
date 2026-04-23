import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, Radio, RadioGroup, FormControlLabel,
  FormControl, Button, Divider, CircularProgress, Card, CardMedia, CardContent, Alert,
  Dialog, DialogContent
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CheckCircle, Cancel } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 100,
  height: 100,
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
  fontSize: '1.2rem',
}));

// Animation for the pop-up
const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
    animation: `${fadeIn} 0.5s ease-in-out`,
  },
}));

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: 'US',
  });
  const [fieldErrors, setFieldErrors] = useState({
    address: false,
    city: false,
    postalCode: false,
    phone: false,
    country: false,
  });
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const [popup, setPopup] = useState({ open: false, type: '', message: '' });
  const [saveInfo, setSaveInfo] = useState(false); // State for checkbox

  const token = Cookies.get('token');
  const userId = token ? jwtDecode(token).id : null;
  const isLoggedIn = !!userId;
  const navigate = useNavigate();

  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'ASX7FeiRTLDCZm7ZnZDcL7fwJs6D1s45iu7rBjrEZdf_zQIYhuAi96Ox7nr8LgxlvYTuv6SfClqI6S0B';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const cartResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cart?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!cartResponse.ok) {
          const errorData = await cartResponse.json();
          if (cartResponse.status === 401) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('userId');
            navigate('/');
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch cart');
        }
        const cartData = await cartResponse.json();
        setCart(cartData);

        const userResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/userinfo/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || 'Failed to fetch user information');
        }
        const userData = await userResponse.json();
        setUserInfo(userData);
        setShippingAddress({
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          phone: userData.phonenumber || '',
          country: userData.country || 'US',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token, isLoggedIn, navigate]);

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: !value });
    setError(null);
  };

  const validateFields = () => {
    const errors = {
      address: !shippingAddress.address,
      city: !shippingAddress.city,
      postalCode: !shippingAddress.postalCode,
      phone: !shippingAddress.phone,
      country: !shippingAddress.country,
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Function to update user information in the backend
  const updateUserInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/userinfo/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user information');
      }

      console.log('User information updated successfully');
    } catch (err) {
      console.error('Error updating user information:', err);
      setError(err.message);
    }
  };

  const totalPrice = cart ? cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0) : 0;
  const shippingCost = deliveryMethod === 'Standard' ? 0 : 10;
  const finalTotal = totalPrice + shippingCost;

  const createOrder = (data, actions) => {
    if (!validateFields()) {
      setError('Please fill in all required shipping address fields');
      throw new Error('Validation failed');
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: finalTotal.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: totalPrice.toFixed(2) },
              shipping: { currency_code: 'USD', value: shippingCost.toFixed(2) }
            }
          },
          items: cart.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity.toString(),
            unit_amount: { currency_code: 'USD', value: item.product.price.toFixed(2) }
          })),
          shipping: {
            name: {
              full_name: `${userInfo?.firstname || ''} ${userInfo?.lastname || ''}`.trim(),
            },
            address: {
              address_line_1: shippingAddress.address,
              admin_area_2: shippingAddress.city,
              postal_code: shippingAddress.postalCode,
              country_code: shippingAddress.country,
            },
          },
        }
      ],
      application_context: {
        shipping_preference: 'SET_PROVIDED_ADDRESS',
      }
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      console.log('PayPal Payment Successful:', order);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          deliveryMethod,
          paymentMethod: 'PayPal',
          shippingAddress,
          paypalOrderId: order.id,
          paymentStatus: order.status
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
        throw new Error(errorData.message || 'Failed to place order');
      }

      // Update user info if checkbox is selected
      if (saveInfo) {
        await updateUserInfo();
      }

      setPaypalSuccess(true);
      setPopup({
        open: true,
        type: 'success',
        message: 'Your payment was successful. Thank you for your payment. We will be in contact with more details shortly.'
      });
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (err) {
      console.error('PayPal Place Order Error:', err);
      setPopup({
        open: true,
        type: 'error',
        message: 'Your payment was declined. Please try again or use a different payment method.'
      });
    }
  };

  const onError = (err) => {
    console.error('PayPal Error:', err);
    setPopup({
      open: true,
      type: 'error',
      message: 'Your payment was declined. Please try again or use a different payment method.'
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateFields()) {
      setError('Please fill in all required shipping address fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          deliveryMethod,
          paymentMethod: 'Cash on Delivery',
          shippingAddress
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
        throw new Error(errorData.message || 'Failed to place order');
      }

      // Update user info if checkbox is selected
      if (saveInfo) {
        await updateUserInfo();
      }

      setPopup({
        open: true,
        type: 'success',
        message: 'Your payment was successful. Thank you for your payment. We will be in contact with more details shortly.'
      });
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (err) {
      console.error('Place order error:', err);
      setPopup({
        open: true,
        type: 'error',
        message: 'Your payment was declined. Please try again or use a different payment method.'
      });
    }
  };

  const handleClosePopup = () => {
    setPopup({ open: false, type: '', message: '' });
    if (popup.type === 'success') {
      navigate('/home');
    }
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#555' }}>
          Your cart is empty.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'USD' }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ color: '#333', fontWeight: 700, mb: 4 }}>
            Checkout
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                  Contact Information
                </Typography>
                <TextField
                  label="E-mail"
                  value={userInfo?.email || ''}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <FormControlLabel
                  control={<Radio sx={{ color: '#00c4b4', '&.Mui-checked': { color: '#00c4b4' } }} />}
                  label="E-mail me with news and offers"
                  sx={{ color: '#555' }}
                />
              </Box>

              <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                  Livraison
                </Typography>
                <TextField
                  label="First Name"
                  value={userInfo?.firstname || ''}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <TextField
                  label="Last Name"
                  value={userInfo?.lastname || ''}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <TextField
                  label="Address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingAddressChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={fieldErrors.address}
                  helperText={fieldErrors.address ? 'Address is required' : ''}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <TextField
                  label="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingAddressChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={fieldErrors.city}
                  helperText={fieldErrors.city ? 'City is required' : ''}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <TextField
                  label="Postal Code"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingAddressChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={fieldErrors.postalCode}
                  helperText={fieldErrors.postalCode ? 'Postal Code is required' : ''}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingAddressChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={fieldErrors.phone}
                  helperText={fieldErrors.phone ? 'Phone is required' : ''}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <TextField
                  label="Country Code (e.g., US)"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingAddressChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  error={fieldErrors.country}
                  helperText={fieldErrors.country ? 'Country code is required (e.g., US)' : ''}
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { color: '#333' } }}
                />
                <FormControlLabel
                  control={
                    <Radio
                      sx={{ color: '#00c4b4', '&.Mui-checked': { color: '#00c4b4' } }}
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                    />
                  }
                  label="Save this information for next time"
                  sx={{ color: '#555' }}
                />
              </Box>

              <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                  Delivery Method
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="Standard"
                      control={<Radio sx={{ color: '#00c4b4', '&.Mui-checked': { color: '#00c4b4' } }} />}
                      label="Livraison Standard (3-5 days) - Free"
                      sx={{ color: '#555' }}
                    />
                    <FormControlLabel
                      value="Express"
                      control={<Radio sx={{ color: '#00c4b4', '&.Mui-checked': { color: '#00c4b4' } }} />}
                      label="Livraison Express (1-2 days) - $10.00"
                      sx={{ color: '#555' }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
                  Payment Method
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="Cash on Delivery"
                      control={<Radio sx={{ color: '#00c4b4', '&.Mui-checked': { color: '#00c4b4' } }} />}
                      label="Paiement à la livraison"
                      sx={{ color: '#555' }}
                    />
                    <FormControlLabel
                      value="PayPal"
                      control={<Radio sx={{ color: '#00c4b4', '&.Mui-checked': { color: '#00c4b4' } }} />}
                      label="PayPal"
                      sx={{ color: '#555' }}
                    />
                  </RadioGroup>
                </FormControl>
                {paymentMethod === 'PayPal' && (
                  <Box sx={{ mt: 2 }}>
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </Box>
                )}
              </Box>

              {paymentMethod === 'Cash on Delivery' && (
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  sx={{
                    backgroundColor: '#00c4b4',
                    color: '#fff',
                    borderRadius: '12px',
                    textTransform: 'none',
                    padding: '12px 24px',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#00b3a6',
                    },
                  }}
                >
                  Confirmer la commande
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>
                {cart.items.map(item => (
                  <StyledCard key={item.product._id}>
                    <StyledCardMedia
                      component="img"
                      image={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                      alt={item.product.name}
                    />
                    <StyledCardContent>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
                        {item.product.name}
                      </Typography>
                      <StyledPrice>
                        ${item.product.price.toFixed(2)} x {item.quantity} = ${(item.product.price * item.quantity).toFixed(2)}
                      </StyledPrice>
                    </StyledCardContent>
                  </StyledCard>
                ))}
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555', fontWeight: 500 }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#555', fontWeight: 500 }}>
                    Shipping
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                    {deliveryMethod === 'Standard' ? 'Free' : '$10.00'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#00c4b4' }}>
                    ${finalTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </PayPalScriptProvider>

      {/* Pop-up Dialog */}
      <StyledDialog open={popup.open} onClose={handleClosePopup}>
        <DialogContent>
          {popup.type === 'success' ? (
            <CheckCircle sx={{ fontSize: 80, color: '#28a745', mb: 2 }} />
          ) : (
            <Cancel sx={{ fontSize: 80, color: '#ff5252', mb: 2 }} />
          )}
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
            {popup.type === 'success' ? 'Your payment was successful' : 'Payment Declined'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            {popup.message}
          </Typography>
          {popup.type === 'error' && (
            <Button
              variant="contained"
              onClick={handleClosePopup}
              sx={{
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '8px',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              OK
            </Button>
          )}
        </DialogContent>
      </StyledDialog>
    </>
  );
};

export default Checkout;