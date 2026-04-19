import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  CircularProgress, Divider, IconButton, Collapse
} from '@mui/material';
import { styled } from '@mui/system';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { ExpandMore, ExpandLess, Print } from '@mui/icons-material';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  fontFamily: 'Roboto, sans-serif',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: 'none',
  transition: 'border-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    borderColor: '#00c4b4',
    transform: 'translateY(-2px)',
  },
}));

const StyledItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  marginBottom: theme.spacing(1),
  backgroundColor: '#fafafa',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: 60,
  height: 60,
  objectFit: 'cover',
  borderRadius: '6px',
  marginRight: theme.spacing(2),
  border: '1px solid #e0e0e0',
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#00c4b4',
  fontSize: '1rem',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '6px',
  padding: theme.spacing(1, 2),
  fontWeight: 500,
  textTransform: 'none',
  borderColor: '#ff5252',
  color: '#ff5252',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  '&:hover': {
    backgroundColor: '#ff5252',
    color: '#fff',
    borderColor: '#ff5252',
  },
}));

const StyledPrintButton = styled(Button)(({ theme }) => ({
  borderRadius: '6px',
  padding: theme.spacing(1, 2),
  fontWeight: 500,
  textTransform: 'none',
  borderColor: '#00c4b4',
  color: '#00c4b4',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  '&:hover': {
    backgroundColor: '#00c4b4',
    color: '#fff',
    borderColor: '#00c4b4',
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: 'rgba(0, 196, 180, 0.2)',
  margin: theme.spacing(2, 0),
}));

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const token = Cookies.get('token');
  const userId = token ? jwtDecode(token).id : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order');
      }

      const updatedOrder = await response.json();
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: updatedOrder.order.status } : order
      ));
    } catch (err) {
      console.error('Cancel order error:', err);
      setError(err.message);
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice #${order._id}</title>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 20px;
              color: #333;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e0e0e0;
              padding: 20px;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #00c4b4;
              font-size: 24px;
              margin: 0;
            }
            .order-info, .shipping-info, .payment-info {
              margin-bottom: 20px;
            }
            .order-info p, .shipping-info p, .payment-info p {
              margin: 5px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items-table th, .items-table td {
              border: 1px solid #e0e0e0;
              padding: 8px;
              text-align: left;
            }
            .items-table th {
              background-color: #f5f5f5;
              color: #333;
              font-weight: 600;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: 600;
              color: #00c4b4;
            }
            .divider {
              border-top: 1px solid rgba(0, 196, 180, 0.2);
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>Order Invoice #${order._id}</h1>
              <p>Placed on: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: <span style="color: ${order.status === 'Delivered' ? '#00c4b4' : order.status === 'Cancelled' ? '#ff5252' : '#888'}">${order.status}</span></p>
            </div>

            <div class="order-info">
              <h3>Order Details</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Size</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td>${item.product.name}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>${item.quantity}</td>
                      <td>${item.size || 'N/A'}</td>
                      <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="divider"></div>

            <div class="shipping-info">
              <h3>Shipping Address</h3>
              <p>${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
              <p>Phone: ${order.shippingAddress.phone}</p>
              <p>Delivery Method: ${order.deliveryMethod}</p>
            </div>

            <div class="payment-info">
              <h3>Payment Method</h3>
              <p>${order.paymentMethod}</p>
            </div>

            <div class="divider"></div>

            <div class="total">
              <p>Total: $${order.total.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={40} sx={{ color: '#00c4b4' }} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#ff5252', fontWeight: 500, fontFamily: 'Roboto, sans-serif' }}>
            {error}
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography
        variant="h4"
        sx={{
          color: '#333',
          fontWeight: 600,
          fontFamily: 'Roboto, sans-serif',
          mb: 4,
          letterSpacing: '0.5px',
        }}
      >
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography sx={{ color: '#666', textAlign: 'center', mt: 4, fontWeight: 400, fontFamily: 'Roboto, sans-serif' }}>
          You have no orders yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map(order => (
            <Grid item xs={12} key={order._id}>
              <StyledCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                      Order #{order._id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontFamily: 'Roboto, sans-serif' }}>
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: order.status === 'Delivered' ? '#00c4b4' : order.status === 'Cancelled' ? '#ff5252' : '#888',
                        fontWeight: 500,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      Status: {order.status}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {(order.status === 'Pending' || order.status === 'Processing') && (
                      <StyledButton
                        variant="outlined"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </StyledButton>
                    )}
                    <StyledPrintButton
                      variant="outlined"
                      onClick={() => handlePrintOrder(order)}
                      sx={{ ml: 1 }}
                      startIcon={<Print />}
                    >
                      Print Order
                    </StyledPrintButton>
                    <IconButton onClick={() => handleToggleExpand(order._id)} sx={{ color: '#00c4b4', ml: 1 }}>
                      {expandedOrder === order._id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>
                <Collapse in={expandedOrder === order._id}>
                  {order.items.map(item => (
                    <StyledItemRow key={item.product._id}>
                      <StyledImage
                        src={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                        alt={item.product.name}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                          {item.product.name}
                        </Typography>
                        <StyledPrice>
                          ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                        </StyledPrice>
                        {item.size && (
                          <Typography variant="body2" sx={{ color: '#666', fontFamily: 'Roboto, sans-serif' }}>
                            Size: {item.size}
                          </Typography>
                        )}
                      </CardContent>
                    </StyledItemRow>
                  ))}
                  <StyledDivider />
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: 500, fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                      Phone: {order.shippingAddress.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: 500, fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                      Delivery Method
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                      {order.deliveryMethod}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: 500, fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                      Payment Method
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                      {order.paymentMethod}
                    </Typography>
                  </Box>
                  <StyledDivider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif' }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#00c4b4', fontFamily: 'Roboto, sans-serif' }}>
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Collapse>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </StyledContainer>
  );
};

export default Orders;