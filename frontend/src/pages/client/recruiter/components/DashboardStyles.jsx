import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

export const StatsCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '2px solid #CEE5FD',
  boxShadow: '0 2px 8px rgba(1, 50, 101, 0.08)',
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #013265 0%, #F4C000 100%)',
  },
  '&:hover': {
    boxShadow: '0 12px 32px rgba(1, 50, 101, 0.2)',
    transform: 'translateY(-6px)',
    borderColor: '#DEA500',
  },
}));

export const JobCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #CEE5FD',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(1, 50, 101, 0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 32px rgba(1, 50, 101, 0.2)',
    transform: 'translateY(-8px)',
    borderColor: '#F4C000',
  },
}));

export const StyledButton = styled(Button)(({ theme, variant }) => ({
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
    color: '#ffffff',
    fontWeight: 600,
    padding: '10px 24px',
    borderRadius: 8,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(1, 50, 101, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #014A94 0%, #0B2A4A 100%)',
      boxShadow: '0 6px 20px rgba(1, 50, 101, 0.4)',
    },
  }),
  ...(variant === 'outlined' && {
    color: '#013265',
    borderColor: '#013265',
    fontWeight: 600,
    padding: '10px 24px',
    borderRadius: 8,
    textTransform: 'none',
    border: '2px solid #013265',
    '&:hover': {
      backgroundColor: '#CEE5FD',
      borderColor: '#F4C000',
      color: '#F4C000',
    },
  }),
}));
