import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Grid, CardMedia,
  IconButton, Accordion, AccordionSummary, AccordionDetails,
  TextField, Divider, Avatar
} from '@mui/material';
import { styled } from '@mui/system';
import { ArrowBack, AddShoppingCart, ExpandMore, FavoriteBorder, Favorite, Edit, Delete } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: { xs: 2, md: 4 },
  backgroundColor: '#f5f7fa',
  minHeight: 'calc(100vh - 64px)',
}));

const StyledThumbnail = styled(CardMedia)(({ theme, selected }) => ({
  height: 80,
  width: 80,
  objectFit: 'cover',
  borderRadius: '8px',
  border: selected ? '2px solid #00c4b4' : '1px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'border 0.3s ease',
  '&:hover': {
    border: '2px solid #00c4b4',
  },
  marginBottom: theme.spacing(1),
}));

const StyledMainImage = styled(CardMedia)(({ theme }) => ({
  height: 500,
  objectFit: 'contain',
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    height: 300,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#333',
  marginBottom: theme.spacing(1),
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#00c4b4',
  fontSize: '1.8rem',
  marginBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "10px 24px",
  boxShadow: "0 2px 10px rgba(0, 196, 180, 0.3)",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const SizeButton = styled(Button)(({ theme, selected }) => ({
  borderRadius: '4px',
  border: selected ? '2px solid #00c4b4' : '1px solid #e0e0e0',
  color: selected ? '#00c4b4' : '#333',
  backgroundColor: selected ? 'rgba(0, 196, 180, 0.1)' : '#fff',
  textTransform: 'none',
  fontWeight: 500,
  padding: '4px 8px',
  minWidth: '40px',
  marginRight: theme.spacing(1),
  '&:hover': {
    border: '2px solid #00c4b4',
    backgroundColor: 'rgba(0, 196, 180, 0.1)',
  },
}));

const CommentBox = styled(Box)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
}));

const ProductDetail = ({ id, onBack }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [usersInfo, setUsersInfo] = useState({});

  const token = Cookies.get('token');
  const userId = token ? jwtDecode(token).id : null;
  console.log('User ID:', userId);
  console.log('Token:', token);
  const isLoggedIn = !!userId;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
        setLikeCount(data.likeCount || 0);
        // Set the default selected size if sizes are available
        if (data.size && Array.isArray(data.size) && data.size.length > 0) {
          setSelectedSize(data.size[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchLikeStatus = async () => {
      if (!isLoggedIn) return;

      try {
        const likeResponse = await fetch(
          `http://localhost:3001/api/likes?userId=${userId}&productId=${id}`,
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
            window.location.href = '/login';
            return;
          }
          throw new Error(errorData.message || 'Failed to fetch like status');
        }
        const likeData = await likeResponse.json();
        setHasLiked(likeData.length > 0);
      } catch (err) {
        console.error('Like status fetch error:', err);
        setLikeError(err.message);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/comments?productId=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        console.log('Fetched comments:', data);
        setComments(data);

        const userIds = [...new Set(data.map(comment => typeof comment.userId === 'object' ? comment.userId._id : comment.userId))];
        const userPromises = userIds.map(userId =>
          fetch(`http://localhost:3001/api/userinfo/${userId}`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`Failed to fetch user ${userId}`);
              }
              return res.json();
            })
            .catch(err => {
              console.error(err.message);
              return { _id: userId, firstname: 'Unknown', lastname: 'User' };
            })
        );

        Promise.all(userPromises).then(users => {
          const usersMap = users.reduce((acc, user) => {
            acc[user._id] = user;
            return acc;
          }, {});
          setUsersInfo(usersMap);
        });
      } catch (err) {
        console.error('Error fetching comments:', err);
        setCommentError(err.message);
      }
    };

    if (id) {
      console.log('Product ID:', id);
      fetchProduct();
      fetchLikeStatus();
      fetchComments();
    }
  }, [id, userId, token, isLoggedIn]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          productId: id,
          quantity: 1,
          size: selectedSize // Include the selected size in the request
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          Cookies.remove('token');
          Cookies.remove('role');
          localStorage.removeItem('userId');
          window.location.href = '/login';
          return;
        }
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      const data = await response.json();
      console.log('Added to cart:', data);
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert(err.message);
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      setLikeError('Please log in to like this product');
      return;
    }

    setLikeLoading(true);
    setLikeError(null);
    try {
      if (hasLiked) {
        const response = await fetch('http://localhost:3001/api/likes/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            productId: id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            return;
          }
          throw new Error(errorData.message || 'Failed to unlike product');
        }

        setHasLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        const response = await fetch('http://localhost:3001/api/likes/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            productId: id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            Cookies.remove('token');
            Cookies.remove('role');
            localStorage.removeItem('userId');
            window.location.href = '/login';
            return;
          }
          throw new Error(errorData.message || 'Failed to like product');
        }

        setHasLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Like toggle error:', err);
      setLikeError(err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      setCommentError('Please log in to add a comment');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await fetch('http://localhost:3001/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          productId: id,
          text: newComment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const data = await response.json();
      setComments([data.comment, ...comments]);

      const userResponse = await fetch(`http://localhost:3001/api/userinfo/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUsersInfo(prev => ({
          ...prev,
          [userId]: userData
        }));
      }

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: editCommentText
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update comment');
      }

      const data = await response.json();
      setComments(comments.map(c => (c._id === commentId ? data.comment : c)));
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <StyledBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#00c4b4' }} />
      </StyledBox>
    );
  }

  if (error) {
    return (
      <StyledBox sx={{ textAlign: 'center' }}>
        <Typography color="error" sx={{ color: '#ff5252', fontWeight: 500 }}>
          {error}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mt: 2, borderColor: '#00c4b4', color: '#00c4b4', borderRadius: '12px' }}
        >
          Back to Products
        </Button>
      </StyledBox>
    );
  }

  if (!product) {
    return (
      <StyledBox sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: '#555', fontWeight: 500 }}>
          Product not found.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mt: 2, borderColor: '#00c4b4', color: '#00c4b4', borderRadius: '12px' }}
        >
          Back to Products
        </Button>
      </StyledBox>
    );
  }

  const images = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <StyledBox>
      <Grid container spacing={4}>
        {/* Thumbnails */}
        <Grid item xs={2} md={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {images.map((img, index) => (
              <StyledThumbnail
                key={index}
                component="img"
                image={img}
                alt={`${product.name} thumbnail ${index}`}
                selected={selectedImage === index}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </Box>
        </Grid>

        {/* Main Image */}
        <Grid item xs={10} md={5}>
          <StyledMainImage
            component="img"
            image={images[selectedImage]}
            alt={product.name}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <StyledTypography variant="h4">
            {product.name}
          </StyledTypography>
          <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic', mb: 2 }}>
            {product.category?.name || 'Uncategorized'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <StyledPrice>
              ${product.price.toFixed(2)}
            </StyledPrice>
            <Typography sx={{ color: '#ff5252', textDecoration: 'line-through' }}>
              ${(product.price * 1.2).toFixed(2)}
            </Typography>
            <Typography sx={{ bgcolor: '#00c4b4', color: '#fff', fontWeight: 600, px: 1, borderRadius: '12px' }}>
              NEW
            </Typography>
          </Box>

          {/* Like Count and Like Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#555' }}>
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Typography>
            <IconButton
              onClick={handleToggleLike}
              disabled={likeLoading || !!likeError}
              sx={{ color: hasLiked ? '#ff5252' : '#00c4b4' }}
            >
              {hasLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            {likeError && (
              <Typography variant="body2" color="error" sx={{ ml: 1 }}>
                {likeError}
              </Typography>
            )}
          </Box>

          {/* Size Selection (if available) */}
          {product.size && Array.isArray(product.size) && product.size.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#333', mb: 1 }}>
                Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.size.map((size) => (
                  <SizeButton
                    key={size}
                    selected={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </SizeButton>
                ))}
              </Box>
            </Box>
          )}

          {/* Add to Cart */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <StyledButton
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              sx={{
                backgroundColor: '#00c4b4',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#00b3a6',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#888',
                },
              }}
            >
              Add to Cart
            </StyledButton>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
              <strong>Return Policy:</strong> Free returns within 30 days
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              <strong>Shipping:</strong> Free shipping on orders over $50
            </Typography>
          </Box>

          {/* Collapsible Sections */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 500 }}>Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#555', lineHeight: 1.6 }}>
                {product.description || 'No description available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 500 }}>Sizes & Measurements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#555', lineHeight: 1.6 }}>
                Refer to the size chart for accurate measurements.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Comments Section */}
          <Box sx={{ mt: 4 }}>
            <StyledTypography variant="h6">Comments</StyledTypography>
            <Divider sx={{ mb: 2 }} />

            {/* Add Comment Form */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                variant="outlined"
                disabled={commentLoading || !isLoggedIn}
                sx={{ mb: 1 }}
              />
              <StyledButton
                variant="contained"
                onClick={handleAddComment}
                disabled={commentLoading || !isLoggedIn}
                sx={{
                  backgroundColor: '#00c4b4',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#00b3a6',
                  },
                }}
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </StyledButton>
              {commentError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {commentError}
                </Typography>
              )}
            </Box>

            {/* Comments List */}
            {comments.length === 0 ? (
              <Typography sx={{ color: '#555' }}>No comments yet. Be the first to comment!</Typography>
            ) : (
              comments.map((comment) => (
                <CommentBox key={comment._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#00c4b4', mr: 1 }}>
                      {usersInfo[typeof comment.userId === 'object' ? comment.userId._id : comment.userId]?.firstname?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {usersInfo[typeof comment.userId === 'object' ? comment.userId._id : comment.userId] ? 
                          `${usersInfo[typeof comment.userId === 'object' ? comment.userId._id : comment.userId].firstname} ${usersInfo[typeof comment.userId === 'object' ? comment.userId._id : comment.userId].lastname}` : 
                          'Unknown User'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {isLoggedIn && (typeof comment.userId === 'object' ? comment.userId._id : comment.userId) === userId && (
                      <Box>
                        <IconButton
                          onClick={() => handleEditComment(comment)}
                          disabled={commentLoading}
                          sx={{ color: '#00c4b4' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={commentLoading}
                          sx={{ color: '#ff5252' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  {editingCommentId === comment._id ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <StyledButton
                          variant="contained"
                          onClick={() => handleUpdateComment(comment._id)}
                          disabled={commentLoading}
                          sx={{
                            backgroundColor: '#00c4b4',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#00b3a6',
                            },
                          }}
                        >
                          {commentLoading ? 'Updating...' : 'Update'}
                        </StyledButton>
                        <StyledButton
                          variant="outlined"
                          onClick={() => setEditingCommentId(null)}
                          disabled={commentLoading}
                          sx={{
                            borderColor: '#00c4b4',
                            color: '#00c4b4',
                          }}
                        >
                          Cancel
                        </StyledButton>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                      {comment.text}
                    </Typography>
                  )}
                </CommentBox>
              ))
            )}
          </Box>

          {/* Back to Products */}
          <StyledButton
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{
              mt: 3,
              borderColor: '#00c4b4',
              color: '#00c4b4',
              '&:hover': {
                borderColor: '#00b3a6',
                backgroundColor: 'rgba(0, 196, 180, 0.1)',
              },
            }}
          >
            Back to Products
          </StyledButton>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default ProductDetail;