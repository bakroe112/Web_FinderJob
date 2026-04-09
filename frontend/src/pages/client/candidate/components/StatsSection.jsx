import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function StatsSection({ stats }) {
  const items = [
    {
      label: 'Đã ứng tuyển',
      value: stats.totalApplications,
      icon: <AssignmentIcon />,
      color: '#077BF1',
      bg: '#EBF5FF',
    },
    {
      label: 'Chờ duyệt',
      value: stats.pendingApplications,
      icon: <HourglassBottomIcon />,
      color: '#D4950C',
      bg: '#FFF8E1',
    },
    {
      label: 'Được nhận',
      value: stats.acceptedApplications,
      icon: <CheckCircleOutlineIcon />,
      color: '#1F7A1F',
      bg: '#E8F5E9',
    },
    {
      label: 'Từ chối',
      value: stats.rejectedApplications,
      icon: <HighlightOffIcon />,
      color: '#D32F2F',
      bg: '#FFEBEE',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 3,
        border: '1px solid #CEE5FD',
        boxShadow: '0 2px 12px rgba(1, 50, 101, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
          px: 2.5,
          py: 2,
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          Hồ sơ ứng tuyển
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', mt: 0.3 }}>
          Tình trạng đơn của bạn
        </Typography>
      </Box>

      {/* Stats rows */}
      <Box sx={{ px: 2, py: 1 }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                px: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    backgroundColor: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </Box>
                <Typography sx={{ fontSize: '13.5px', fontWeight: 500, color: '#3D4F5F' }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '18px',
                  color: item.color,
                  minWidth: 28,
                  textAlign: 'right',
                }}
              >
                {item.value}
              </Typography>
            </Box>
            {index < items.length - 1 && (
              <Divider sx={{ borderColor: '#F0F4F8' }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
