import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import InfoIcon from "@mui/icons-material/Info";
import StorageIcon from "@mui/icons-material/Storage";
import ComputerIcon from "@mui/icons-material/Computer";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";

const cardSx = {
  borderRadius: '12px',
  border: '1px solid #CEE5FD',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(1,50,101,0.10)',
  },
};

const cardHeaderSx = {
  '& .MuiCardHeader-avatar': {
    '& .MuiSvgIcon-root': {
      color: '#fff',
      backgroundColor: '#014A94',
      borderRadius: '10px',
      padding: '6px',
      fontSize: '2rem',
    },
  },
  '& .MuiCardHeader-title': {
    fontWeight: 700,
    color: '#013265',
    fontSize: '1.05rem',
  },
};

const listItemSx = {
  py: 1.2,
  borderBottom: '1px solid #F0F4F8',
  '&:last-child': { borderBottom: 'none' },
};

const primaryTextSx = {
  fontWeight: 600,
  color: '#013265',
  fontSize: '0.9rem',
};

const secondaryTextSx = {
  color: '#5B6B7C',
  fontSize: '0.85rem',
};

export default function AdminSettings() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #013265 0%, #014A94 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Cài đặt hệ thống
        </Typography>
        <Box sx={{ width: 60, height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #F4C000, #DEA500)' }} />
      </Box>

      <Grid container spacing={3}>
        {/* Thông tin hệ thống */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardHeader avatar={<InfoIcon />} title="Thông tin hệ thống" sx={cardHeaderSx} />
            <Divider sx={{ borderColor: '#CEE5FD' }} />
            <CardContent>
              <List disablePadding>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Phiên bản ứng dụng"
                    secondary="v1.0.0"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Framework"
                    secondary="React + Vite + Material-UI"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="React Version"
                    secondary="18.x"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Ngôn ngữ"
                    secondary="Tiếng Việt"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Múi giờ"
                    secondary="Asia/Ho_Chi_Minh (GMT+7)"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Cơ sở dữ liệu"
                    secondary="Supabase PostgreSQL"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Lần cập nhật cuối"
                    secondary={new Date().toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Dung lượng lưu trữ */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardHeader avatar={<StorageIcon />} title="Dung lượng lưu trữ" sx={cardHeaderSx} />
            <Divider sx={{ borderColor: '#CEE5FD' }} />
            <CardContent>
              <List disablePadding>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Dung lượng đã sử dụng"
                    secondary="2.5 GB / 100 GB (2.5%)"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Tệp hình ảnh"
                    secondary="1.2 GB"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Tệp tài liệu"
                    secondary="0.8 GB"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Bản sao lưu"
                    secondary="0.5 GB"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Frontend Information */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardHeader avatar={<ComputerIcon />} title="Thông tin Frontend" sx={cardHeaderSx} />
            <Divider sx={{ borderColor: '#CEE5FD' }} />
            <CardContent>
              <List disablePadding>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Framework"
                    secondary="React 18.x"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Build Tool"
                    secondary="Vite"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="UI Library"
                    secondary="Material-UI (MUI)"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="State Management"
                    secondary="Redux"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="HTTP Client"
                    secondary="Axios"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Routing"
                    secondary="React Router v6"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Backend Information */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardHeader avatar={<StorageOutlinedIcon />} title="Thông tin Backend" sx={cardHeaderSx} />
            <Divider sx={{ borderColor: '#CEE5FD' }} />
            <CardContent>
              <List disablePadding>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Runtime"
                    secondary="Node.js"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Framework"
                    secondary="Express.js"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Database"
                    secondary="Supabase PostgreSQL"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Authentication"
                    secondary="JWT + Supabase Auth"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="Password Hashing"
                    secondary="bcryptjs (rounds: 10)"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
                <ListItem sx={listItemSx}>
                  <ListItemText
                    primary="File Storage"
                    secondary="Supabase Storage"
                    primaryTypographyProps={{ sx: primaryTextSx }}
                    secondaryTypographyProps={{ sx: secondaryTextSx }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
