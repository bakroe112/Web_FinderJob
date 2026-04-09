import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../../theme/colors';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { JobCard, StyledButton } from './JobSearchStyles';

export default function JobCardComponent({
  job,
  isSaved,
  onToggleSaved,
}) {
  const navigate = useNavigate();

  return (
    <JobCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${colors.primary.light}`,
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with Company Logo and Save Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
            <Avatar
              src={job.logo_url}
              alt={job.company_name}
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,
                border: `2px solid ${colors.primary.light}`,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: colors.primary.dark,
                  mb: 0.3,
                }}
              >
                {job.company_name}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => onToggleSaved(job.id)}
            sx={{
              flexShrink: 0,
              color: isSaved ? colors.accent.main : colors.text.secondary,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: colors.accent.main,
                transform: 'scale(1.1)',
              },
            }}
          >
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        {/* Job Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            color: colors.primary.darkest,
            mb: 2,
            lineHeight: 1.4,
            minHeight: '2.8em',
          }}
        >
          {job.title}
        </Typography>

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: colors.primary.light, mb: 2.5 }} />

        {/* Location */}
        {job.work_location && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: colors.primary.darkest, fontWeight: 500 }}>
              {job.work_location}
            </Typography>
          </Box>
        )}

        {/* Salary */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AttachMoneyIcon sx={{ fontSize: 18, color: colors.accent.main, flexShrink: 0 }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: colors.accent.main,
            }}
          >
            {job.salary_min && job.salary_max
              ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} VNĐ`
              : 'Thỏa thuận'}
          </Typography>
        </Box>

        {/* Job Type and Experience */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {job.job_type && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: colors.primary.darkest,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <WorkIcon sx={{ fontSize: 18, color: colors.accent.main }} />
              {job.job_type}
            </Typography>
          )}
          {job.experience && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: colors.primary.darkest,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <SchoolIcon sx={{ fontSize: 18, color: colors.accent.main }} />
              {job.experience} năm KN
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, gap: 1, display: 'flex' }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/candidate/jobs/${job.id}`)}
          sx={{
            flex: 1,
            borderColor: colors.primary.dark,
            color: colors.primary.dark,
            fontWeight: 700,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: colors.primary.darkest,
              backgroundColor: colors.primary.lighter,
              transform: 'translateY(-2px)',
            },
          }}
        >
          Xem chi tiết
        </Button>
        <StyledButton
          variant="contained"
          onClick={() => navigate(`/candidate/jobs/${job.id}?apply=true`)}
          sx={{ flex: 1 }}
        >
          Ứng tuyển
        </StyledButton>
      </CardActions>
    </JobCard>
  );
}
