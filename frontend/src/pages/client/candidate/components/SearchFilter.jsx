import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SearchCard, StyledButton } from './JobSearchStyles';

export default function SearchFilter({
  filters,
  onFilterChange,
  onSearch,
  onKeyPress,
}) {
  return (
    <SearchCard sx={{ mb: 4, p: { xs: 2.5, md: 4 } }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            name="keyword"
            placeholder="Từ khóa, vị trí, công ty..."
            value={filters.keyword}
            onChange={onFilterChange}
            onKeyPress={onKeyPress}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#013265', mr: 0.5 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FAFBFC',
                borderRadius: '8px',
                height: '52px',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover fieldset': {
                  borderColor: '#F4C000',
                  boxShadow: '0 0 0 3px rgba(244, 192, 0, 0.1)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#013265',
                  boxShadow: '0 0 0 3px rgba(1, 50, 101, 0.1)',
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                opacity: 0.5,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            name="location"
            placeholder="Địa điểm"
            value={filters.location}
            onChange={onFilterChange}
            onKeyPress={onKeyPress}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: '#013265', mr: 0.5 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FAFBFC',
                borderRadius: '8px',
                height: '52px',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover fieldset': {
                  borderColor: '#F4C000',
                  boxShadow: '0 0 0 3px rgba(244, 192, 0, 0.1)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#013265',
                  boxShadow: '0 0 0 3px rgba(1, 50, 101, 0.1)',
                },
              },
              '& .MuiOutlinedInput-input::placeholder': {
                opacity: 0.5,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel
              shrink
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: '#013265',
                },
              }}
            >
              Loại công việc
            </InputLabel>
            <Select
              name="job_type"
              value={filters.job_type}
              label="Loại công việc"
              onChange={onFilterChange}
              displayEmpty
              sx={{
                height: '52px',
                borderRadius: '8px',
                backgroundColor: '#FAFBFC',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#F4C000',
                    boxShadow: '0 0 0 3px rgba(244, 192, 0, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#013265',
                    boxShadow: '0 0 0 3px rgba(1, 50, 101, 0.1)',
                  },
                },
              }}
            >
              <MenuItem value="" sx={{ fontSize: '15px' }}>
                Tất cả
              </MenuItem>
              <MenuItem value="Full time" sx={{ fontSize: '15px' }}>
                Full-time
              </MenuItem>
              <MenuItem value="Part time" sx={{ fontSize: '15px' }}>
                Part-time
              </MenuItem>
              <MenuItem value="Contract" sx={{ fontSize: '15px' }}>
                Contract
              </MenuItem>
              <MenuItem value="Internship" sx={{ fontSize: '15px' }}>
                Internship
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel
              shrink
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: '#013265',
                },
              }}
            >
              Kinh nghiệm
            </InputLabel>
            <Select
              name="experience"
              value={filters.experience}
              label="Kinh nghiệm"
              onChange={onFilterChange}
              displayEmpty
              sx={{
                height: '52px',
                borderRadius: '8px',
                backgroundColor: '#FAFBFC',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#F4C000',
                    boxShadow: '0 0 0 3px rgba(244, 192, 0, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#013265',
                    boxShadow: '0 0 0 3px rgba(1, 50, 101, 0.1)',
                  },
                },
              }}
            >
              <MenuItem value="" sx={{ fontSize: '15px' }}>
                Tất cả
              </MenuItem>
              <MenuItem value="0" sx={{ fontSize: '15px' }}>
                Không yêu cầu
              </MenuItem>
              <MenuItem value="1" sx={{ fontSize: '15px' }}>
                1 năm
              </MenuItem>
              <MenuItem value="2" sx={{ fontSize: '15px' }}>
                2 năm
              </MenuItem>
              <MenuItem value="3" sx={{ fontSize: '15px' }}>
                3+ năm
              </MenuItem>
              <MenuItem value="5" sx={{ fontSize: '15px' }}>
                5+ năm
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={1.5}>
          <StyledButton
            fullWidth
            variant="contained"
            onClick={onSearch}
            sx={{ height: 52, fontWeight: 600, borderRadius: '8px' }}
          >
            Tìm
          </StyledButton>
        </Grid>
      </Grid>
    </SearchCard>
  );
}
