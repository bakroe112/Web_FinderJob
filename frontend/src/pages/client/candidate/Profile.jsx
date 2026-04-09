import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { axiosClient } from '../../../config/AxiosClient';
import { changePassword } from '../../../store/user/action';
import { colors } from '../../../theme/colors';
import PersonalInfoCard from './components/PersonalInfoCard';
import SkillsCard from './components/SkillsCard';
import ChangePasswordCard from './components/ChangePasswordCard';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState('');
  const [avatarSuccess, setAvatarSuccess] = React.useState('');
  const [editMode, setEditMode] = React.useState(false);
  const [passwordEditMode, setPasswordEditMode] = React.useState(false);

  const [formData, setFormData] = React.useState({
    full_name: '',
    phone: '',
    location: '',
    job_title: '',
    summary: '',
    experience: '',
    avatar_url: '',
  });

  const [passwordData, setPasswordData] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [allSkills, setAllSkills] = React.useState([]);
  const [userSkills, setUserSkills] = React.useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = React.useState([]);
  const [skillAccordionOpen, setSkillAccordionOpen] = React.useState(false);

  const [passwordError, setPasswordError] = React.useState('');
  const [passwordSuccess, setPasswordSuccess] = React.useState('');

  // Fetch candidate profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError('');
        
        const response = await axiosClient.post('/candidates/get', {
          user_id: user.id,
        });

        if (response.data.success && response.data.data) {
          setFormData({
            full_name: response.data.data.full_name || '',
            phone: response.data.data.phone || '',
            location: response.data.data.location || '',
            job_title: response.data.data.job_title || '',
            summary: response.data.data.summary || '',
            experience: response.data.data.experience || '',
            avatar_url: response.data.data.avatar_url || '',
          });
        } else {
          setError(response.data.message || 'Không thể lấy thông tin');
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
        setError(err.response?.data?.message || 'Lấy thông tin thất bại');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Fetch all skills and user skills
  React.useEffect(() => {
    const fetchSkills = async () => {
      if (!user?.id) return;

      try {
        // Get all available skills
        const allSkillsResponse = await axiosClient.get('/skills/list');
        if (allSkillsResponse.data.success) {
          setAllSkills(allSkillsResponse.data.data || []);
        }

        // Get user's current skills
        const userSkillsResponse = await axiosClient.post('/skills/user', {
          user_id: user.id,
        });
        if (userSkillsResponse.data.success) {
          setUserSkills(userSkillsResponse.data.data || []);
        }
      } catch (err) {
        console.error('Fetch skills error:', err);
      }
    };

    fetchSkills();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkills = async () => {
    if (selectedSkillIds.length === 0) return;

    try {
      const currentSkillIds = userSkills.map(s => s.id);
      const newSkillIds = Array.from(new Set([...currentSkillIds, ...selectedSkillIds]));

      const response = await axiosClient.post('/skills/update', {
        user_id: user.id,
        skill_ids: newSkillIds,
      });

      if (response.data.success) {
        // Fetch updated skills
        const userSkillsResponse = await axiosClient.post('/skills/user', {
          user_id: user.id,
        });
        if (userSkillsResponse.data.success) {
          setUserSkills(userSkillsResponse.data.data || []);
          setSelectedSkillIds([]);
        }
      }
    } catch (err) {
      console.error('Lỗi thêm kỹ năng:', err);
    }
  };

  const handleToggleSkill = (skillId) => {
    setSelectedSkillIds((prev) => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      const newSkillIds = userSkills.map(s => s.id).filter(id => id !== skillId);

      const response = await axiosClient.post('/skills/update', {
        user_id: user.id,
        skill_ids: newSkillIds,
      });

      if (response.data.success) {
        setUserSkills(userSkills.filter(s => s.id !== skillId));
      }
    } catch (err) {
      console.error('Lỗi xóa kỹ năng:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If not in edit mode, toggle to edit mode
    if (!editMode) {
      setEditMode(true);
      return;
    }

    // Submit form and exit edit mode
    setError('');
    setSuccess('');

    try {
      const response = await axiosClient.post('/candidates/update', {
        user_id: user.id,
        ...formData,
      });

      if (response.data.success) {
        setSuccess('Cập nhật thông tin thành công');
        setEditMode(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // If not in edit mode, toggle to edit mode
    if (!passwordEditMode) {
      setPasswordEditMode(true);
      return;
    }

    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    const result = await dispatch(
      changePassword(user.id, passwordData.oldPassword, passwordData.newPassword)
    );

    if (result.success) {
      setPasswordSuccess('Đổi mật khẩu thành công');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordEditMode(false);
    } else {
      setPasswordError(result.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setAvatarUploading(true);
      setAvatarError('');
      setAvatarSuccess('');

      // Create FormData to send file to backend
      const uploadFormData = new FormData();
      uploadFormData.append('avatar', file);
      uploadFormData.append('user_id', user.id);
      uploadFormData.append('user_role', 'candidate');

      // Upload via backend
      const response = await axiosClient.post('/users/upload-avatar', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setAvatarSuccess('Cập nhật ảnh đại diện thành công');
        // Reload to update avatar
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setAvatarError('Cập nhật ảnh thất bại: ' + response.data.message);
      }
    } catch (err) {
      setAvatarError('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
            color: colors.primary.darkest,
            mb: 1,
          }}
        >
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary, fontSize: '0.95rem', fontWeight: 400 }}>
          Quản lý thông tin cá nhân, kỹ năng và bảo mật tài khoản
        </Typography>
      </Box>

      {/* Personal Information Card */}
      <PersonalInfoCard
        user={user}
        formData={formData}
        editMode={editMode}
        error={error}
        success={success}
        onChange={handleChange}
        onEdit={() => setEditMode(true)}
        onSave={handleSubmit}
        onCancel={() => {
          setEditMode(false);
          setError('');
          setSuccess('');
        }}
        avatarUploading={avatarUploading}
        avatarError={avatarError}
        avatarSuccess={avatarSuccess}
        onAvatarChange={handleAvatarUpload}
      />

      {/* Skills Card */}
      <SkillsCard
        userSkills={userSkills}
        allSkills={allSkills}
        selectedSkillIds={selectedSkillIds}
        accordionOpen={skillAccordionOpen}
        onToggleSkill={handleToggleSkill}
        onAddSkills={handleAddSkills}
        onRemoveSkill={handleRemoveSkill}
        onAccordionOpen={setSkillAccordionOpen}
      />

      {/* Change Password Card */}
      <ChangePasswordCard
        passwordData={passwordData}
        editMode={passwordEditMode}
        error={passwordError}
        success={passwordSuccess}
        onChange={handlePasswordChange}
        onEdit={() => setPasswordEditMode(true)}
        onSubmit={handlePasswordSubmit}
        onCancel={() => {
          setPasswordEditMode(false);
          setPasswordError('');
          setPasswordSuccess('');
        }}
      />
    </Container>
  );
}
