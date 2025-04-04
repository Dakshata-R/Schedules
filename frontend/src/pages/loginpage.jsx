import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Button, TextField, Typography, Paper, 
  CircularProgress, Alert, InputAdornment, 
  IconButton, Divider, Link 
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { 
        email, 
        password 
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        navigate(`/${response.data.role}/dashboard`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/setup-password', { 
        email, 
        password: newPassword 
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        navigate(`/${response.data.role}/dashboard`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Password setup failed. Please try again.');
      setLoading(false);
    }
  };
  if (showPasswordSetup) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 2
      }}>
        <Paper elevation={6} sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 450,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: 'darkgreen',
              mb: 1 
            }}>
              Set Up Your Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please create a new password for your account
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              borderRadius: 1,
              backgroundColor: '#ffebee',
              color: '#b71c1c'
            }}>
              {error}
            </Alert>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSetup();
          }}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'darkgreen' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      sx={{ color: 'darkgreen' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'darkgreen',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'darkgreen',
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'darkgreen' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'darkgreen',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'darkgreen',
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 1, 
                py: 1.5,
                backgroundColor: 'darkgreen',
                '&:hover': {
                  backgroundColor: '#006400',
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Set Password'}
            </Button>
          </form>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 2
    }}>
      <Paper elevation={6} sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: 450,
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: 'darkgreen',
            mb: 1 
          }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access your account
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ 
            mb: 3, 
            borderRadius: 1,
            backgroundColor: '#ffebee',
            color: '#b71c1c'
          }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'darkgreen' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'darkgreen',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'darkgreen',
              }
            }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'darkgreen' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setShowPassword(!showPassword)} 
                    edge="end"
                    sx={{ color: 'darkgreen' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'darkgreen',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'darkgreen',
              }
            }}
          />
          
          <Box textAlign="right" mb={3}>
            <Link 
              href="#" 
              variant="body2" 
              underline="hover"
              sx={{ color: 'darkgreen' }}
            >
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 1, 
              py: 1.5,
              backgroundColor: 'darkgreen',
              '&:hover': {
                backgroundColor: '#006400',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          
          <Divider sx={{ 
            my: 3,
            '&::before, &::after': {
              borderColor: 'darkgreen',
            }
          }}>
            <Typography variant="body2" sx={{ color: 'darkgreen' }}>
              OR
            </Typography>
          </Divider>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                href="#" 
                underline="hover" 
                sx={{ 
                  fontWeight: 600,
                  color: 'darkgreen'
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;