import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const DealsCarousel = () => {
  const [imageList, setImageList] = useState([]); // Flattened list of { image, dealIndex }
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch all deals on component mount and flatten into a list of images
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/deals`);
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        const data = await response.json();

        // Flatten the deals into a list of images, each with its dealIndex
        const flattenedImages = data.flatMap((deal, dealIndex) =>
          deal.images.map((image) => ({ image, dealIndex }))
        );

        setImageList(flattenedImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Auto-advance the carousel every 2 seconds
  useEffect(() => {
    if (!isAutoPlaying || imageList.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount or when auto-playing stops
  }, [isAutoPlaying, imageList.length]);

  // Handle back arrow click (previous image)
  const handleBackClick = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false); // Stop auto-playing on user interaction
  };

  // Handle front arrow click (next image)
  const handleForwardClick = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % imageList.length
    );
    setIsAutoPlaying(false); // Stop auto-playing on user interaction
  };

  // Handle dot click (manual navigation)
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false); // Stop auto-playing on user interaction
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: { xs: '100%', sm: '800px' }, height: '350px', bgcolor: '#e0e0e0', margin: '0 auto', borderRadius: '8px' }}>
        <CircularProgress sx={{ color: '#00c4b4' }} />
      </Box>
    );
  }

  if (error || imageList.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: { xs: '100%', sm: '800px' }, height: '350px', bgcolor: '#e0e0e0', margin: '0 auto', borderRadius: '8px' }}>
        <Typography variant="h6" color="error">
          {error || 'No deals available'}
        </Typography>
      </Box>
    );
  }

  const currentImage = imageList[currentImageIndex];

  return (
    <Box sx={{ position: 'relative', bgcolor: '#e0e0e0', borderRadius: '8px', overflow: 'hidden', width: { xs: '100%', sm: '800px' }, height: '350px', margin: '0 auto' }}>
      {/* Back Arrow */}
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Front Arrow */}
      <IconButton
        onClick={handleForwardClick}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <ArrowForwardIcon />
      </IconButton>

      {/* Deal Image */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 2,
        }}
      >
        <img
          src={currentImage.image} // Base64 string
          alt={`Deal image ${currentImageIndex + 1}`}
          style={{
            width: '100%',
            height: '100%', // Match the carousel height
            objectFit: 'cover', // Fill the space, may crop
            borderRadius: '4px',
          }}
        />
      </Box>

      {/* Navigation Dots */}
      <Box sx={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
        {imageList.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              bgcolor: index === currentImageIndex ? '#f5a623' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DealsCarousel;