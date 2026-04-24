import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import illustrationImage from '../assets/img1.png'; // Import the illustration

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const LeftContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#00c4b4',
  color: '#fff',
  padding: theme.spacing(4),
  borderRadius: '50px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end', // Align content to the bottom
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '400px',
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: '400px',
  },
}));

const StyledForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#fff',
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#00c4b4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00c4b4',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#00c4b4',
  },
  '& .MuiOutlinedInput-input': {
    color: '#333',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  backgroundColor: '#00c4b4',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#00b3a6',
    transform: 'scale(1.05)',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#00c4b4',
  textDecoration: 'none',
  fontWeight: 600,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Illustration = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '12px',
  marginTop: theme.spacing(2),
}));

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phonenumber: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/users/register`, formData);
      setMessage(response.data.msg);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phonenumber: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <StyledContainer>
      <ContentWrapper>
        <LeftContentBox>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            E-commerce online shop
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            explore our wide range of products and enjoy a seamless shopping experience. Join us today and discover the best deals tailored just for you.
          </Typography>
          <Illustration
            src={illustrationImage}
            alt="E-commerce management illustration"
          />
        </LeftContentBox>
        <RightPanel>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#00c4b4', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>E</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
              E SHOP
            </Typography>
          </Box>
          <StyledForm component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1, textAlign: 'center' }}>
              Sign Up
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
              Create your account
            </Typography>

            {message && (
              <Typography
                color="error"
                sx={{ mb: 2, textAlign: "center", color: "#ff5252" }}
              >
                {message}
              </Typography>
            )}

            <Box display="flex" gap={2} sx={{ mb: 2 }}>
              <StyledTextField
                fullWidth
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <StyledTextField
              fullWidth
              label="Phone Number"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <StyledTextField
              fullWidth
              type="email"
              label="Email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <StyledTextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff sx={{ color: '#666', fontSize: 20 }} /> : <Visibility sx={{ color: '#666', fontSize: 20 }} />}
                  </IconButton>
                ),
              }}
            />

            <StyledButton
              type="submit"
              fullWidth
            >
              Sign Up
            </StyledButton>

            <Typography
              sx={{ mt: 2, color: '#666', textAlign: 'center' }}
            >
              Already have an account?{' '}
              <StyledLink to="/login">
                Login here
              </StyledLink>
            </Typography>
          </StyledForm>
        </RightPanel>
      </ContentWrapper>
    </StyledContainer>
  );
};

export default Register;