import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { styled } from '@mui/material/styles';
import AppTheme from '../../theme/AppTheme';
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
  margin: 'auto',
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = React.useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
  });

  const [errors, setErrors] = React.useState({});
  const [submitError, setSubmitError] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Họ tên phải có ít nhất 2 ký tự.';
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ.';
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!validateInputs()) {
      return;
    }

    const result = await register({
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (result.success) {
      setSubmitSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setSubmitError(result.message || 'Đăng ký thất bại');
    }
  };

  return (
    <AppTheme defaultMode="dark">
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', color: '#fff', fontWeight: 700 }}
          >
            Đăng ký
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {submitError}
            </Alert>
          )}

          {submitSuccess && (
            <Alert severity="success" sx={{ width: '100%' }}>
              {submitSuccess}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="full_name" sx={{ color: '#fff' }}>Họ và tên</FormLabel>
              <TextField
                autoComplete="name"
                name="full_name"
                required
                fullWidth
                id="full_name"
                placeholder="Nguyễn Văn A"
                value={formData.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
                sx={textFieldSx}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email" sx={{ color: '#fff' }}>Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="a@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={textFieldSx}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password" sx={{ color: '#fff' }}>Mật khẩu</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={textFieldSx}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="confirmPassword" sx={{ color: '#fff' }}>Xác nhận mật khẩu</FormLabel>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="••••••"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={textFieldSx}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: '#fff' }}>Bạn là</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="candidate"
                  control={<Radio />}
                  label="Ứng viên"
                  sx={{ color: '#fff' }}
                />
                <FormControlLabel
                  value="recruiter"
                  control={<Radio />}
                  label="Nhà tuyển dụng"
                  sx={{ color: '#fff' }}
                />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 1, backgroundColor: '#fff', color: '#000', fontWeight: 600, '&:hover': { backgroundColor: '#f5f5f5' }, '&:disabled': { backgroundColor: '#ccc' } }}
            >
              {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
            </Button>

            <Typography sx={{ textAlign: 'center', color: '#fff' }}>
              Đã có tài khoản?{' '}
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ alignSelf: 'center', color: '#2196F3' }}
              >
                Đăng nhập ngay
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
