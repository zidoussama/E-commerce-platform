import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CircularProgress,
  Divider, Collapse, IconButton, Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import { styled } from '@mui/system';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.gradient,
  minHeight: '100vh',
  fontFamily: 'Roboto, sans-serif',
  transition: 'background 0.3s ease, color 0.3s ease',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.border}`,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: 'none',
  transition: 'border-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

const StyledItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.border}`,
  borderRadius: '6px',
  marginBottom: theme.spacing(1),
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fafafa',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: 60,
  height: 60,
  objectFit: 'cover',
  borderRadius: '6px',
  marginRight: theme.spacing(2),
  border: `1px solid ${theme.palette.border}`,
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  fontSize: '1rem',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  fontFamily: 'Roboto, sans-serif',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
  letterSpacing: '0.5px',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '6px',
  '& .MuiSelect-select': {
    padding: '8px 12px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontFamily: 'Roboto, sans-serif',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.border,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 4px rgba(0, 196, 180, 0.3)`,
  },
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.secondary.main,
  fontFamily: 'Roboto, sans-serif',
  '&.Mui-focused': {
    color: theme.palette.primary.main,
  },
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

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/orders/all`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        const formattedOrders = data.map(order => ({
          ...order,
          shippingAddress: {
            address: order.shippingAddress?.address || 'N/A',
            city: order.shippingAddress?.city || 'N/A',
            postalCode: order.shippingAddress?.postalCode || 'N/A',
            country: order.shippingAddress?.country || 'N/A',
            phone: order.shippingAddress?.phone || 'N/A',
          },
        }));
        setOrders(formattedOrders);
        setTotalPages(Math.ceil(formattedOrders.length / ordersPerPage));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: updatedOrder.order.status } : order
      ));
    } catch (err) {
      console.error('Update order status error:', err);
      setError(err.message);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setExpandedOrder(null); // Collapse any expanded order when changing pages
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setExpandedOrder(null); // Collapse any expanded order when changing pages
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
          <Typography variant="h6" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', fontWeight: 500, fontFamily: 'Roboto, sans-serif' }}>
            {error}
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTypography variant="h4" component="h1">
        All Orders
      </StyledTypography>

      {orders.length === 0 ? (
        <Typography sx={{ color: 'secondary.main', textAlign: 'center', mt: 4, fontWeight: 400, fontFamily: 'Roboto, sans-serif' }}>
          No orders found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentOrders.map(order => (
              <Grid item xs={12} key={order._id}>
                <StyledCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                        Order #{order._id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'secondary.main', fontFamily: 'Roboto, sans-serif' }}>
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      {order.user && (
                        <Typography variant="body2" sx={{ color: 'secondary.main', fontFamily: 'Roboto, sans-serif' }}>
                          User: {order.user.firstname} {order.user.lastname} ({order.user.email})
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControl sx={{ minWidth: 120, mr: 2 }}>
                        <StyledInputLabel>Status</StyledInputLabel>
                        <StyledSelect
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </StyledSelect>
                      </FormControl>
                      <IconButton onClick={() => handleToggleExpand(order._id)} sx={{ color: 'primary.main' }}>
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
                          <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                            {item.product.name}
                          </Typography>
                          <StyledPrice>
                            ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                          </StyledPrice>
                          {item.size && (
                            <Typography variant="body2" sx={{ color: 'secondary.main', fontFamily: 'Roboto, sans-serif' }}>
                              Size: {item.size}
                            </Typography>
                          )}
                        </CardContent>
                      </StyledItemRow>
                    ))}
                    <StyledDivider />
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500, fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                        Shipping Address
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                        Phone: {order.shippingAddress.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500, fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                        Delivery Method
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                        {order.deliveryMethod}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500, fontFamily: 'Roboto, sans-serif', mb: 0.5 }}>
                        Payment Method
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                        {order.paymentMethod}
                      </Typography>
                    </Box>
                    <StyledDivider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontFamily: 'Roboto, sans-serif' }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontFamily: 'Roboto, sans-serif' }}>
                        ${order.total.toFixed(2)}
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

export default AdminOrders;