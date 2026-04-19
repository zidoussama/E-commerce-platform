import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Grid, TextField, Link, Dialog, 
  DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, FormHelperText 
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import ReactCountryFlag from 'react-country-flag'; // For country flags
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getData } from 'country-list';
import { getCountryCallingCode } from 'libphonenumber-js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  padding: theme.spacing(4),
  maxWidth: 900,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(5),
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderColor: '#1976d2',
  color: '#1976d2',
  textTransform: 'none',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    borderColor: '#1976d2',
    color: '#1976d2',
  },
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#fff',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 196, 180, 0.1)',
    },
    '&.Mui-disabled': {
      backgroundColor: '#e0e0e0',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '& .MuiInputBase-input': {
    color: '#000',
    WebkitTextFillColor: '#000',
  },
  '& .MuiInputBase-input.Mui-disabled': {
    color: '#000',
    WebkitTextFillColor: '#000',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    backgroundColor: '#f5f5f5',
    transition: 'background-color 0.3s ease',
  },
  '&:hover .MuiSelect-select:not(.Mui-disabled)': {
    backgroundColor: 'rgba(0, 196, 180, 0.1)',
  },
  '& .MuiSelect-select.Mui-disabled': {
    backgroundColor: '#e0e0e0',
    WebkitTextFillColor: '#000',
  },
}));

const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#fff',
  minWidth: '40px',
  height: '40px',
  borderRadius: '8px',
  padding: 0,
  '&:hover': {
    backgroundColor: '#1565c0',
  },
  marginLeft: theme.spacing(1),
}));

const PlaceholderText = styled(Typography)(({ theme }) => ({
  color: '#1976d2',
  fontSize: '0.85rem',
  marginTop: theme.spacing(0.5),
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  fontWeight: 700,
  textAlign: 'center',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
}));

const ContinueButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#90caf9',
  color: '#000',
  textTransform: 'uppercase',
  fontWeight: 600,
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: '#64b5f6',
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#e0e0e0',
  color: '#000',
  textTransform: 'uppercase',
  fontWeight: 600,
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: '#bdbdbd',
  },
}));

const countryList = getData();
const countries = countryList
  .map(country => {
    try {
      const dialCode = `+${getCountryCallingCode(country.code)}`;
      return {
        code: country.code,
        name: country.name,
        dialCode,
      };
    } catch (err) {
      return null;
    }
  })
  .filter(country => country !== null)
  .sort((a, b) => a.name.localeCompare(b.name));

const PersonalInformation = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState('+1');

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        fetch(`http://localhost:3001/api/userinfo/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Kept for frontend logic, though backend doesn't require it
          },
        })
          .then(res => {
            if (!res.ok) {
              throw new Error('Failed to fetch user data');
            }
            return res.json();
          })
          .then(data => {
            const userData = {
              firstname: data.firstname || 'Not provided',
              lastname: data.lastname || 'Not provided',
              email: data.email || 'Not provided',
              phonenumber: data.phonenumber || 'Not provided',
              address: data.address || 'Not provided',
              city: data.city || 'Not provided',
              postalCode: data.postalCode || 'Not provided',
            };
            setUser(userData);
            setFormData(userData);

            if (data.phonenumber && data.phonenumber.includes('+')) {
              const phoneParts = data.phonenumber.match(/^(\+\d{1,3})/);
              if (phoneParts) {
                setCountryCode(phoneParts[0]);
              }
            }
          })
          .catch(err => {
            console.error('Error fetching user data:', err);
            setUser(null);
            setFormData(null);
          });
      } catch (err) {
        console.error('Error decoding token:', err);
        setUser(null);
        setFormData(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = ['firstname', 'lastname', 'phonenumber'];

    requiredFields.forEach(field => {
      if (editingField === field && (!formData[field] || formData[field].trim() === '')) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEditClick = (field) => {
    if (field === 'email') {
      setOpenEmailDialog(true);
    } else {
      setEditingField(field);
      setErrors({});
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    setFormData({ ...formData, phonenumber: `${e.target.value}${displayPhoneNumber}` });
  };

  const handlePhoneNumberChange = (e) => {
    setFormData({ ...formData, phonenumber: `${countryCode}${e.target.value}` });
  };

  const handleNewEmailChange = (e) => {
    setNewEmail(e.target.value);
    setEmailError('');
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only digits
    setEnteredCode(value);
    setCodeError('');
  };

  const handleEmailContinue = async () => {
    if (!validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/send-email-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentEmail: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setOpenEmailDialog(false);
        setOpenCodeDialog(true);
      } else {
        setEmailError(data.message || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('Error sending verification code:', err);
      setEmailError('An error occurred. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/resend-email-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentEmail: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setCodeError(''); // Clear any previous errors
        alert('A new code has been sent to your email. Please check your inbox.');
      } else {
        setCodeError(data.message || 'Failed to resend verification code. Please try again.');
      }
    } catch (err) {
      console.error('Error resending verification code:', err);
      setCodeError('An error occurred while resending the code. Please try again.');
    }
  };

  const handleCodeSubmit = async () => {
    // Validate fields before sending the request
    if (!enteredCode) {
      setCodeError('Please enter the verification code');
      return;
    }
    if (enteredCode.length !== 6) {
      setCodeError('The verification code must be exactly 6 digits');
      return;
    }
    if (!newEmail || !validateEmail(newEmail)) {
      setCodeError('Invalid new email address');
      return;
    }
    if (!formData?.email || formData.email === 'Not provided') {
      setCodeError('Current email is invalid');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/verify-email-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentEmail: formData.email, code: enteredCode, newEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, email: newEmail });
        setFormData({ ...formData, email: newEmail });
        setOpenCodeDialog(false);
        setNewEmail('');
        setEnteredCode('');
      } else {
        // Provide more specific error messages based on the backend response
        if (data.message === 'Invalid or expired code') {
          setCodeError('The code is invalid or has expired. Please request a new code.');
        } else if (data.message === 'New email already exists') {
          setCodeError('This email is already in use. Please choose a different email.');
        } else {
          setCodeError(data.message || 'Failed to update email. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setCodeError('An error occurred. Please try again.');
    }
  };

  const handleUpdateClick = () => {
    if (validateFields()) {
      setOpenDialog(true);
    }
  };

  const handleConfirmUpdate = () => {
    const token = Cookies.get('token');
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const updateData = { [editingField]: formData[editingField] }; // Do not include email here

    fetch(`http://localhost:3001/api/userinfo/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Kept for frontend logic, though backend doesn't require it
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'User updated successfully') {
          setUser({ ...user, [editingField]: formData[editingField] });
          setEditingField(null);
          setOpenDialog(false);
        } else {
          console.error('Update failed:', data.message);
        }
      })
      .catch(err => {
        console.error('Error updating user data:', err);
      });
  };

  const handleCancelUpdate = () => {
    setFormData(user);
    setEditingField(null);
    setOpenDialog(false);
    setErrors({});
  };

  const handleEmailDialogClose = () => {
    setOpenEmailDialog(false);
    setNewEmail('');
    setEmailError('');
  };

  const handleCodeDialogClose = () => {
    setOpenCodeDialog(false);
    setEnteredCode('');
    setCodeError('');
  };

  const displayPhoneNumber = formData?.phonenumber?.replace(countryCode, '') || '';

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa' }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: '#00c4b4',
          }}
        >
          Personal Information
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 5,
            color: '#666',
            fontWeight: 500,
          }}
        >
          Manage your account’s details.
        </Typography>

        {user && formData ? (
          <Box>
            <SectionPaper elevation={1}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: '#00c4b4',
                }}
              >
                Account Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        Email
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="email"
                        value={formData.email}
                        disabled
                        variant="outlined"
                      />
                      <PlaceholderText>
                        example@email.com
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('email')} aria-label="Edit email">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        Phone Number
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControl sx={{ minWidth: 120 }} error={!!errors.phonenumber}>
                          <InputLabel>Code</InputLabel>
                          <StyledSelect
                            value={countryCode}
                            onChange={handleCountryCodeChange}
                            label="Code"
                            disabled={editingField !== 'phonenumber'}
                          >
                            {countries.map(country => (
                              <MenuItem key={country.code} value={country.dialCode}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ReactCountryFlag
                                    countryCode={country.code}
                                    svg
                                    style={{ width: '20px', height: '20px' }}
                                  />
                                  <Typography>{country.dialCode}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </StyledSelect>
                        </FormControl>
                        <StyledTextField
                          fullWidth
                          name="phonenumber"
                          value={displayPhoneNumber}
                          onChange={handlePhoneNumberChange}
                          disabled={editingField !== 'phonenumber'}
                          variant="outlined"
                          error={!!errors.phonenumber}
                          helperText={errors.phonenumber}
                        />
                      </Box>
                      <PlaceholderText>
                        +1234567890
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('phonenumber')} aria-label="Edit phone number">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
              </Grid>
            </SectionPaper>

            <SectionPaper elevation={1}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: '#00c4b4',
                }}
              >
                Personal Details
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: '#666',
                  fontWeight: 500,
                }}
              >
                Manage your name and contact info. These personal details are private and will not be displayed to other users. View our{' '}
                <Link
                  href="#"
                  sx={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Privacy Policy
                </Link>.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        First Name
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        disabled={editingField !== 'firstname'}
                        variant="outlined"
                        error={!!errors.firstname}
                        helperText={errors.firstname}
                      />
                      <PlaceholderText>
                        John
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('firstname')} aria-label="Edit first name">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        Last Name
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        disabled={editingField !== 'lastname'}
                        variant="outlined"
                        error={!!errors.lastname}
                        helperText={errors.lastname}
                      />
                      <PlaceholderText>
                        Doe
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('lastname')} aria-label="Edit last name">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
              </Grid>
            </SectionPaper>

            <SectionPaper elevation={1}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: '#00c4b4',
                }}
              >
                Address
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        Address
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={editingField !== 'address'}
                        variant="outlined"
                      />
                      <PlaceholderText>
                        123 Main St
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('address')} aria-label="Edit address">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        City
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={editingField !== 'city'}
                        variant="outlined"
                      />
                      <PlaceholderText>
                        New York
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('city')} aria-label="Edit city">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}
                      >
                        Postal Code
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        disabled={editingField !== 'postalCode'}
                        variant="outlined"
                      />
                      <PlaceholderText>
                        12345
                      </PlaceholderText>
                    </Box>
                    <EditButton onClick={() => handleEditClick('postalCode')} aria-label="Edit postal code">
                      <EditIcon fontSize="small" />
                    </EditButton>
                  </Box>
                </Grid>
              </Grid>
            </SectionPaper>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {editingField && editingField !== 'email' && (
                <UpdateButton
                  variant="contained"
                  onClick={handleUpdateClick}
                >
                  Update
                </UpdateButton>
              )}
              <StyledButton
                variant="outlined"
                onClick={onBack}
              >
                Back to Products
              </StyledButton>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: '#666' }}>
            Loading user information...
          </Typography>
        )}
      </StyledPaper>

      <Dialog open={openDialog} onClose={handleCancelUpdate}>
        <StyledDialogTitle>Confirm Update</StyledDialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">
            Do you want to confirm the update to your {editingField}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmUpdate} 
            variant="contained" 
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEmailDialog} onClose={handleEmailDialogClose}>
        <StyledDialogTitle>Add Your New Email</StyledDialogTitle>
        <DialogContent sx={{ pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            After you confirm this change, please note that you won’t be able to change your email address again for the next 90 days.
          </Typography>
          <TextField
            fullWidth
            label="New Email Address"
            value={newEmail}
            onChange={handleNewEmailChange}
            variant="outlined"
            error={!!emailError}
            helperText={emailError}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', flexDirection: 'column', gap: 1, pb: 2 }}>
          <ContinueButton fullWidth onClick={handleEmailContinue}>
            Continue
          </ContinueButton>
          <CancelButton fullWidth onClick={handleEmailDialogClose}>
            Cancel
          </CancelButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openCodeDialog} onClose={handleCodeDialogClose}>
        <StyledDialogTitle>Verify Your Email</StyledDialogTitle>
        <DialogContent sx={{ pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            We’ve sent a 6-digit code to {formData?.email}. Please enter it below to verify your new email address.
          </Typography>
          <TextField
            fullWidth
            label="Verification Code"
            value={enteredCode}
            onChange={handleCodeChange}
            variant="outlined"
            error={!!codeError}
            helperText={codeError}
            inputProps={{ maxLength: 6 }}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={handleResendCode}
            sx={{ color: '#1976d2', textTransform: 'none' }}
          >
            Resend Code
          </Button>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', flexDirection: 'column', gap: 1, pb: 2 }}>
          <ContinueButton fullWidth onClick={handleCodeSubmit} disabled={enteredCode.length !== 6}>
            Verify
          </ContinueButton>
          <CancelButton fullWidth onClick={handleCodeDialogClose}>
            Cancel
          </CancelButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalInformation;