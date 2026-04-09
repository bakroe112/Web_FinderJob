import { Outlet } from 'react-router-dom';
import { AuthProvider, NotificationProvider } from '../context';

// Root layout that wraps all routes with Auth and Notification providers
// This is rendered inside the Router so useNavigate works
export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Outlet />
      </NotificationProvider>
    </AuthProvider>
  );
}
