import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { colors } from '../../../../theme/colors';

export default function ProfileCard({
  user,
  formData,
  avatarUploading,
  avatarError,
  avatarSuccess,
  onAvatarChange,
}) {
  const fileInputRef = React.useRef(null);

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: colors.shadow.navy,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: colors.shadow.navyStrong,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        {avatarError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderColor: colors.primary.light,
              backgroundColor: colors.primary.lighter,
              '& .MuiAlert-icon': {
                color: colors.primary.dark,
              },
              '& .MuiAlert-message': {
                color: colors.primary.darkest,
              },
            }}
          >
            {avatarError}
          </Alert>
        )}
        {avatarSuccess && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderColor: colors.accent.light,
              backgroundColor: colors.accent.light,
              '& .MuiAlert-icon': {
                color: colors.accent.main,
              },
              '& .MuiAlert-message': {
                color: colors.primary.darkest,
              },
            }}
          >
            {avatarSuccess}
          </Alert>
        )}

        <Box sx={{ position: 'relative', mb: 2, display: 'inline-block' }}>
          <Avatar
            src={formData.avatar_url}
            sx={{
              width: 120,
              height: 120,
              border: `3px solid ${colors.primary.dark}`,
              boxShadow: colors.shadow.navyMedium,
            }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              minWidth: 'auto',
              p: 0.5,
              bgcolor: colors.accent.main,
              color: 'white',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: colors.accent.dark,
              },
            }}
          >
            {avatarUploading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              <CameraAltIcon />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={onAvatarChange}
            accept="image/*"
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: colors.primary.darkest,
            mb: 0.5,
          }}
        >
          {formData.full_name || user?.name || 'Chưa cập nhật'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.primary.dark,
          }}
        >
          {user?.email}
        </Typography>
      </CardContent>
    </Card>
  );
}
