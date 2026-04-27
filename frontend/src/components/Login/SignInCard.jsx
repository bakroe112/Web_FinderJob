import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import { useAuth } from '../../context/AuthContext';

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': {
      borderColor: '#1976D2',
    },
    '&:hover fieldset': {
      borderColor: '#2196F3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: 'rgba(255, 255, 255, 0.5)',
    opacity: 1,
  },
};

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(10, 18, 28, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading } = useAuth();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState(
    location.state?.blocked
      ? { message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.', is_blocked: true }
      : null
  );
  const [open, setOpen] = React.useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'candidate' 
        ? '/candidate/dashboard' 
        : user.role === 'recruiter' 
          ? '/recruiter/dashboard' 
          : '/admin/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Vui lòng nhập email hợp lệ.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    const result = await login(email, password);
    
    if (!result.success) {
      setSubmitError({ message: result.message || 'Đăng nhập thất bại', is_blocked: result.is_blocked || false });
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: '#fff', fontWeight: 700 }}
      >
        Đăng nhập
      </Typography>

      {submitError && (
        <Alert severity={submitError.is_blocked ? 'warning' : 'error'} sx={{ width: '100%' }}>
          {submitError.message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email" sx={{ color: '#fff' }}>Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="a@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            sx={textFieldSx}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <FormLabel htmlFor="password" sx={{ color: '#fff' }}>Mật khẩu</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline', color: '#2196F3' }}
            >
              Quên mật khẩu?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
            sx={textFieldSx}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Ghi nhớ tôi"
          sx={{ color: '#fff' }}
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button 
          type="submit" 
          fullWidth 
          variant="contained"
          disabled={loading}
          sx={{
            py: 1,
            backgroundColor: '#fff',
            color: '#000',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'ĐĂNG NHẬP'}
        </Button>
        <Typography sx={{ textAlign: 'center', color: '#fff' }}>
          Chưa có tài khoản?{' '}
          <Link href="/register" variant="body2" sx={{ color: '#2196F3', alignSelf: 'center' }}>
            Đăng ký
          </Link>
        </Typography>
      </Box>

      <Typography sx={{ textAlign: 'center', color: '#fff', my: 1 }}>hoặc</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Đăng nhập với Google')}
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.2,
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.5px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          Đăng nhập với Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Đăng nhập với Facebook')}
          startIcon={<FacebookIcon />}
          sx={{
            py: 1.2,
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.23)',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.5px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          Đăng nhập với Facebook
        </Button>
      </Box>
    </Card>
  );
}
