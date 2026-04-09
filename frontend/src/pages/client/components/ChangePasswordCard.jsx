import React from 'react';
import {
  Card,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '&.Mui-focused fieldset': { borderColor: '#013265' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#013265' },
};

export default function ChangePasswordCard({
  passwordData,
  editMode,
  error,
  success,
  onChange,
  onEdit,
  onSubmit,
  onCancel,
}) {
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: '12px',
        border: '1px solid #CEE5FD',
        boxShadow: '0 2px 12px rgba(1,50,101,0.08)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left accent panel */}
        <Box
          sx={{
            width: { xs: '100%', md: 220 },
            minWidth: { md: 220 },
            bgcolor: '#F0F7FF',
            borderRight: { md: '1px solid #CEE5FD' },
            borderBottom: { xs: '1px solid #CEE5FD', md: 'none' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            px: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#013265',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <Typography sx={{ color: 'white', fontSize: 24 }}>🔒</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#013265', textAlign: 'center' }}>
            Bảo mật
          </Typography>
          <Typography variant="caption" sx={{ color: '#5B6B7C', textAlign: 'center', mt: 0.5 }}>
            Cập nhật mật khẩu định kỳ để bảo vệ tài khoản
          </Typography>
        </Box>

        {/* Right: Password form */}
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#013265', mb: 2 }}>
            Đổi mật khẩu
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="password" label="Mật khẩu hiện tại" name="oldPassword"
                value={passwordData.oldPassword} onChange={onChange}
                disabled={!editMode} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="password" label="Mật khẩu mới" name="newPassword"
                value={passwordData.newPassword} onChange={onChange}
                disabled={!editMode} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="password" label="Xác nhận mật khẩu mới" name="confirmPassword"
                value={passwordData.confirmPassword} onChange={onChange}
                disabled={!editMode} sx={inputSx} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            {editMode && (
              <Button
                variant="outlined"
                onClick={onCancel}
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: '10px',
                  borderColor: '#013265',
                  color: '#013265',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#014A94', bgcolor: '#F0F7FF' },
                }}
              >
                Huỷ
              </Button>
            )}
            {editMode ? (
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  bgcolor: '#013265',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#014A94', transform: 'translateY(-2px)' },
                }}
              >
                Lưu thay đổi
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                onClick={onEdit}
                startIcon={<LockResetIcon />}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  bgcolor: '#013265',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#014A94', transform: 'translateY(-2px)' },
                }}
              >
                Đổi mật khẩu
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
