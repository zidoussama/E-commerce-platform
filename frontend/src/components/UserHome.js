import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import TopBar from '../components/TopBar';
import CategorySidebar from '../components/CategorySidebar';
import ProductList from '../components/ProductList';
import ProductDetail from '../components/ProductDetail';
import Favorites from '../components/user/bar/Favorites';
import Cart from '../components/user/bar/Cart';
import Orders from '../components/user/bar/Orders';
import Settings from '../components/user/bar/Settings';
import Logout from '../components/user/bar/Logout';
import PersonalInformation from '../components/user/menu/PersonalInformation';
import DealsCarousel from '../components/user/DealsCarousel';
import FootPage from '../components/user/FootPage';

const UserHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState('productList');
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    console.log('State updated - searchQuery:', searchQuery, 'selectedCategory:', selectedCategory, 'expanded:', expanded, 'currentPage:', currentPage, 'selectedProductId:', selectedProductId);
  }, [searchQuery, selectedCategory, expanded, currentPage, selectedProductId]);

  const setProductDetail = (productId) => {
    setCurrentPage('productDetail');
    setSelectedProductId(productId);
  };

  const handleBackToProducts = () => {
    setCurrentPage('productList');
    setSelectedProductId(null);
  };

  const drawerContent = (
    <CategorySidebar
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      expanded={expanded}
      setExpanded={setExpanded}
      setCurrentPage={setCurrentPage}
    />
  );

  console.log('Rendering UserHome');

  const renderContent = () => {
    switch (currentPage) {
      case 'productList':
        return (
          <Box sx={{ p: 3 }}>
            <DealsCarousel />
            <ProductList
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setProductDetail={setProductDetail}
            />
          </Box>
        );
      case 'productDetail':
        return <ProductDetail id={selectedProductId} onBack={handleBackToProducts} />;
      case 'personalInformation':
        return <PersonalInformation />;
      case 'favorites':
        return <Favorites />;
      case 'cart':
        return <Cart />;
      case 'orders':
        return <Orders />;
      case 'settings':
        return <Settings />;
      case 'logout':
        return <Logout />;
      case 'inbox':
        return <Box sx={{ p: 3 }}><Typography>Inbox Page Placeholder</Typography></Box>;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <DealsCarousel />
            <ProductList
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setProductDetail={setProductDetail}
            />
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <CssBaseline />

      {/* TopBar - Comes First */}
      <Box
        sx={{
          bgcolor: '#fff',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <TopBar onSearch={setSearchQuery} setCurrentPage={setCurrentPage} />
      </Box>

      {/* Main Layout - Sidebar and Content Below TopBar */}
      <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)', overflowY: 'scroll' }}>
        {/* Sidebar */}
        {drawerContent}

        {/* Content AREA */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: '#f5f7fa',
            overflowY: 'auto',
            transition: 'padding-left 0.3s ease',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
      <FootPage />
    </Box>
  );
};

export default UserHome;