import { GoogleOAuthProvider, GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
import { styled } from "@mui/system";
import { Box } from "@mui/material";

const clientId = "963844560077-dob6f6c6sihhj5crbe1844l5mejekfcl.apps.googleusercontent.com"; // Google Client ID

// Styled wrapper to match your existing design
const GoogleButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  "& .g_id_signin": {
    borderRadius: "12px",
    overflow: "hidden",
  },
  "& iframe": {
    borderRadius: "12px !important",
  },
}));

const GoogleLogin = ({ onSuccess, onError }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleButtonWrapper>
        <GoogleLoginButton
          onSuccess={onSuccess}
          onError={onError}
          theme="filled_blue"
          size="large"
          shape="rectangular"
          width="200px"
        />
      </GoogleButtonWrapper>
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin;