import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import WorkIcon from '@mui/icons-material/Work';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" component={RouterLink} to="/">
        JobHub
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
        color: '#ffffff',
        py: { xs: 10, sm: 12 },
        mt: { xs: 6, sm: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            justifyContent: 'space-between',
            gap: { xs: 6, sm: 8 },
            mb: 6,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              minWidth: { xs: '100%', sm: '35%' },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#F4C000',
                    borderRadius: 1,
                    p: 1,
                    display: 'flex',
                  }}
                >
                  <WorkIcon sx={{ color: '#013265', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#ffffff' }}>
                  JobHub
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Nền tảng tuyển dụng hàng đầu Việt Nam. Kết nối ứng viên với nhà tuyển dụng 
                một cách nhanh chóng và hiệu quả.
              </Typography>
              <Stack
                direction="row"
                spacing={1.5}
                useFlexGap
                sx={{ justifyContent: 'left' }}
              >
                <IconButton
                  color="inherit"
                  size="medium"
                  href="https://github.com"
                  aria-label="GitHub"
                  sx={{
                    color: '#F4C000',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 192, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="medium"
                  href="https://twitter.com"
                  aria-label="X"
                  sx={{
                    color: '#F4C000',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 192, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="medium"
                  href="https://www.linkedin.com"
                  aria-label="LinkedIn"
                  sx={{
                    color: '#F4C000',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 192, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'grid', sm: 'flex' },
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto' },
              gap: { xs: 4, sm: 4 },
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: '#F4C000',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Dành cho ứng viên
              </Typography>
              <Link 
                color="inherit" 
                variant="body2" 
                component={RouterLink} 
                to="/candidate/jobs"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Tìm việc làm
              </Link>
              <Link 
                color="inherit" 
                variant="body2" 
                component={RouterLink} 
                to="/candidate/applications"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Việc đã ứng tuyển
              </Link>
              <Link 
                color="inherit" 
                variant="body2" 
                component={RouterLink} 
                to="/candidate/saved-jobs"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Việc đã lưu
              </Link>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: '#F4C000',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Dành cho nhà tuyển dụng
              </Typography>
              <Link 
                color="inherit" 
                variant="body2" 
                component={RouterLink} 
                to="/recruiter/jobs"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Đăng tin tuyển dụng
              </Link>
              <Link 
                color="inherit" 
                variant="body2" 
                component={RouterLink} 
                to="/recruiter/applications"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Quản lý ứng viên
              </Link>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: '#F4C000',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Hỗ trợ
              </Typography>
              <Link 
                color="inherit" 
                variant="body2" 
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Liên hệ
              </Link>
              <Link 
                color="inherit" 
                variant="body2" 
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                FAQ
              </Link>
              <Link 
                color="inherit" 
                variant="body2" 
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#F4C000',
                    paddingLeft: 1,
                  },
                }}
              >
                Điều khoản sử dụng
              </Link>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Link 
              color="inherit" 
              variant="body2" 
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.75)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#F4C000',
                },
              }}
            >
              Chính sách bảo mật
            </Link>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              •
            </Typography>
            <Link 
              color="inherit" 
              variant="body2" 
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.75)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#F4C000',
                },
              }}
            >
              Điều khoản dịch vụ
            </Link>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.75)' }}>
            {' '}
            <Link 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{
                color: '#F4C000',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              JobHub
            </Link>
            &nbsp;{new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
