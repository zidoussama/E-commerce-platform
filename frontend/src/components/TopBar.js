import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
  Badge,
} from '@mui/material';
import { Search as SearchIcon, ShoppingCart as CartIcon, AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: { main: '#00BCD4' },
    secondary: { main: '#FFFFFF' },
    text: { primary: '#212121' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { fontWeight: 600 },
  },
});

const StickyHeader = styled(AppBar)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0, 188, 212, 0.2)',
}));

const SearchFieldStyled = styled(TextField)(({ theme }) => ({
  bgcolor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 25,
  '& .MuiOutlinedInput-root': {
    borderRadius: 25,
    '& fieldset': { borderColor: '#d2d6da' },
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
  },
  '& .MuiInputBase-input': { padding: '8px 12px' },
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': { color: theme.palette.primary.main, backgroundColor: 'rgba(0, 188, 212, 0.1)' },
  marginLeft: theme.spacing(1),
}));

const CartBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#d32f2f',
    color: '#fff',
    minWidth: '18px',
    height: '18px',
    borderRadius: '9px',
    fontSize: '0.7rem',
    padding: '0 4px',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    width: '300px',
    padding: theme.spacing(1),
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  '&:hover': { backgroundColor: '#f1f3f4' },
}));

const CartPreview = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const CartItemCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  marginBottom: theme.spacing(1),
}));

const CartItemMedia = styled(CardMedia)(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: 'cover',
  borderRadius: '4px',
  marginRight: theme.spacing(1),
}));

const GoToCartButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  '&:hover': { backgroundColor: '#0097a7' },
}));

const AppBarComponent = ({ onSearch, setCurrentPage }) => {
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');

  // Initial cart fetch
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        fetch(`/api/userinfo/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
          .then(res => {
            if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : 'Failed to fetch user data');
            return res.json();
          })
          .then(data => setUser({
            userId,
            firstname: data.firstname || 'First',
            lastname: data.lastname || 'Last',
            level: data.level || 1,
          }))
          .catch(err => {
            console.error('User fetch error:', err);
            setError(err.message);
            setUser(null);
            handleLogout();
          });

        const fetchCart = async () => {
          try {
            const response = await fetch(`/api/cart?userId=${userId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
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
            setCartItems(data.items || []);
          } catch (err) {
            console.error('Cart fetch error:', err);
            setError(err.message);
            setCartItems([]);
          }
        };
        fetchCart();
      } catch (err) {
        console.error('Token decode error:', err);
        setError(err.message);
        setUser(null);
        setCartItems([]);
        handleLogout();
      }
    }
  }, [token, navigate]);

  // Refresh cart every 30 seconds
  useEffect(() => {
    if (token && user) {
      const interval = setInterval(async () => {
        try {
          const decoded = jwtDecode(token);
          const userId = decoded.id;
          const response = await fetch(`/api/cart?userId=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
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
          setCartItems(data.items || []);
        } catch (err) {
          console.error('Periodic cart fetch error:', err);
          setError(err.message);
          setCartItems([]);
        }
      }, 1000); // 30 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [token, user, navigate]);

  useEffect(() => {
    const handler = setTimeout(() => onSearch && onSearch(searchValue), 300);
    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  const handleSearchChange = (e) => setSearchValue(e.target.value);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleCartOpen = (event) => setCartAnchorEl(event.currentTarget);
  const handleCartClose = () => setCartAnchorEl(null);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    localStorage.removeItem('userId');
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSearchValue(''); // Clear search bar after navigation
    if (page === 'login') navigate('/login'); // Only navigate for login
    handleMenuClose();
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <ThemeProvider theme={theme}>
      <StickyHeader position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Clothing Store
          </Typography>
          <SearchFieldStyled
            placeholder="Search..."
            size="small"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{ endAdornment: <SearchIcon /> }}
          />
          <ActionIconButton onClick={handleCartOpen}>
            <CartBadge badgeContent={totalItems} color="primary">
              <CartIcon />
            </CartBadge>
          </ActionIconButton>
          <ActionIconButton onClick={handleMenuOpen}>
            <AccountCircle />
          </ActionIconButton>

          {/* Profile Menu */}
          <StyledMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {user ? (
              <Box>
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                  <AccountCircle sx={{ color: theme.palette.text.primary, mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      {user.firstname} {user.lastname}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ bgcolor: '#e0e0e0' }} />
                <StyledMenuItem onClick={handleNavigate.bind(null, 'personalInformation')}>
                  Personal Information
                </StyledMenuItem>
                <StyledMenuItem onClick={handleNavigate.bind(null, 'favorites')}>
                  Favorites
                </StyledMenuItem>
                <StyledMenuItem onClick={handleNavigate.bind(null, 'cart')}>
                  Cart
                </StyledMenuItem>
                <StyledMenuItem onClick={handleNavigate.bind(null, 'orders')}>
                  Orders
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout}>
                  Sign Out
                </StyledMenuItem>
              </Box>
            ) : (
              <StyledMenuItem onClick={handleNavigate.bind(null, 'login')}>
                Sign In
              </StyledMenuItem>
            )}
          </StyledMenu>

          {/* Cart Preview */}
          <StyledMenu
            anchorEl={cartAnchorEl}
            open={Boolean(cartAnchorEl)}
            onClose={handleCartClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <CartPreview>
              {cartItems.length > 0 ? (
                <>
                  <Box sx={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {cartItems.map((item, index) => (
                      <CartItemCard key={index}>
                        <CartItemMedia
                          component="img"
                          image={Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}
                          alt={item.product.name}
                        />
                        <CardContent sx={{ flexGrow: 1, padding: 0, ml: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {item.product.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#757575' }}>
                            QTY: {item.quantity}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            ${item.product.price * item.quantity}
                          </Typography>
                        </CardContent>
                      </CartItemCard>
                    ))}
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ p: 1, textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Total: ${totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <GoToCartButton onClick={() => {
                      setCurrentPage('cart');
                      setSearchValue(''); // Clear search bar after navigation
                    }}>
                      Go to Cart
                    </GoToCartButton>
                  </Box>
                </>
              ) : (
                <Typography sx={{ p: 2, color: '#757575', textAlign: 'center' }}>
                  Your cart is empty
                </Typography>
              )}
            </CartPreview>
          </StyledMenu>
        </Toolbar>
      </StickyHeader>
    </ThemeProvider>
  );
};

export default AppBarComponent;