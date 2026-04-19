import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, IconButton, Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.gradient,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'background 0.3s ease, color 0.3s ease',
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.gradient,
  borderRadius: '12px',
  border: `1.5px solid ${theme.palette.border}`,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  width: '100%',
  transition: 'background 0.3s ease, border-color 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 196, 180, 0.03)',
    },
    '&.Mui-focused': {
      boxShadow: `0 0 4px rgba(0, 196, 180, 0.3)`,
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.mode === 'dark' ? '#3a4a5b' : '#f5f5f5',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.border,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: theme.palette.secondary.main,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'uppercase',
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.mode === 'dark' ? '#00a69a' : '#00a69a'})`,
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
  '&:hover': {
    background: `linear-gradient(to right, ${theme.palette.mode === 'dark' ? '#00a69a' : '#00a69a'}, ${theme.palette.mode === 'dark' ? '#008c80' : '#008c80'})`,
    boxShadow: `0 0 8px rgba(0, 196, 180, 0.3)`,
    transform: 'scale(1.02)',
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 196, 180, 0.5)',
    color: theme.palette.mode === 'dark' ? '#666' : '#ccc',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 500,
  fontFamily: 'Georgia, serif',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.5px',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  border: `1.5px solid ${theme.palette.border}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 196, 180, 0.05)',
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  borderBottom: 'none',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.secondary.main,
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(to right, #3a4a5b, #2a3b4c)' 
    : 'linear-gradient(to right, #f5f5f5, #f0f0f0)',
  borderBottom: `2px solid ${theme.palette.border}`,
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

const AddCategories = () => {
  const [formData, setFormData] = useState({ name: '' });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        setTotalPages(Math.ceil(data.length / categoriesPerPage));
      } catch (error) {
        setMessage('Error fetching categories: ' + error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setMessage('Please enter a category name');
      return;
    }

    setLoadingSubmit(true);
    setMessage('');

    try {
      let response;
      if (editingCategoryId) {
        response = await fetch(`http://localhost:3001/api/categories/${editingCategoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: formData.name }),
        });
      } else {
        response = await fetch('http://localhost:3001/api/categories/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: formData.name }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${editingCategoryId ? 'updating' : 'adding'} category`);
      }

      setMessage(`${editingCategoryId ? 'Category updated' : 'Category added'} successfully`);
      setFormData({ name: '' });
      setEditingCategoryId(null);
      setShowForm(false);

      const categoriesResponse = await fetch('http://localhost:3001/api/categories');
      if (categoriesResponse.ok) {
        const data = await categoriesResponse.json();
        setCategories(data);
        setTotalPages(Math.ceil(data.length / categoriesPerPage));
        setCurrentPage(1); // Reset to first page after adding/updating
      } else {
        throw new Error('Failed to refresh categories');
      }
    } catch (error) {
      setMessage(error.message || 'Internal server error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingCategoryId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting category');
      }

      setMessage('Category deleted successfully');
      const updatedCategories = categories.filter(category => category._id !== categoryId);
      setCategories(updatedCategories);
      setTotalPages(Math.ceil(updatedCategories.length / categoriesPerPage));
      if (updatedCategories.slice(indexOfFirstCategory, indexOfLastCategory).length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      setMessage(error.message || 'Internal server error');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setEditingCategoryId(null);
    setShowForm(false);
    setMessage('');
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

  return (
    <StyledContainer maxWidth="lg">
      <StyledTypography variant="h4" component="h1">
        Manage Categories
      </StyledTypography>
      <Typography variant="body2" sx={{ mb: 4, color: 'secondary.main', fontWeight: 500, fontStyle: 'italic' }}>
        Add, edit, or delete categories with elegance.
      </Typography>

      <Box sx={{ mb: 4, width: '100%', maxWidth: '600px' }}>
        <StyledButton
          variant="contained"
          onClick={() => setShowForm(true)}
          fullWidth
        >
          Add New Category
        </StyledButton>
      </Box>

      {message && (
        <Alert
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ mb: 4, width: '100%', maxWidth: '600px', borderRadius: '12px', border: theme => `1.5px solid ${theme.palette.border}`, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
        >
          {message}
        </Alert>
      )}

      <ContentPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Name</StyledTableHeadCell>
                <StyledTableHeadCell>Actions</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingCategories ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress size={24} sx={{ color: theme => theme.palette.primary.main }} />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                currentCategories.map(category => (
                  <StyledTableRow key={category._id}>
                    <StyledTableCell>{category.name}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleEdit(category)} sx={{ color: theme => theme.palette.primary.main }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(category._id)} sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252' }}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>

        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton active>
              {currentPage}
            </PaginationButton>
            <PaginationButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationContainer>
        )}
      </ContentPaper>

      <Dialog
        open={showForm}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: theme => theme.palette.background.gradient,
            color: theme => theme.palette.text.primary,
          },
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 500, fontFamily: 'Georgia, serif', fontSize: '1.8rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', borderBottom: theme => `2px solid ${theme.palette.primary.main}`, pb: 2 }}>
          {editingCategoryId ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StyledTextField
              name="name"
              label="Category Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <StyledButton
            onClick={handleCancel}
            variant="outlined"
            sx={{ borderColor: 'primary.main', color: 'primary.main', bgcolor: 'transparent', '&:hover': { bgcolor: 'rgba(0, 196, 180, 0.03)' } }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={handleSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? <CircularProgress size={24} sx={{ color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff' }} /> : editingCategoryId ? 'Update Category' : 'Add Category'}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AddCategories;