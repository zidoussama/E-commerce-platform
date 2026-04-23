import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, IconButton, Button
} from '@mui/material';
import { styled } from '@mui/system';
import { Delete } from '@mui/icons-material';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.gradient,
  minHeight: '100vh',
  transition: 'background 0.3s ease, color 0.3s ease',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.border}`,
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: theme.spacing(2),
  border: `1px solid ${theme.palette.border}`,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(4),
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

const CommentsAdmin = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/comments/all`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch comments');
        }

        const data = await response.json();
        setComments(data);
        setTotalPages(Math.ceil(data.length / commentsPerPage));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
      setTotalPages(Math.ceil(updatedComments.length / commentsPerPage));
      if (updatedComments.slice(indexOfFirstComment, indexOfLastComment).length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      console.error('Delete comment error:', err);
      setError(err.message);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: theme => theme.palette.primary.main }} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252', fontWeight: 500 }}>
            {error}
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTypography variant="h4">
        Product Comments
      </StyledTypography>

      {comments.length === 0 ? (
        <Typography sx={{ color: 'secondary.main', textAlign: 'center', mt: 4 }}>
          No comments have been added yet.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentComments.map(comment => (
              <Grid item xs={12} key={comment._id}>
                <StyledCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                      <StyledCardMedia
                        component="img"
                        image={Array.isArray(comment.productId.image) ? comment.productId.image[0] : comment.productId.image}
                        alt={comment.productId.name}
                      />
                      <StyledCardContent>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {comment.productId.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'secondary.main', mb: 1 }}>
                          Commented by: {comment.userId.firstname} {comment.userId.lastname} ({comment.userId.email})
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                          {comment.text}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                          Posted on: {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </StyledCardContent>
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteComment(comment._id)}
                      sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252' }}
                      aria-label={`Delete comment ${comment._id}`}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
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

export default CommentsAdmin;