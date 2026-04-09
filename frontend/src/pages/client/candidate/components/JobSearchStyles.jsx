import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { colors } from '../../../../theme/colors';

export const SearchCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #E8F0FF',
  boxShadow: '0 4px 20px rgba(1, 50, 101, 0.08)',
  borderRadius: 12,
  backdropFilter: 'blur(10px)',
}));

export const JobCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.neutral.white,
  border: `2px solid ${colors.primary.lighter}`,
  boxShadow: colors.shadow.navy,
  borderRadius: 16,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: colors.gradients.primaryButton,
  },
  '&:hover': {
    boxShadow: colors.shadow.navyStrong,
    transform: 'translateY(-6px)',
    borderColor: colors.accent.dark,
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  background: colors.gradients.primaryButton,
  color: colors.neutral.white,
  fontWeight: 700,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: colors.gradients.primaryButtonHover,
    boxShadow: colors.shadow.navyMedium,
    transform: 'translateY(-2px)',
  },
}));
