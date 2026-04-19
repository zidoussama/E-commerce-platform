import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  AppBar, Toolbar, Typography, Divider, Paper, Tooltip, CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon,
  AddBox as AddBoxIcon, Category as CategoryIcon, ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon, Favorite, Chat, LocalOffer as LocalOfferIcon,
  Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import {ShoppingCart as CartIcon}  from '@mui/icons-material';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import the components for each section
import Dashboard from './Dashboard';
import AddProduct from './AddProduct';
import AddCategories from './AddCategories';
import Orders from './Orders';
import Likes from './Likes';
import Acomments from './Acomments';
import Deal from './adddeals';

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00c4b4',
    },
    secondary: {
      main: '#666',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      gradient: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
    divider: 'rgba(0, 196, 180, 0.2)',
    border: '#e0e0e0',
  },
  typography: {
    fontFamily: 'Georgia, serif',
    h4: {
      fontWeight: 500,
    },
    body2: {
      fontWeight: 500,
      fontStyle: 'italic',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00c4b4',
    },
    secondary: {
      main: '#aaaaaa',
    },
    background: {
      default: '#1e2a38',
      paper: '#2a3b4c',
      gradient: 'linear-gradient(to bottom, #2a3b4c, #1e2a38)',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#aaaaaa',
    },
    divider: 'rgba(0, 196, 180, 0.3)',
    border: '#455a64',
  },
  typography: {
    fontFamily: 'Georgia, serif',
    h4: {
      fontWeight: 500,
    },
    body2: {
      fontWeight: 500,
      fontStyle: 'italic',
    },
  },
});

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.gradient,
  color: theme.palette.primary.main,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), inset 0 1px 3px rgba(0, 0, 0, 0.03)',
  borderBottom: `1.5px solid ${theme.palette.border}`,
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? 280 : 60,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: open ? 280 : 60,
    background: theme.palette.background.gradient,
    color: theme.palette.text.primary,
    borderRight: `1.5px solid ${theme.palette.border}`,
    boxShadow: '2px 0 15px rgba(0, 0, 0, 0.05), inset 0 1px 3px rgba(0, 0, 0, 0.03)',
    transition: 'width 0.3s ease, padding 0.3s ease',
    overflowX: 'hidden',
    top: 64,
    height: 'calc(100vh - 64px)',
    padding: open ? theme.spacing(2) : theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: open ? 240 : 50,
      top: 56,
      height: 'calc(100vh - 56px)',
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: '12px',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: selected ? 'rgba(0, 196, 180, 0.1)' : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 196, 180, 0.15)',
    transform: 'scale(1.02)',
    boxShadow: '0 0 8px rgba(0, 196, 180, 0.2)',
  },
}));

const StyledIcon = styled(ListItemIcon)(({ theme, selected }) => ({
  minWidth: 40,
  color: selected ? theme.palette.primary.main : theme.palette.secondary.main,
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 500,
  fontFamily: 'Georgia, serif',
  color: theme.palette.secondary.main,
  padding: theme.spacing(1, 2),
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  textShadow: '0 1px 1px rgba(0, 0, 0, 0.05)',
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.gradient,
  borderRadius: '12px',
  border: `1.5px solid ${theme.palette.border}`,
  padding: theme.spacing(4),
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

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.divider,
  margin: theme.spacing(1, 0),
}));

const AdminPage = () => {
  const [open, setOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Check user role on mount by decoding the JWT token
  useEffect(() => {
    const checkUserRole = () => {
      const token = Cookies.get('token');
      if (!token) {
        setAuthError('No authentication token found. Please log in.');
        setLoadingAuth(false);
        navigate('/login');
        return;
      }

      try {
        // Decode the JWT token
        const decodedToken = jwtDecode(token);
        
        // Check if the role field exists and is 'admin'
        if (!decodedToken.role || decodedToken.role !== 'admin') {
          setAuthError('You do not have permission to access this page.');
          setLoadingAuth(false);
          navigate('/'); // Redirect to homepage or an unauthorized page
          return;
        }

        setIsAuthorized(true);
        setLoadingAuth(false);
      } catch (err) {
        console.error('Error decoding token:', err);
        setAuthError('Invalid authentication token. Please log in again.');
        setLoadingAuth(false);
        navigate('/login');
      }
    };

    checkUserRole();
  }, [navigate]);

  // Update local storage whenever themeMode changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleThemeToggle = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const menuItems = [
    {
      section: 'Main Navigation',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon />, section: 'Dashboard' },
      ],
    },
    {
      section: 'Product Management',
      items: [
        { text: 'Add Product', icon: <AddBoxIcon />, section: 'AddProduct' },
        { text: 'Add Categories', icon: <CategoryIcon />, section: 'AddCategories' },
      ],
    },
    {
      section: 'Order Management',
      items: [
        { text: 'Orders', icon: <ShoppingCartIcon />, section: 'Orders' },
      ],
    },
    {
      section: 'User Engagement',
      items: [
        { text: 'Manage Likes', icon: <Favorite />, section: 'Likes' },
        { text: 'Manage Comments', icon: <Chat />, section: 'comments' },
        { text: 'Manage Deals', icon: <LocalOfferIcon />, section: 'deals' },
      ],
    },
  ];

  const sectionComponents = {
    Dashboard: {
      component: <Dashboard />,
    },
    AddProduct: {
      component: <AddProduct />,
    },
    AddCategories: {
      component: <AddCategories />,
    },
    Orders: {
      component: <Orders />,
      
    },
    Likes: {
      component: <Likes />,
      
    },
    comments: {
      component: <Acomments />,
      
    },
    deals: {
      component: <Deal />,
      
    },
  };

  if (loadingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: theme.palette.background.default }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (authError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: theme.palette.background.default }}>
        <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', fontWeight: 500 }}>
          {authError}
        </Typography>
      </Box>
    );
  }

  if (!isAuthorized) {
    return null; // The user will be redirected, so no need to render anything
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <StyledAppBar position="fixed">
          <Toolbar>
            
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 500,
                fontFamily: 'Georgia, serif',
                color: 'primary.main',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              Admin Panel - {selectedSection}
            </Typography>
            <Tooltip title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              <IconButton onClick={handleThemeToggle} color="inherit">
                {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </StyledAppBar>

        {/* Main Content Area (Sidebar + Content) */}
        <Box sx={{ display: 'flex', flexGrow: 1, pt: { xs: 7, sm: 8 } }}>
          {/* Sidebar */}
          <StyledDrawer variant="permanent" open={open}>
            <List>
              {/* Menu Item (Toggle Sidebar) */}
              <Tooltip title={open ? '' : 'Menu'} placement="right">
                <StyledListItem
                  button
                  onClick={handleDrawerToggle}
                  selected={open}
                  aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <StyledIcon selected={open}>
                    <MenuIcon />
                  </StyledIcon>
                  {open && (
                    <ListItemText
                      primary="Menu"
                      primaryTypographyProps={{ fontWeight: 600, color: open ? 'primary.main' : 'text.primary', fontFamily: 'Georgia, serif' }}
                    />
                  )}
                </StyledListItem>
              </Tooltip>

              {/* Menu Sections */}
              {menuItems.map((group, index) => (
                <Box key={group.section}>
                  {index > 0 && open && <StyledDivider />}
                  {open && <SectionHeader>{group.section}</SectionHeader>}
                  {group.items.map((item) => (
                    <Tooltip key={item.text} title={open ? '' : item.text} placement="right">
                      <StyledListItem
                        button
                        onClick={() => setSelectedSection(item.section)}
                        selected={selectedSection === item.section}
                      >
                        <StyledIcon selected={selectedSection === item.section}>
                          {item.icon}
                        </StyledIcon>
                        {open && (
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{ fontWeight: 600, fontFamily: 'Georgia, serif' }}
                          />
                        )}
                      </StyledListItem>
                    </Tooltip>
                  ))}
                </Box>
              ))}

              {/* Utility Section */}
              {open && <StyledDivider />}
              {open && <SectionHeader>Utility</SectionHeader>}
              <Tooltip title={open ? '' : 'Logout'} placement="right">
                <StyledListItem button onClick={handleLogout}>
                  <StyledIcon selected={false}>
                    <LogoutIcon />
                  </StyledIcon>
                  {open && (
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{ fontWeight: 600, fontFamily: 'Georgia, serif' }}
                    />
                  )}
                </StyledListItem>
              </Tooltip>
            </List>
          </StyledDrawer>

          {/* Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: theme.palette.background.gradient,
              minHeight: '100vh',
              p: 3,
            }}
          >
            <ContentPaper>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  fontFamily: 'Georgia, serif',
                  color: 'primary.main',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                {selectedSection}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'secondary.main', fontWeight: 500, fontStyle: 'italic' }}>
                {sectionComponents[selectedSection]?.description || 'Manage your admin tasks.'}
              </Typography>
              {sectionComponents[selectedSection]?.component}
            </ContentPaper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPage;