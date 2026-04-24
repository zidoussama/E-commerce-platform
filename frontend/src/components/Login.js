import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import illustrationImage from '../assets/img1.png'; 
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Modal,
  IconButton,
} from "@mui/material";
import { styled } from '@mui/system';
import { Visibility, VisibilityOff, Facebook as FacebookIcon } from '@mui/icons-material';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Updated import

// Replace with your Google Client ID
const clientId = "117787534864-b6djrq92cb0tfet0eodijlgso0136esg.apps.googleusercontent.com"; 

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
  justifyContent: 'flex-end',
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

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  border: '1px solid #e0e0e0',
  color: '#333',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#f5f5f5',
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

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  backgroundColor: '#fff',
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const Illustration = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '12px',
  marginTop: theme.spacing(2),
}));

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetData, setResetData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Connection error");
      
      const isSecure = window.location.protocol === 'https:';
      
      Cookies.set("token", data.token, { expires: 1, secure: isSecure, sameSite: "Strict" });
      Cookies.set("role", data.role, { expires: 1, secure: isSecure, sameSite: "Strict" });

      const decodedToken = jwtDecode(data.token);
      localStorage.setItem("userId", decodedToken.id);

      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "user") {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setOpenModal(true);
    setResetStep(1);
    setError(null);
    setResetMessage(null);
    setResetData({ email: formData.email, code: "", newPassword: "", confirmPassword: "" });
  };

  const handleResetEmail = async () => {
    if (!resetData.email) {
      setError("Please enter your email");
      return;
    }
    setResetLoading(true);
    setError(null);
    setResetMessage(null);
    try {
      const response = await fetch(`/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetData.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error sending reset code");
      setResetMessage("Reset code sent to your email. Please check your inbox.");
      setResetStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetCode = async () => {
    if (!resetData.code) {
      setError("Please enter the reset code");
      return;
    }
    setResetLoading(true);
    setError(null);
    setResetMessage(null);
    try {
      const response = await fetch(`/api/users/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetData.email, resetCode: resetData.code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid or expired code");
      setResetMessage("Code verified. Please enter your new password.");
      setResetStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData.newPassword || !resetData.confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setResetLoading(true);
    setError(null);
    setResetMessage(null);
    try {
      const response = await fetch(`/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetData.email,
          resetCode: resetData.code,
          newPassword: resetData.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error resetting password");
      setResetMessage("Password reset successful. Please log in with your new password.");
      setTimeout(() => {
        setOpenModal(false); 
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  // Google Login Handlers
  const handleGoogleSuccess = (response) => {
    const user = jwtDecode(response.credential);
    const isSecure = window.location.protocol === 'https:';
    
    // Store token and email in cookies
    Cookies.set("tokenJenny", response.credential, { expires: 1, secure: isSecure, sameSite: "Strict" });
    Cookies.set("email", user.email, { expires: 1, secure: isSecure, sameSite: "Strict" });
    localStorage.setItem("userId", user.sub); // Use Google's sub as user ID

    // Navigate to home (consistent with your user role navigation)
    navigate("/home");
  };

  const handleGoogleFailure = () => {
    setError("Failed to connect with Google");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
                Please login to your account
              </Typography>

              {error && (
                <Typography
                  color="error"
                  sx={{ mb: 2, textAlign: "center", color: "#ff5252" }}
                >
                  {error}
                </Typography>
              )}

              <StyledTextField
                fullWidth
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
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

              <Typography
                onClick={handleForgotPassword}
                sx={{
                  mb: 2,
                  color: '#00c4b4',
                  textAlign: 'right',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Typography>

              <StyledButton
                type="submit"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
              >
                {loading ? 'Logging in...' : 'Login'}
              </StyledButton>

              <Typography
                sx={{ color: '#666', textAlign: 'center', mt: 2, mb: 2 }}
              >
                Or login with
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                <SocialButton>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                </SocialButton>
                <SocialButton
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookLogin}
                >
                  Facebook
                </SocialButton>
              </Box>

              <Typography
                sx={{ mt: 1, color: '#666', textAlign: 'center' }}
              >
                Don’t have an account?{' '}
                <StyledLink to="/register">
                  Sign up
                </StyledLink>
              </Typography>
            </StyledForm>
          </RightPanel>
        </ContentWrapper>

        {/* Forgot Password Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="forgot-password-modal"
        >
          <StyledModalBox>
            <Typography
              variant="h5"
              sx={{
                color: '#333',
                mb: 2,
                textAlign: 'center',
                fontWeight: 700,
              }}
            >
              Reset Password
            </Typography>

            {error && (
              <Typography
                color="error"
                sx={{ mb: 2, textAlign: 'center', color: '#ff5252' }}
              >
                {error}
              </Typography>
            )}

            {resetMessage && (
              <Typography
                sx={{ mb: 2, textAlign: 'center', color: '#00c4b4' }}
              >
                {resetMessage}
              </Typography>
            )}

            {/* Step 1: Enter Email */}
            {resetStep === 1 && (
              <>
                <StyledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <StyledButton
                  fullWidth
                  onClick={handleResetEmail}
                  disabled={resetLoading}
                  startIcon={resetLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Code'}
                </StyledButton>
              </>
            )}

            {/* Step 2: Enter Reset Code */}
            {resetStep === 2 && (
              <>
                <StyledTextField
                  fullWidth
                  label="Reset Code"
                  name="code"
                  value={resetData.code}
                  onChange={handleResetChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <StyledButton
                  fullWidth
                  onClick={handleResetCode}
                  disabled={resetLoading}
                  startIcon={resetLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                >
                  {resetLoading ? 'Verifying...' : 'Verify Code'}
                </StyledButton>
              </>
            )}

            {/* Step 3: Enter New Password */}
            {resetStep === 3 && (
              <>
                <StyledTextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleNewPassword} edge="end">
                        {showNewPassword ? <VisibilityOff sx={{ color: '#666', fontSize: 20 }} /> : <Visibility sx={{ color: '#666', fontSize: 20 }} />}
                      </IconButton>
                    ),
                  }}
                />
                <StyledTextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={resetData.confirmPassword}
                  onChange={handleResetChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff sx={{ color: '#666', fontSize: 20 }} /> : <Visibility sx={{ color: '#666', fontSize: 20 }} />}
                      </IconButton>
                    ),
                  }}
                />
                <StyledButton
                  fullWidth
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  startIcon={resetLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                >
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </StyledButton>
              </>
            )}
          </StyledModalBox>
        </Modal>
      </StyledContainer>
    </GoogleOAuthProvider>
  );
};

export default Login;