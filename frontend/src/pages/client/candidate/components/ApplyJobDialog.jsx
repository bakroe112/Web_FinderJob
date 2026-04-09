import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../../theme/colors';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { applyJob } from '../../../../store/applications/action';
import { axiosClient } from '../../../../config/AxiosClient';

export default function ApplyJobDialog({
  open,
  onClose,
  jobDetail,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [coverLetter, setCoverLetter] = React.useState('');
  const [resumeFile, setResumeFile] = React.useState(null);
  const [resumeFileName, setResumeFileName] = React.useState('');
  const [applyLoading, setApplyLoading] = React.useState(false);
  const [applyError, setApplyError] = React.useState('');

  const handleClose = () => {
    setCoverLetter('');
    setResumeFile(null);
    setResumeFileName('');
    setApplyError('');
    onClose();
  };

  const handleApply = async () => {
    if (!user?.id) {
      return;
    }

    if (applyLoading) {
      return;
    }

    setApplyLoading(true);
    setApplyError('');

    try {
      let resumeUrl = null;

      // Upload file CV nếu có
      if (resumeFile) {
        console.log('Bắt đầu upload CV:', resumeFile.name);
        const uploadFormData = new FormData();
        uploadFormData.append('resume', resumeFile);
        uploadFormData.append('user_id', user.id);

        try {
          const uploadResponse = await axiosClient.post('/applications/upload-resume', uploadFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (uploadResponse.data.success) {
            console.log('Upload CV thành công');
            resumeUrl = uploadResponse.data.data.resume_url;
          } else {
            console.log('Upload CV thất bại:', uploadResponse.data.message);
            setApplyError('Lỗi upload CV: ' + uploadResponse.data.message);
            setApplyLoading(false);
            return;
          }
        } catch (uploadErr) {
          console.log(' Upload CV lỗi:', uploadErr.message);
          setApplyError('Lỗi upload CV: ' + (uploadErr.response?.data?.message || uploadErr.message));
          setApplyLoading(false);
          return;
        }
      }

      // Gửi ứng tuyển
      console.log('Gửi ứng tuyển với resume_url:', resumeUrl);
      const result = await dispatch(
        applyJob({
          user_id: user.id,
          job_id: jobDetail?.id,
          introduction: coverLetter,
          resume_url: resumeUrl,
        })
      );

      setApplyLoading(false);

      if (result.success) {
        console.log('Ứng tuyển thành công');
        handleClose();
      } else {
        console.log('Ứng tuyển thất bại:', result.message);
        setApplyError(result.message);
      }
    } catch (error) {
      setApplyLoading(false);
      setApplyError('Lỗi: ' + error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: colors.shadow.navyStrong,
          backdropFilter: 'blur(4px)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: colors.gradients.primaryButton,
          color: colors.neutral.white,
          fontWeight: 700,
          fontSize: '1.4rem',
          pb: 2.5,
          pt: 2.5,
          textAlign: 'center',
        }}
      >
        Ứng tuyển - {jobDetail?.title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3.5, pb: 3, pr: 3 }}>
        {applyError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 1.5,
              border: `1px solid ${colors.status.error}`,
              backgroundColor: `${colors.status.error}15`,
            }}
          >
            {applyError}
          </Alert>
        )}

        {/* Info Text */}
        <Box
          sx={{
            backgroundColor: colors.primary.lighter,
            borderRadius: 1.5,
            p: 2,
            mb: 3,
            borderLeft: `4px solid ${colors.primary.dark}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.text.primary,
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            Nhập thư giới thiệu và tải lên CV để tăng cơ hội được nhà tuyển dụng chú ý
          </Typography>
        </Box>

        {/* Cover Letter */}
        <Typography
          variant="subtitle2"
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 1,
            fontSize: '0.95rem',
          }}
        >
          Thư giới thiệu <span style={{ color: colors.text.light }}>(tùy chọn)</span>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Giới thiệu ngắn gọn về bản thân, kinh nghiệm và lý do bạn phù hợp với vị trí này..."
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              backgroundColor: colors.neutral.background,
              transition: 'all 0.3s ease',
              borderColor: colors.neutral.border,
              '&:hover': {
                borderColor: colors.primary.dark,
                boxShadow: `0 2px 8px ${colors.shadow.navy}`,
              },
              '&.Mui-focused': {
                borderColor: colors.primary.dark,
                boxShadow: `0 4px 16px ${colors.shadow.navyMedium}`,
              },
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: colors.text.light,
              opacity: 0.7,
            },
          }}
        />

        {/* File Upload Label */}
        <Typography
          variant="subtitle2"
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 1.5,
            fontSize: '0.95rem',
          }}
        >
          Tải lên CV <span style={{ color: colors.status.error }}>*</span>
        </Typography>

        {/* File Upload */}
        <Box
          sx={{
            border: `2px dashed ${colors.primary.dark}`,
            borderRadius: 2,
            p: 2.5,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: colors.primary.lighter,
            minHeight: 140,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
              borderColor: colors.primary.darkest,
              backgroundColor: colors.primary.light,
            },
            mb: 2,
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setResumeFile(e.target.files[0]);
                setResumeFileName(e.target.files[0].name);
              }
            }}
            onClick={(e) => {
              e.currentTarget.value = '';
            }}
          />
          <AttachFileIcon
            sx={{
              fontSize: 50,
              color: colors.primary.dark,
              mb: 1.5,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              mb: 0.8,
              fontWeight: 600,
              color: colors.text.primary,
              fontSize: '0.95rem',
              wordBreak: 'break-word',
            }}
          >
            {resumeFileName || '📎 Kéo thả hoặc bấm để chọn'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: colors.text.light,
              fontWeight: 500,
              fontSize: '0.8rem',
            }}
          >
            PDF, DOC, DOCX, XLS, XLSX · Tối đa 10MB
          </Typography>
        </Box>

        {resumeFileName && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: `${colors.status.success}15`,
              borderLeft: `4px solid ${colors.status.success}`,
              borderRadius: 1.5,
              animation: 'slideIn 0.3s ease',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateX(-10px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors.status.success,
                fontWeight: 600,
              }}
            >
              File đã chọn: <strong>{resumeFileName}</strong>
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: 2.5,
          gap: 1,
          borderTop: `2px solid ${colors.neutral.border}`,
          backgroundColor: colors.neutral.background,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleClose}
          disabled={applyLoading}
          sx={{
            color: colors.text.secondary,
            fontWeight: 600,
            transition: 'all 0.3s ease',
            borderRadius: 1.5,
            '&:hover': {
              backgroundColor: colors.neutral.background,
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={applyLoading || !resumeFile}
          sx={{
            background: applyLoading || !resumeFile
              ? colors.text.light
              : colors.gradients.primaryButton,
            minWidth: 160,
            fontWeight: 600,
            borderRadius: 1.5,
            transition: 'all 0.3s ease',
            color: colors.neutral.white,
            '&:hover:not(:disabled)': {
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 24px ${colors.shadow.navyStrong}`,
            },
            '&:disabled': {
              transform: 'none',
              opacity: 0.6,
            },
            fontSize: '1rem',
          }}
        >
          {applyLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Đang gửi...</span>
            </Box>
          ) : (
            "Gửi ứng tuyển"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
