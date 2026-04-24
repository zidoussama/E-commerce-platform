import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Paper,
  Badge,
  Pagination,
  Skeleton,
  Fade,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Search as SearchIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import {ShoppingCart as CartIcon}  from '@mui/icons-material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

// Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: { main: '#00BCD4' },
    secondary: { main: '#FFFFFF' },
    text: { primary: '#212121' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          transition: 'all 0.3s',
          '&:hover': { boxShadow: '0 0 10px rgba(0, 188, 212, 0.5)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: theme.palette.secondary.main,
}));

const HeroCarousel = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
});

const HeroSlide = styled(Box)(({ active }) => ({
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: active ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0, 188, 212, 0.3), rgba(0, 0, 0, 0.6))',
  },
}));

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

const CategoryButton = styled(Button)(({ active, theme }) => ({
  margin: theme.spacing(1),
  background: active ? theme.palette.primary.main : theme.palette.secondary.main,
  color: active ? theme.palette.secondary.main : theme.palette.text.primary,
  '&:hover': {
    background: theme.palette.primary.light,
    color: theme.palette.secondary.main,
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(0, 188, 212, 0.3)',
  },
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 12,
  backdropFilter: 'blur(8px)',
}));

const TrendingCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s',
  '&:hover': { transform: 'scale(1.02)' },
}));

const NewsletterSection = styled(Box)(({ theme }) => ({
  background: theme.palette.secondary.main,
  padding: theme.spacing(6, 2),
  textAlign: 'center',
  borderTop: `1px solid ${theme.palette.primary.light}`,
}));

const Footer = styled(Box)(({ theme }) => ({
  background: theme.palette.text.primary,
  color: theme.palette.secondary.main,
  padding: theme.spacing(4, 2),
  textAlign: 'center',
}));

const StickyHeader = styled(AppBar)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0, 188, 212, 0.2)',
}));

const BackToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  background: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  '&:hover': { background: theme.palette.primary.dark },
}));

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [randomProducts, setRandomProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const productsPerPage = 4;
  const maxFeaturedProducts = 8;

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053211c18157?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      title: 'Discover Your Style',
      subtitle: 'Shop the latest trends at unbeatable prices.',
    },
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      title: 'Winter Collection',
      subtitle: 'Stay warm and stylish this season.',
    },
    {
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      title: 'Summer Vibes',
      subtitle: 'Bright and bold fashion for sunny days.',
    },
  ];

  const testimonials = [
    { name: 'Jane Doe', text: 'Amazing quality and fast shipping!', avatar: 'https://i.pravatar.cc/100?img=1' },
    { name: 'John Smith', text: 'Trendy styles at great prices.', avatar: 'https://i.pravatar.cc/100?img=2' },
    { name: 'Emma Wilson', text: 'The best shopping experience!', avatar: 'https://i.pravatar.cc/100?img=3' },
  ];

  const trendingProducts = [
    { id: 7, name: 'Leather Boots', price: 99.99, image: 'https://images.unsplash.com/photo-1543508282-6319a3e26236?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 8, name: 'Sweater', price: 49.99, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  ];

  // Shuffle function to randomize products
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories([{ _id: 'All', name: 'All' }, ...data]); // Add "All" category
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([{ _id: 'All', name: 'All' }]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from the API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        const shuffledProducts = shuffleArray(data);
        const selectedRandomProducts = shuffledProducts.slice(0, maxFeaturedProducts);
        setRandomProducts(selectedRandomProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setRandomProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Filter and paginate random products
  const filteredProducts = selectedCategory === 'All' 
    ? randomProducts 
    : randomProducts.filter((p) => p.category === selectedCategory);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <StickyHeader position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Clothing Store
          </Typography>
          <TextField
            placeholder="Search..."
            size="small"
            variant="outlined"
            sx={{ mr: 2, bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 25, '& .MuiOutlinedInput-root': { borderRadius: 25 } }}
            InputProps={{ endAdornment: <SearchIcon /> }}
          />
          
            <IconButton color="inherit">
              <CartIcon />
            </IconButton>
          
          <Button color="inherit" component={Link} to="/home">Home</Button>
          <Button color="inherit" component={Link} to="/register">SignUp</Button>
        </Toolbar>
      </StickyHeader>

      <HeroSection>
        <HeroCarousel>
          {slides.map((slide, index) => (
            <Fade in={index === currentSlide} key={index}>
              <HeroSlide
                active={index === currentSlide}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <HeroContent>
                  <Typography variant="h2" gutterBottom>
                    {slide.title}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {slide.subtitle}
                  </Typography>
                  <Button variant="contained" color="primary" size="large">
                    Shop Now
                  </Button>
                </HeroContent>
              </HeroSlide>
            </Fade>
          ))}
        </HeroCarousel>
        <Box sx={{ position: 'absolute', bottom: 20, display: 'flex', gap: 1 }}>
          {slides.map((_, index) => (
            <IconButton
              key={index}
              size="small"
              sx={{ bgcolor: index === currentSlide ? 'primary.main' : 'secondary.main', color: index === currentSlide ? 'secondary.main' : 'text.primary' }}
              onClick={() => setCurrentSlide(index)}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%' }} />
            </IconButton>
          ))}
        </Box>
      </HeroSection>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {categories.map((category) => (
            <Grid item key={category._id}>
              <CategoryButton
                variant="contained"
                active={selectedCategory === category._id}
                onClick={() => { setSelectedCategory(category._id); setPage(1); }}
              >
                {category.name}
              </CategoryButton>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(productsPerPage)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" height={200} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </Grid>
              ))
            : paginatedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard
                    onMouseEnter={() => setHoveredCard(product._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image[0] || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: hoveredCard === product._id ? 1 : 0,
                        transition: 'opacity 0.3s',
                        zIndex: 2,
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        sx={{ bgcolor: 'primary.main', color: 'secondary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                      >
                        Quick View
                      </Button>
                    </Box>
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" color="primary" fullWidth>
                        Add to Cart
                      </Button>
                    </CardActions>
                  </ProductCard>
                </Grid>
              ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Container>

      <Container sx={{ py: 6, bgcolor: 'secondary.main' }}>
        <Typography variant="h4" align="center" gutterBottom>
          What Our Customers Say
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {testimonials.map((testimonial, index) => (
            <Fade in={index === testimonialSlide} key={index}>
              <TestimonialCard
                elevation={3}
                sx={{ display: index === testimonialSlide ? 'block' : 'none' }}
              >
                <Avatar src={testimonial.avatar} sx={{ mx: 'auto', mb: 2, width: 60, height: 60 }} />
                <Typography variant="body1" gutterBottom>
                  "{testimonial.text}"
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  - {testimonial.name}
                </Typography>
              </TestimonialCard>
            </Fade>
          ))}
          <IconButton
            sx={{ position: 'absolute', top: '50%', left: -40, color: 'primary.main' }}
            onClick={() => setTestimonialSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            sx={{ position: 'absolute', top: '50%', right: -40, color: 'primary.main' }}
            onClick={() => setTestimonialSlide((prev) => (prev + 1) % testimonials.length)}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Container>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Trending Now
        </Typography>
        {trendingProducts.map((product) => (
          <TrendingCard key={product.id}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{ width: 150, height: 100, objectFit: 'cover', mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${product.price}
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                Shop Now
              </Button>
            </Box>
          </TrendingCard>
        ))}
      </Container>

      <Fade in timeout={1000}>
        <NewsletterSection>
          <Typography variant="h4" gutterBottom>
            Join Our Community
          </Typography>
          <Typography variant="body1" gutterBottom>
            Get 15% off your first purchase by subscribing!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', maxWidth: 500, mx: 'auto', mt: 2 }}>
            <TextField
              placeholder="Enter your email"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: '25px 0 0 25px' } }}
            />
            <Button variant="contained" color="primary" sx={{ borderRadius: '0 25px 25px 0', px: 3 }}>
              Subscribe
            </Button>
          </Box>
        </NewsletterSection>
      </Fade>

      <Footer>
        <Typography variant="h6" gutterBottom>
          Clothing Store
        </Typography>
        <Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
          <TextField
            placeholder="Newsletter Signup"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 25 } }}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
            Subscribe
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
          <Button color="inherit">Privacy Policy</Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <IconButton color="inherit" href="https://facebook.com" target="_blank">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" href="https://twitter.com" target="_blank">
            <TwitterIcon />
          </IconButton>
          <IconButton color="inherit" href="https://instagram.com" target="_blank">
            <InstagramIcon />
          </IconButton>
          <IconButton color="inherit" href="https://linkedin.com" target="_blank">
            <LinkedInIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          © 2025 Clothing Store. All rights reserved.
        </Typography>
      </Footer>

      <BackToTopButton onClick={handleScrollToTop}>
        <ArrowUpIcon />
      </BackToTopButton>
    </ThemeProvider>
  );
};

export default LandingPage;