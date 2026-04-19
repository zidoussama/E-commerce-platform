import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Box, Paper, Select, MenuItem,
  CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.gradient,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.gradient,
  borderRadius: '12px',
  border: `1.5px solid ${theme.palette.border}`,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  width: '100%',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(0, 196, 180, 0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(Paper)(({ theme, dragOver }) => ({
  padding: theme.spacing(3),
  border: dragOver ? `2px dashed ${theme.palette.primary.main}` : `2px dashed ${theme.palette.border}`,
  background: dragOver ? 'rgba(0, 196, 180, 0.05)' : theme.palette.background.paper,
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '12px',
  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 196, 180, 0.03)',
    borderColor: theme.palette.primary.main,
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
    color: theme.palette.secondary.main,
    fontWeight: 500,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  '& .MuiSelect-select': {
    padding: '10px 14px',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.border,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 4px rgba(0, 196, 180, 0.3)`,
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
  marginBottom: theme.spacing(2),
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.5px',
}));

const StyledImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.border}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
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

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: 500,
  fontFamily: 'Georgia, serif',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  letterSpacing: '0.5px',
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

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    size: [],
  });
  const [sizeInput, setSizeInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setMessage('Error fetching categories: ' + error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setTotalPages(Math.ceil(data.length / productsPerPage));
      } catch (error) {
        setMessage('Error fetching products: ' + error.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeInputChange = (e) => {
    setSizeInput(e.target.value);
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        size: [...prev.size, sizeInput.trim()],
      }));
      setSizeInput('');
    }
  };

  const handleDeleteSize = (sizeToDelete) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.filter(size => size !== sizeToDelete),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageData => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageData],
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.stock || formData.images.length === 0) {
      setMessage('Please fill in all required fields and add at least one image');
      return;
    }

    if (!formData.category) {
      setMessage('Please select a category');
      return;
    }

    setLoadingSubmit(true);
    setMessage('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        image: formData.images,
        size: formData.size.join(', '),
      };

      let response;
      if (editingProductId) {
        response = await fetch(`http://localhost:3001/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch('http://localhost:3001/api/products/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${editingProductId ? 'updating' : 'adding'} product`);
      }

      setMessage(`${editingProductId ? 'Product updated' : 'Product added'} successfully`);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
        size: [],
      });
      setSizeInput('');
      setEditingProductId(null);
      setShowForm(false);

      const productsResponse = await fetch('http://localhost:3001/api/products');
      if (productsResponse.ok) {
        const data = await productsResponse.json();
        setProducts(data);
        setTotalPages(Math.ceil(data.length / productsPerPage));
        setCurrentPage(1);
      }
    } catch (error) {
      setMessage(error.message || 'Internal server error');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEdit = (product) => {
    let sizeArray = [];
    if (Array.isArray(product.size)) {
      sizeArray = product.size;
    } else if (typeof product.size === 'string' && product.size) {
      sizeArray = product.size.split(',').map(s => s.trim());
    }

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category?._id || '',
      stock: product.stock.toString(),
      images: Array.isArray(product.image) ? product.image : [product.image],
      size: sizeArray,
    });
    setEditingProductId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting product');
      }

      setMessage('Product deleted successfully');
      const updatedProducts = products.filter(product => product._id !== productId);
      setProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / productsPerPage));
      if (updatedProducts.slice(indexOfFirstProduct, indexOfLastProduct).length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      setMessage(error.message || 'Internal server error');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: [],
      size: [],
    });
    setSizeInput('');
    setEditingProductId(null);
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
        Manage Products
      </StyledTypography>
      <Typography variant="body2" sx={{ mb: 4, color: 'secondary.main', fontWeight: 500, fontStyle: 'italic' }}>
        Add, edit, or delete products to manage your inventory with elegance.
      </Typography>

      <Box sx={{ mb: 4, width: '100%', maxWidth: '600px' }}>
        <StyledButton
          variant="contained"
          onClick={() => setShowForm(true)}
          fullWidth
        >
          Add New Product
        </StyledButton>
      </Box>

      {message && (
        <Alert
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ mb: 4, width: '100%', maxWidth: '600px', borderRadius: '12px', border: `1.5px solid ${theme => theme.palette.border}`, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
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
                <StyledTableHeadCell>Description</StyledTableHeadCell>
                <StyledTableHeadCell>Price</StyledTableHeadCell>
                <StyledTableHeadCell>Category</StyledTableHeadCell>
                <StyledTableHeadCell>Stock</StyledTableHeadCell>
                <StyledTableHeadCell>Sizes</StyledTableHeadCell>
                <StyledTableHeadCell>Image</StyledTableHeadCell>
                <StyledTableHeadCell>Actions</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingProducts ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} sx={{ color: theme => theme.palette.primary.main }} />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                currentProducts.map(product => (
                  <StyledTableRow key={product._id}>
                    <StyledTableCell>{product.name}</StyledTableCell>
                    <StyledTableCell>{product.description}</StyledTableCell>
                    <StyledTableCell>${product.price.toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{product.category?.name || 'Uncategorized'}</StyledTableCell>
                    <StyledTableCell>{product.stock}</StyledTableCell>
                    <StyledTableCell>
                      {Array.isArray(product.size) && product.size.length > 0
                        ? product.size.join(', ')
                        : typeof product.size === 'string' && product.size
                        ? product.size
                        : 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {product.image && (
                        <img
                          src={Array.isArray(product.image) ? product.image[0] : product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleEdit(product)} sx={{ color: theme => theme.palette.primary.main }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product._id)} sx={{ color: theme => theme.palette.mode === 'dark' ? '#ff7777' : '#ff5252' }}>
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
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: theme => theme.palette.background.gradient,
          },
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 500, fontFamily: 'Georgia, serif', fontSize: '1.8rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
          {editingProductId ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <SectionHeader>Images</SectionHeader>
              <StyledPaper
                dragOver={dragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                role="button"
                tabIndex={0}
                aria-label="Drag and drop images or click to select"
              >
                <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 500 }}>
                  Drag and drop images here or click to select
                </Typography>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </StyledPaper>
              {formData.images.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  {formData.images.map((img, index) => (
                    <StyledImagePreview key={index}>
                      <img
                        src={img}
                        alt={`Preview ${index}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <IconButton
                        onClick={() => removeImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: '#fff',
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </StyledImagePreview>
                  ))}
                </Box>
              )}
            </Box>

            <Box>
              <SectionHeader>Basic Information</SectionHeader>
              <StyledTextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                sx={{ mb: 3 }}
              />
              <StyledTextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Box>

            <Box>
              <SectionHeader>Inventory</SectionHeader>
              <StyledTextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                inputProps={{ min: 0, step: '0.01' }}
                sx={{ mb: 3 }}
              />
              <Box sx={{ position: 'relative', mb: 3 }}>
                {loadingCategories && (
                  <CircularProgress
                    size={24}
                    sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', color: 'primary.main' }}
                  />
                )}
                <StyledSelect
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  displayEmpty
                  disabled={loadingCategories}
                  required
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </Box>
              <StyledTextField
                name="stock"
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                inputProps={{ min: 0 }}
              />
            </Box>

            <Box>
              <SectionHeader>Sizes</SectionHeader>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <StyledTextField
                  label="Size (e.g., S or 40)"
                  value={sizeInput}
                  onChange={handleSizeInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter a size"
                />
                <StyledButton
                  onClick={handleAddSize}
                  disabled={!sizeInput.trim()}
                  sx={{ padding: '10px 20px' }}
                >
                  Add Size
                </StyledButton>
              </Box>
              {formData.size.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.size.map((size, index) => (
                    <Chip
                      key={index}
                      label={size}
                      onDelete={() => handleDeleteSize(size)}
                      sx={{ bgcolor: 'primary.main', color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff', borderRadius: '8px', fontWeight: 500 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
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
            {loadingSubmit ? <CircularProgress size={24} sx={{ color: theme => theme.palette.mode === 'dark' ? '#e0e0e0' : '#fff' }} /> : editingProductId ? 'Update Product' : 'Add Product'}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AddProduct;