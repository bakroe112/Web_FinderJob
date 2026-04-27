import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import Logo from './Logo';

const items = [
  {
    icon: <SearchRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Tìm kiếm việc làm dễ dàng',
    description:
      'Khám phá hàng ngàn cơ hội việc làm từ những công ty hàng đầu và phù hợp với kỹ năng của bạn.',
  },
  {
    icon: <WorkspacePremiumRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Cơ hội sự nghiệp tốt',
    description:
      'Phát triển kỹ năng và tiến bộ trong sự nghiệp của bạn với những vị trí phù hợp.',
  },
  {
    icon: <PeopleAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Kết nối với nhà tuyển dụng',
    description:
      'Tương tác trực tiếp với các nhà tuyển dụng và nhận lời mời từ các công ty mà bạn quan tâm.',
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Tăng cơ hội thành công',
    description:
      'Sử dụng các công cụ và tính năng hiện đại để tăng cơ hội được chọn trong cuộc phỏng vấn.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Logo />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
