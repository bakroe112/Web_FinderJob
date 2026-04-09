import * as React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import RecommendIcon from '@mui/icons-material/Recommend';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { axiosClient } from '../../../config/AxiosClient';
import { colors } from '../../../theme/colors';

export default function ResumeAnalysis() {
  const { user } = useSelector((state) => state.user);

  const [file, setFile] = React.useState(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);

  const fileInputRef = React.useRef(null);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  console.log("result", result);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Chỉ hỗ trợ file PDF, DOC, DOCX');
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Kích thước file không vượt quá 10MB');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleFileSelect = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!file || !user?.id) return;

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('candidate_id', user.id);

      const response = await axiosClient.post(
        '/applications/upload-resume-for-analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message || 'Phân tích thất bại');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi phân tích CV');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return colors.status.success;
    if (score >= 50) return colors.status.warning;
    return colors.status.error;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Tốt';
    if (score >= 50) return 'Trung bình';
    return 'Cần cải thiện';
  };

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '1.8rem' },
            }}
          >
            <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle', color: colors.primary.dark }} />
            Đánh giá CV
          </Typography>
          <Typography sx={{ color: colors.text.secondary, fontSize: '14px' }}>
            Upload CV của bạn để AI phân tích và đánh giá chất lượng hồ sơ
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column - Upload */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Upload Zone */}
            <Card
              sx={{
                borderRadius: 3,
                border: `2px dashed ${dragActive ? colors.primary.dark : colors.primary.light}`,
                backgroundColor: dragActive ? '#f0f7ff' : '#fff',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                mb: 3,
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 5,
                  px: 3,
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                {!file ? (
                  <>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        backgroundColor: colors.primary.lighter,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <CloudUploadIcon
                        sx={{ fontSize: 36, color: colors.primary.dark }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary,
                        mb: 0.5,
                        fontSize: '16px',
                      }}
                    >
                      Kéo thả hoặc nhấn để chọn file CV
                    </Typography>
                    <Typography sx={{ color: colors.text.secondary, fontSize: '13px' }}>
                      Hỗ trợ: PDF, DOC, DOCX — Tối đa 10MB
                    </Typography>
                  </>
                ) : (
                  <Box sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#f0f7ff',
                        border: `1px solid ${colors.primary.light}`,
                      }}
                    >
                      <InsertDriveFileIcon
                        sx={{ fontSize: 40, color: colors.primary.dark }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: colors.text.primary,
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography sx={{ color: colors.text.secondary, fontSize: '12px' }}>
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Analyze Button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!file || uploading}
              onClick={handleAnalyze}
              startIcon={
                uploading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AnalyticsIcon />
                )
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: colors.gradients.primaryButton,
                fontWeight: 600,
                fontSize: '15px',
                textTransform: 'none',
                '&:hover': {
                  background: colors.gradients.primaryButtonHover,
                },
                '&:disabled': {
                  background: '#ccc',
                  color: '#fff',
                },
              }}
            >
              {uploading ? 'Đang phân tích...' : 'Phân tích CV'}
            </Button>

            {/* Loading Progress */}
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  sx={{
                    borderRadius: 2,
                    height: 6,
                    backgroundColor: colors.primary.light,
                    '& .MuiLinearProgress-bar': {
                      background: colors.gradients.primaryButton,
                    },
                  }}
                />
                <Typography
                  sx={{
                    mt: 1,
                    textAlign: 'center',
                    color: colors.text.secondary,
                    fontSize: '13px',
                  }}
                >
                  AI đang phân tích hồ sơ của bạn, vui lòng chờ...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right Column - Results */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {!result && !uploading && (
              <Card
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${colors.primary.light}`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <DescriptionIcon
                    sx={{ fontSize: 64, color: colors.primary.light, mb: 2 }}
                  />
                  <Typography
                    sx={{
                      color: colors.text.secondary,
                      fontSize: '15px',
                      fontWeight: 500,
                    }}
                  >
                    Upload CV và nhấn "Phân tích" để xem kết quả
                  </Typography>
                </CardContent>
              </Card>
            )}

            {result && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 1. Resume Score */}
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.primary.light}`,
                    overflow: 'visible',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: colors.text.primary,
                        fontSize: '16px',
                        mb: 2,
                      }}
                    >
                      📊 Điểm đánh giá tổng thể
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={100}
                          thickness={5}
                          sx={{ color: '#e0e0e0' }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={Math.min(result.resume_score, 100)}
                          size={100}
                          thickness={5}
                          sx={{
                            color: getScoreColor(result.resume_score),
                            position: 'absolute',
                            left: 0,
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: '24px',
                              color: getScoreColor(result.resume_score),
                              lineHeight: 1,
                            }}
                          >
                            {result.resume_score}
                          </Typography>
                          <Typography sx={{ fontSize: '11px', color: colors.text.secondary }}>
                            /100
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Chip
                          label={getScoreLabel(result.resume_score)}
                          size="small"
                          sx={{
                            backgroundColor: getScoreColor(result.resume_score) + '18',
                            color: getScoreColor(result.resume_score),
                            fontWeight: 600,
                            mb: 1,
                          }}
                        />
                        <Typography sx={{ color: colors.text.secondary, fontSize: '13px' }}>
                          Dựa trên cấu trúc và nội dung CV của bạn
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* 2. Basic Info */}
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${colors.primary.light}`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: colors.text.primary,
                        fontSize: '16px',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PersonIcon sx={{ color: colors.primary.dark }} />
                      Thông tin cơ bản
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: colors.text.secondary, fontWeight: 600 }}>
                          Họ tên
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: colors.text.primary }}>
                          {result.parsed_data?.name || 'Không tìm thấy'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: colors.text.secondary, fontWeight: 600 }}>
                          Email
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: colors.text.primary }}>
                          {result.parsed_data?.email || 'Không tìm thấy'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: colors.text.secondary, fontWeight: 600 }}>
                          Số điện thoại
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: colors.text.primary }}>
                          {result.parsed_data?.mobile_number || 'Không tìm thấy'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: colors.text.secondary, fontWeight: 600 }}>
                          Số trang CV
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: colors.text.primary }}>
                          {result.parsed_data?.no_of_pages || 'N/A'} trang
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* 3. Education */}
                {result.parsed_data?.education && result.parsed_data.education.length > 0 && (
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${colors.primary.light}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          fontSize: '16px',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <SchoolIcon sx={{ color: colors.primary.dark }} />
                        Trình độ học vấn
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {result.parsed_data.education.map((edu, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: colors.primary.lighter,
                              border: `1px solid ${colors.primary.light}`,
                            }}
                          >
                            <Typography sx={{ fontSize: '14px', color: colors.text.primary, fontWeight: 500 }}>
                              {Array.isArray(edu) ? `${edu[0]} (${edu[1]})` : edu}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* 4. Current Skills */}
                {result.parsed_data?.skills && result.parsed_data.skills.length > 0 && (
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${colors.primary.light}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          fontSize: '16px',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <BuildIcon sx={{ color: colors.primary.dark }} />
                        Kỹ năng hiện tại của bạn
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {result.parsed_data.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            sx={{
                              backgroundColor: colors.primary.lighter,
                              color: colors.primary.dark,
                              fontWeight: 500,
                              fontSize: '12px',
                              border: `1px solid ${colors.primary.light}`,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* 5. Recommended Skills */}
                {result.recommended_skills && result.recommended_skills.length > 0 && (
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${colors.status.success}30`,
                      backgroundColor: '#F6FFF6',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          fontSize: '16px',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <RecommendIcon sx={{ color: colors.status.success }} />
                        Kỹ năng đề xuất cho bạn
                      </Typography>

                      {result.reco_field && (
                        <Typography sx={{ fontSize: '13px', color: colors.status.success, fontWeight: 600, mb: 2 }}>
                          Phân tích cho thấy bạn đang hướng tới lĩnh vực: {result.reco_field}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {result.recommended_skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            sx={{
                              backgroundColor: '#E8F5E9',
                              color: colors.status.success,
                              fontWeight: 500,
                              fontSize: '12px',
                              border: `1px solid #C8E6C9`,
                            }}
                          />
                        ))}
                      </Box>

                      <Typography sx={{ fontSize: '12px', color: colors.status.success, mt: 1.5, fontStyle: 'italic' }}>
                        Thêm các kỹ năng này vào CV sẽ tăng cơ hội được tuyển dụng 🚀
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* 6. Resume Tips & Ideas */}
                {result.tips && result.tips.length > 0 && (
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${colors.accent.light}`,
                      backgroundColor: '#FFFEF5',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          fontSize: '16px',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <TipsAndUpdatesIcon sx={{ color: colors.accent.main }} />
                        Resume Tips & Ideas
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {result.tips.map((tip, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: tip.found ? '#E8F5E9' : '#FFF3E0',
                              border: `1px solid ${tip.found ? '#C8E6C9' : '#FFE0B2'}`,
                            }}
                          >
                            {tip.found ? (
                              <CheckCircleIcon
                                sx={{ fontSize: 20, color: colors.status.success, mt: 0.2 }}
                              />
                            ) : (
                              <CancelIcon
                                sx={{ fontSize: 20, color: '#E65100', mt: 0.2 }}
                              />
                            )}
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: tip.found ? colors.status.success : '#E65100',
                                fontWeight: 500,
                              }}
                            >
                              {tip.message}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* 7. Recommended Courses */}
                {result.recommended_courses && result.recommended_courses.length > 0 && (
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${colors.primary.light}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          fontSize: '16px',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <MenuBookIcon sx={{ color: colors.primary.dark }} />
                        Đề xuất khóa học & tín chỉ
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {result.recommended_courses.map((course, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: colors.primary.lighter,
                              border: `1px solid ${colors.primary.light}`,
                              '&:hover': {
                                backgroundColor: '#e3f0ff',
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                color: colors.text.secondary,
                                fontWeight: 600,
                                minWidth: 24,
                              }}
                            >
                              {index + 1}.
                            </Typography>
                            <Link
                              href={course[1]}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                fontSize: '14px',
                                color: colors.primary.dark,
                                fontWeight: 500,
                              }}
                            >
                              {course[0]}
                            </Link>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Re-analyze button */}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleRemoveFile}
                  sx={{
                    borderColor: colors.primary.dark,
                    color: colors.primary.dark,
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: colors.primary.darkest,
                      backgroundColor: colors.primary.lighter,
                    },
                  }}
                >
                  Phân tích CV khác
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
