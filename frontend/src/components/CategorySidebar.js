import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Favorite as FavoritesIcon,
  Category as CategoryIcon,
  ShoppingCart as CartIcon,
  Receipt as OrdersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

const StyledBox = styled(Box)(({ theme, expanded }) => ({
  width: expanded ? 280 : 60,
  padding: expanded ? theme.spacing(2) : theme.spacing(1),
  backgroundColor: '#fff',
  position: 'sticky',
  top: 0,
  height: 'auto', // Stretch to the viewport height
  boxShadow: '2px 0 15px rgba(0, 0, 0, 0.1)',
  borderRight: '1px solid #f0f0f0',
  transition: 'width 0.3s ease, padding 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: expanded ? 240 : 50,
  },
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: '12px',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: selected ? 'rgba(0, 196, 180, 0.1)' : 'transparent',
  color: selected ? '#00c4b4' : '#333',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 196, 180, 0.15)',
  },
}));

const StyledSubListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: '8px',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1, 1, 1, 6),
  backgroundColor: selected ? 'rgba(0, 196, 180, 0.05)' : 'transparent',
  color: selected ? '#00c4b4' : '#555',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 196, 180, 0.1)',
  },
}));

const StyledIcon = styled(ListItemIcon)(({ theme, selected }) => ({
  minWidth: 40,
  color: selected ? '#00c4b4' : '#666',
}));

const CategorySidebar = ({ selectedCategory, setSelectedCategory, expanded, setExpanded, setCurrentPage }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCategories, setOpenCategories] = useState(false);
  const [selectedItem, setSelectedItem] = useState('home'); // Default to 'home'

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPage('productList');
    setSelectedItem(''); // Clear main item selection when a category is selected
  };

  // Toggle categories submenu and set page to product list
  const handleToggleCategories = () => {
    if (expanded) {
      setOpenCategories(!openCategories);
      setCurrentPage('productList');
      setSelectedItem('categories');
    }
  };

  // Toggle sidebar expansion
  const handleToggleSidebar = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setOpenCategories(false);
    }
  };

  return (
    <StyledBox expanded={expanded}>
      <List>
        {/* Menu Item (Toggle Sidebar) */}
        <StyledListItem
          button
          onClick={handleToggleSidebar}
          selected={expanded}
        >
          <StyledIcon selected={expanded}>
            <MenuIcon />
          </StyledIcon>
          {expanded && (
            <ListItemText primary="Menu" primaryTypographyProps={{ fontWeight: 600, color: expanded ? '#00c4b4' : '#333' }} />
          )}
        </StyledListItem>

        {/* Home Item */}
        <StyledListItem
          button
          onClick={() => {
            setCurrentPage('productList');
            setSelectedItem('home');
            setSelectedCategory(null); // Reset category filter
          }}
          selected={selectedItem === 'home'}
        >
          <StyledIcon selected={selectedItem === 'home'}>
            <HomeIcon />
          </StyledIcon>
          {expanded && (
            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
          )}
        </StyledListItem>

        {/* Favorites Item */}
        <StyledListItem
          button
          onClick={() => {
            setCurrentPage('favorites');
            setSelectedItem('favorites');
          }}
          selected={selectedItem === 'favorites'}
        >
          <StyledIcon selected={selectedItem === 'favorites'}>
            <FavoritesIcon />
          </StyledIcon>
          {expanded && (
            <ListItemText primary="Favorites" primaryTypographyProps={{ fontWeight: 600 }} />
          )}
        </StyledListItem>

        {/* Categories Item */}
        <StyledListItem
          button
          onClick={handleToggleCategories}
          selected={openCategories || selectedItem === 'categories'}
        >
          <StyledIcon selected={openCategories || selectedItem === 'categories'}>
            <CategoryIcon />
          </StyledIcon>
          {expanded && (
            <>
              <ListItemText primary="Categories" primaryTypographyProps={{ fontWeight: 600, color: (openCategories || selectedItem === 'categories') ? '#00c4b4' : '#333' }} />
              {openCategories ? <ExpandLess sx={{ color: '#00c4b4' }} /> : <ExpandMore sx={{ color: '#666' }} />}
            </>
          )}
        </StyledListItem>
        {expanded && (
          <Collapse in={openCategories} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#00c4b4' }} />
                </Box>
              ) : error ? (
                <Typography variant="body2" sx={{ color: '#ff5252', textAlign: 'center', mt: 1 }}>
                  {error}
                </Typography>
              ) : categories.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#555', textAlign: 'center', mt: 1 }}>
                  No categories found
                </Typography>
              ) : (
                categories.map(category => (
                  <StyledSubListItem
                    key={category._id}
                    button
                    selected={selectedCategory === category._id}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <ListItemText primary={category.name} primaryTypographyProps={{ fontWeight: 500 }} />
                  </StyledSubListItem>
                ))
              )}
            </List>
          </Collapse>
        )}

        {/* Cart Item */}
        <StyledListItem
          button
          onClick={() => {
            setCurrentPage('cart');
            setSelectedItem('cart');
          }}
          selected={selectedItem === 'cart'}
        >
          <StyledIcon selected={selectedItem === 'cart'}>
            <CartIcon />
          </StyledIcon>
          {expanded && (
            <ListItemText primary="Cart" primaryTypographyProps={{ fontWeight: 600 }} />
          )}
        </StyledListItem>

        {/* Orders Item */}
        <StyledListItem
          button
          onClick={() => {
            setCurrentPage('orders');
            setSelectedItem('orders');
          }}
          selected={selectedItem === 'orders'}
        >
          <StyledIcon selected={selectedItem === 'orders'}>
            <OrdersIcon />
          </StyledIcon>
          {expanded && (
            <ListItemText primary="Orders" primaryTypographyProps={{ fontWeight: 600 }} />
          )}
        </StyledListItem>


        {/* Logout Item */}
        <StyledListItem
          button
          onClick={() => {
            setCurrentPage('logout');
            setSelectedItem('logout');
          }}
          selected={selectedItem === 'logout'}
        >
          <StyledIcon selected={selectedItem === 'logout'}>
            <LogoutIcon />
          </StyledIcon>
          {expanded && (
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
          )}
        </StyledListItem>
      </List>
    </StyledBox>
  );
};
export default CategorySidebar;