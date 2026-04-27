import { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as loginAction, logout as logoutAction, register as registerAction, getUserProfile } from '../store/user/action';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.user);

  // Handle Logout - defined first to avoid reference issues
  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
    navigate('/login');
  }, [dispatch, navigate]);

  // Auto logout khi tài khoản bị khóa
  useEffect(() => {
    const onBlocked = () => {
      dispatch(logoutAction());
      navigate('/login', { state: { blocked: true } });
    };
    window.addEventListener('account-blocked', onBlocked);
    return () => window.removeEventListener('account-blocked', onBlocked);
  }, [dispatch, navigate]);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && !user) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch(getUserProfile(userData.id));
      } catch (e) {
        console.error('Error parsing user data:', e);
        handleLogout();
      }
    }
  }, [dispatch, user, handleLogout]);

  // Handle Login
  const handleLogin = useCallback(async (email, password) => {
    const result = await dispatch(loginAction(email, password));
    
    if (result.success) {
      const { role } = result.data;
      
      // Navigate based on role
      switch (role) {
        case 'candidate':
          navigate('/candidate/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
    
    return result;
  }, [dispatch, navigate]);

  // Handle Register
  const handleRegister = useCallback(async (userData) => {
    const result = await dispatch(registerAction(userData));
    return result;
  }, [dispatch]);

  // Get redirect path based on role
  const getRedirectPath = useCallback((role) => {
    switch (role) {
      case 'candidate':
        return '/candidate/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      getRedirectPath,
    }),
    [user, isAuthenticated, loading, error, handleLogin, handleRegister, handleLogout, getRedirectPath]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
