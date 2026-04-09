import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import {
  createJob,
  updateJob,
  getRecruiterJobDetail,
  getJobFields,
} from "../../../store/jobs/action";
import { StyledButton } from "./components";
import { axiosClient } from "../../../config/AxiosClient";

export default function CreateJob() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = React.useState({
    title: "",
    job_description: "",
    requirements: "",
    interest: "",
    work_location: "",
    job_type: "Full time",
    workplace_type: "On-site",
    working_time: "",
    experience: "",
    salary: "",
    vacancy_count: "",
    deadline: "",
    job_status: "Open",
    field_id: "",
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [fetchLoading, setFetchLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [jobFields, setJobFields] = React.useState([]);
  const [allSkills, setAllSkills] = React.useState([]);
  const [currentJobSkills, setCurrentJobSkills] = React.useState([]); // Skills hiện tại từ DB
  const [jobSkills, setJobSkills] = React.useState([]); // Skills được chọn
  const [skillInput, setSkillInput] = React.useState("");
  console.log("skillInput", skillInput);
  // Fetch job fields on component mount
  React.useEffect(() => {
    dispatch(getJobFields()).then((result) => {
      if (result.success) {
        setJobFields(result.data);
      }
    });
  }, [dispatch]);

  // Fetch all available skills
  const fetchSkills = async () => {
    try {
      const allSkillsResponse = await axiosClient.get("/skills/list");
      if (allSkillsResponse.data.success) {
        setAllSkills(allSkillsResponse.data.data || []);
      }
    } catch (err) {
      console.error("Fetch all skills error:", err);
    }
  };

  // Fetch job current skills (on edit mode)
  const fetchJobSkills = async (jobId) => {
    try {
      const jobSkillsResponse = await axiosClient.post("/skills/job", {
        job_id: jobId,
      });
      if (jobSkillsResponse.data.success) {
        const skillsData = jobSkillsResponse.data.data || [];
        setCurrentJobSkills(skillsData); // Lưu skills hiện tại
        setJobSkills(skillsData); // Set skills để display
      }
    } catch (err) {
      console.error("Fetch job skills error:", err);
    }
  };

  // Fetch skills on component mount
  React.useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch job data for edit mode
  React.useEffect(() => {
    if (isEditMode) {
      setFetchLoading(true);
      dispatch(getRecruiterJobDetail(id)).then((result) => {
        setFetchLoading(false);
        if (result.success && result.data) {
          const job = result.data;

          setFormData({
            title: job.title || "",
            job_description: job.job_description || "",
            requirements: job.requirements || "",
            interest: job.interest || "",
            work_location: job.work_location || "",
            job_type: job.job_type || "Full time",
            workplace_type: job.workplace_type || "On-site",
            working_time: job.working_time || "Full-time",
            experience: job.experience || "",
            salary: job.salary || "",
            vacancy_count: job.vacancy_count || "",
            deadline: job.deadline ? job.deadline.split("T")[0] : "",
            job_status: job.job_status || "Open",
            field_id: job.field_id || "",
          });

          // Fetch skills for this job
          fetchJobSkills(id);
        }
      });
    }
  }, [dispatch, id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }
    if (!formData.job_description.trim()) {
      newErrors.job_description = "Vui lòng nhập mô tả công việc";
    }
    if (!formData.work_location.trim()) {
      newErrors.work_location = "Vui lòng nhập địa điểm";
    }
    if (!formData.field_id) {
      newErrors.field_id = "Vui lòng chọn lĩnh vực";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSkillsChange = (event, newValue) => {
    setJobSkills(newValue);
  };

  const handleSkillDelete = (delSkill) => {
    setJobSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== delSkill.id),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setLoading(true);

    const jobData = {
      recruiter_id: user.id,
      title: formData.title,
      job_description: formData.job_description,
      requirements: formData.requirements,
      interest: formData.interest,
      work_location: formData.work_location,
      job_type: formData.job_type,
      workplace_type: formData.workplace_type,
      working_time: formData.working_time,
      experience: formData.experience,
      salary: formData.salary,
      vacancy_count: formData.vacancy_count
        ? parseInt(formData.vacancy_count)
        : null,
      deadline: formData.deadline,
      job_status: formData.job_status,
      field_id: formData.field_id ? parseInt(formData.field_id) : null,
    };

    let result;
    let jobId = id;

    if (isEditMode) {
      result = await dispatch(updateJob(id, jobData));
    } else {
      result = await dispatch(createJob(jobData));
      // Get the created job ID from result
      if (result.success && result.data?.id) {
        jobId = result.data.id;
      }
    }

    // Update job skills - gửi toàn bộ danh sách skill hiện tại từ Autocomplete
    if (result.success && jobId) {
      try {
        const skillIds = jobSkills.map((s) => s.id);

        const skillResponse = await axiosClient.post("/skills/job/update", {
          job_id: jobId,
          skill_ids: skillIds,
        });

        if (!skillResponse.data.success) {
          console.error(
            "Update job skills warning:",
            skillResponse.data.message,
          );
        }
      } catch (err) {
        console.error("Update job skills error:", err);
        setSubmitError(
          "Lưu thông tin công việc thành công nhưng có lỗi khi cập nhật kỹ năng",
        );
        setLoading(false);
        return;
      }
    }

    setLoading(false);

    if (result.success) {
      navigate("/recruiter/jobs");
    } else {
      setSubmitError(result.message);
    }
  };

  if (fetchLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
          minHeight: "100vh",
          backgroundColor: "#F8FAFC",
        }}
      >
        <CircularProgress sx={{ color: "#013265" }} size={48} />
      </Box>
    );
  }

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#014A94",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#013265",
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#013265",
    },
  };

  return (
    <Box sx={{ backgroundColor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <StyledButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/recruiter/jobs")}
          sx={{ mb: 3 }}
          size="small"
        >
          Quay lại
        </StyledButton>

        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #013265 0%, #014A94 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isEditMode
              ? "Chỉnh sửa tin tuyển dụng"
              : "Đăng tin tuyển dụng mới"}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#5B6B7C", fontSize: "16px", fontWeight: 500 }}
          >
            {isEditMode
              ? "Cập nhật thông tin tin tuyển dụng của bạn"
              : "Điền thông tin bên dưới để đăng tin tuyển dụng mới"}
          </Typography>
        </Box>

        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "#FFF0F0",
              color: "#E92020",
              border: "1px solid #FFBDBD",
              borderRadius: 2,
              "& .MuiAlert-icon": { color: "#E92020" },
            }}
          >
            {submitError}
          </Alert>
        )}

        {/* Form Card */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 3,
            border: "1px solid #CEE5FD",
            boxShadow: "0 2px 12px rgba(1, 50, 101, 0.08)",
            p: { xs: 3, md: 4 },
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            {/* Section: Thông tin cơ bản */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#013265",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 20,
                  background:
                    "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                  borderRadius: 2,
                }}
              />
              Thông tin cơ bản
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiêu đề công việc"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.field_id}
                  sx={{ minWidth: "140px" }}
                >
                  <InputLabel>Lĩnh vực</InputLabel>
                  <Select
                    name="field_id"
                    value={formData.field_id}
                    label="Lĩnh vực"
                    onChange={handleChange}
                    required
                    sx={{ borderRadius: 2 }}
                  >
                    {jobFields.map((field) => (
                      <MenuItem key={field.id} value={field.id}>
                        {field.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Địa điểm làm việc"
                  name="work_location"
                  value={formData.work_location}
                  onChange={handleChange}
                  error={!!errors.work_location}
                  helperText={errors.work_location}
                  required
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>Loại công việc</InputLabel>
                  <Select
                    name="job_type"
                    value={formData.job_type}
                    label="Loại hình công việc"
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Full time">Full-time</MenuItem>
                    <MenuItem value="Part time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={inputSx}>
                  <InputLabel>Nơi làm việc</InputLabel>
                  <Select
                    name="workplace_type"
                    value={formData.workplace_type}
                    label="Nơi làm việc"
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="On-site">On-site</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Thời gian làm việc"
                  name="working_time"
                  value={formData.working_time}
                  onChange={handleChange}
                  sx={inputSx}
                />
              </Grid>
            </Grid>

            {/* Section: Chi tiết */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#013265",
                mt: 5,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 20,
                  background:
                    "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                  borderRadius: 2,
                }}
              />
              Chi tiết tuyển dụng
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Kinh nghiệm yêu cầu"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Số lượng tuyển"
                  name="vacancy_count"
                  type="number"
                  value={formData.vacancy_count}
                  onChange={handleChange}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mức lương (VNĐ)"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Ví dụ: 15 - 25 triệu"
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hạn nộp hồ sơ"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={inputSx}
                />
              </Grid>

              {isEditMode && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={inputSx}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="job_status"
                      value={formData.job_status}
                      label="Trạng thái"
                      onChange={handleChange}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="Open">Đang tuyển</MenuItem>
                      <MenuItem value="Closed">Đã đóng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* Section: Mô tả */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#013265",
                mt: 5,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 20,
                  background:
                    "linear-gradient(180deg, #013265 0%, #F4C000 100%)",
                  borderRadius: 2,
                }}
              />
              Mô tả & Yêu cầu
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Mô tả công việc"
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleChange}
                  error={!!errors.job_description}
                  helperText={errors.job_description}
                  required
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Quyền lợi"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  fullWidth
                  multiple
                  options={allSkills}
                  getOptionLabel={(option) => {
                    // Handle both string and object types
                    return typeof option === "string" ? option : option.name;
                  }}
                  value={jobSkills}
                  onChange={handleSkillsChange}
                  inputValue={skillInput}
                  onInputChange={(event, newInputValue) => {
                    setSkillInput(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kỹ năng yêu cầu"
                      placeholder="Tìm kiếm..."
                      sx={{ width: "445px" }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.id}
                        label={option.name}
                        {...getTagProps({ index })}
                        onDelete={() => handleSkillDelete(option)}
                        variant="outlined"
                        sx={{
                          borderColor: "#014A94",
                          color: "#014A94",
                          "& .MuiChip-deleteIcon": {
                            color: "#014A94",
                            "&:hover": {
                              color: "#013265",
                            },
                          },
                        }}
                      />
                    ))
                  }
                  sx={{
                    width: "600px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      flexWrap: "wrap",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#014A94",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#013265",
                        borderWidth: 2,
                      },
                    },
                  }}
                  noOptionsText="Không tìm thấy kỹ năng"
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
              }}
            >
              <StyledButton
                type="submit"
                variant="contained"
                size="medium"
                disabled={loading}
                sx={{ px: 3, py: 1 }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : isEditMode ? (
                  "Cập nhật"
                ) : (
                  "Đăng tin"
                )}
              </StyledButton>
              <StyledButton
                variant="outlined"
                size="medium"
                onClick={() => navigate("/recruiter/jobs")}
                sx={{ px: 3, py: 1 }}
              >
                Hủy
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
