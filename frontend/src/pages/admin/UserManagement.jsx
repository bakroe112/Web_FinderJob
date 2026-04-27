import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { axiosClient } from "../../config/AxiosClient";

const roleConfig = {
  candidate: {
    label: "Ứng viên",
    bg: "#E3F2FD",
    color: "#1565C0",
    border: "#90CAF9",
  },
  recruiter: {
    label: "Nhà tuyển dụng",
    bg: "#E8F5E9",
    color: "#2E7D32",
    border: "#A5D6A7",
  },
  admin: { label: "Admin", bg: "#FFEBEE", color: "#C62828", border: "#EF9A9A" },
};

const statusConfig = {
  active: {
    label: "Hoạt động",
    bg: "#E8F5E9",
    color: "#2E7D32",
    border: "#A5D6A7",
  },
  blocked: {
    label: "Đã khóa",
    bg: "#FFEBEE",
    color: "#C62828",
    border: "#EF9A9A",
  },
};

export default function UserManagement() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [tabValue, setTabValue] = React.useState("all");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false);
  const [actionType, setActionType] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/users/get-all");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Lấy danh sách người dùng thất bại",
      );
    } finally {
      setLoading(false);
    }
  };
  console.log("users", users);
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setActionDialogOpen(true);
    handleMenuClose();
  };

  const handleActionConfirm = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      if (actionType === "block") {
        await axiosClient.post("/users/block", { user_id: selectedUser.id });
      } else if (actionType === "unblock") {
        await axiosClient.post("/users/unblock", { user_id: selectedUser.id });
      }
      fetchUsers();
      setActionDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Thao tác thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (tabValue === "all") return users;
    return users.filter((u) => u.role === tabValue);
  }, [users, tabValue]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #013265 0%, #014A94 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý người dùng
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            background: "linear-gradient(90deg, #F4C000, #DEA500)",
            borderRadius: 2,
            mt: 1,
          }}
        />
      </Box>

      {/* Role Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            fontWeight: 600,
            textTransform: "none",
            color: "#5B6B7C",
            "&.Mui-selected": { color: "#013265" },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#013265",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab label="Tất cả" value="all" />
        <Tab label="Ứng viên" value="candidate" />
        <Tab label="Nhà tuyển dụng" value="recruiter" />
        <Tab label="Admin" value="admin" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#013265" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      ) : filteredUsers.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            border: "1px solid #CEE5FD",
            boxShadow: "0 2px 12px rgba(1,50,101,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #013265 0%, #014A94 100%)",
                  "& .MuiTableCell-head": {
                    color: "#fff",
                    fontWeight: 600,
                    borderBottom: "none",
                    py: 2,
                  },
                }}
              >
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Ngày đăng ký</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, idx) => {
                const role = roleConfig[user.role] || {
                  label: user.role,
                  bg: "#F0F0F0",
                  color: "#666",
                  border: "#CCC",
                };
                const status = user.is_blocked
                  ? statusConfig.blocked
                  : statusConfig.active;
                return (
                  <TableRow
                    key={user.id}
                    sx={{
                      bgcolor: user.is_blocked
                        ? "#FFF5F5"
                        : idx % 2 === 0
                        ? "#fff"
                        : "#F8FAFC",
                      "&:hover": { bgcolor: user.is_blocked ? "#FFE8E8" : "rgba(1,50,101,0.04)" },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={user.avatar_url}
                          sx={{ border: "2px solid #CEE5FD" }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={role.label}
                        size="small"
                        sx={{
                          bgcolor: role.bg,
                          color: role.color,
                          border: `1px solid ${role.border}`,
                          fontWeight: 600,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          bgcolor: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`,
                          fontWeight: 600,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, user)}
                        disabled={user.role === "admin"}
                        sx={{ color: "#5B6B7C" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Card sx={{ borderRadius: "12px", border: "1px solid #CEE5FD" }}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "#5B6B7C" }}>
              Không có người dùng nào
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            border: "1px solid #CEE5FD",
            boxShadow: "0 4px 20px rgba(1,50,101,0.1)",
          },
        }}
      >
        {selectedUser?.role === "admin" ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Không thể thao tác tài khoản Admin
            </Typography>
          </MenuItem>
        ) : selectedUser?.is_blocked ? (
          <MenuItem onClick={() => handleActionClick("unblock")}>
            <CheckCircleIcon
              fontSize="small"
              sx={{ mr: 1, color: "#2E7D32" }}
            />
            Mở khóa tài khoản
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleActionClick("block")}>
            <BlockIcon fontSize="small" sx={{ mr: 1, color: "#C62828" }} />
            Khóa tài khoản
          </MenuItem>
        )}
      </Menu>

      {/* Confirm Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: "12px", border: "1px solid #CEE5FD" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#013265" }}>
          {actionType === "block" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {actionType === "block" ? "khóa" : "mở khóa"}{" "}
            tài khoản của <strong>{selectedUser?.email}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setActionDialogOpen(false)}
            sx={{ color: "#5B6B7C", borderRadius: "8px" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            disabled={actionLoading}
            sx={{
              borderRadius: "8px",
              bgcolor: actionType === "block" ? "#C62828" : "#2E7D32",
              "&:hover": {
                bgcolor: actionType === "block" ? "#B71C1C" : "#1B5E20",
              },
            }}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
