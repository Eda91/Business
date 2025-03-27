import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Container, Typography, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and Password are required');
      return false;
    }
    if (!isLogin && !formData.name) {
      setError('Name is required for registration');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate the form before submitting
    if (!validateForm()) return;
  
    const { name, email, password } = formData;
    setLoading(true); // Set loading state to true when request starts
  
    try {
      const response = await fetch(isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Something went wrong');
      }
  
      console.log('Operation successful:', data);
  
      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
  
      // Redirect user to the profile page after successful login
      navigate('/profile');
    } catch (error) {
      console.error('Operation failed:', error);
      setError(error.message); // Use setError to set the error message
    } finally {
      setLoading(false); // Set loading state to false when request is done
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center">{isLogin ? 'Login' : 'Register'}</Typography>
      
      {!isLogin && (
        <TextField
          fullWidth
          label="Name"
          name="name"
          onChange={handleChange}
          margin="normal"
        />
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        onChange={handleChange}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        onChange={handleChange}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      {error && <Typography color="error" align="center">{error}</Typography>}
      
      <Button fullWidth variant="contained" color="primary" style={{ marginTop: 20 }} onClick={handleSubmit} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : (isLogin ? 'Login' : 'Register')}
      </Button>

      <Typography variant="body2" align="center" style={{ marginTop: 10, cursor: 'pointer' }} onClick={handleToggleMode}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </Typography>
    </Container>
  );
};

export default AuthPage;
