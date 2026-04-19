import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserHome from './components/UserHome';
import Login from './components/Login';
import Register from './components/Register';
import AdminPage from './components/admin/AdminPage';
import Checkout from './components/user/bar/Checkout';
import Teseac from './components/test/test';
import Payment from './components/user/Payment';
import Ref from'./components/user/footer/refound';





const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/checkout" element={<Checkout />} />
          {/*<Route path="/" element={<Navigate to="/home" replace />} />*/}
          <Route path="/" element={<Teseac />}/>
          {/* Add more routes as needed */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/ref" element={<Ref />} />
          
          
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;