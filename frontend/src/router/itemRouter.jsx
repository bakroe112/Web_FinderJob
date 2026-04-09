import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Root Layout (provides Auth and Notification context inside Router)
import RootLayout from '../layouts/RootLayout';

// Layouts
import { ClientLayout, RecruiterLayout, AdminLayout } from '../layouts';

// Auth Pages
import { Login, Register } from '../pages/auth';

// Public Pages
import {
  HomePage,
  JobListPage,
  JobDetailPage,
} from '../pages/client';

// Candidate Pages
import {
  CandidateDashboard,
  JobList as CandidateJobList,
  JobDetail as CandidateJobDetail,
  Applications,
  SavedJobs,
  CandidateProfile,
  ResumeAnalysis,
} from '../pages/client/candidate';

// Recruiter Pages
import {
  RecruiterDashboard,
  JobManagement,
  CreateJob,
  JobDetail,
  ApplicationManagement,
  RecruiterProfile,
} from '../pages/client/recruiter';

// Admin Pages
import {
  AdminDashboard,
  UserManagement,
  JobManagement as AdminJobManagement,
} from '../pages/admin';
import AdminSettings from '../pages/admin/Settings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    } else {
      return <Navigate to="/candidate" replace />;
    }
  }

  return children;
};

// Guest Route - redirect if already logged in
const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    } else {
      return <Navigate to="/candidate" replace />;
    }
  }

  return children;
};

export const itemRouter = createBrowserRouter([
  {
    // Root layout wraps all routes - provides Auth/Notification context
    element: <RootLayout />,
    children: [
      // Public Routes
      {
        path: '/',
        element: <ClientLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'jobs', element: <JobListPage /> },
          { path: 'jobs/:id', element: <JobDetailPage /> },
        ],
      },

      // Auth Routes
      {
        path: '/login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },

      // Candidate Routes
      {
        path: '/candidate',
        element: (
          <ProtectedRoute allowedRoles={['candidate']}>
            <ClientLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/candidate/dashboard" replace /> },
          { path: 'dashboard', element: <CandidateDashboard /> },
          { path: 'jobs', element: <CandidateJobList /> },
          { path: 'jobs/:id', element: <CandidateJobDetail /> },
          { path: 'applications', element: <Applications /> },
          { path: 'saved-jobs', element: <SavedJobs /> },
          { path: 'profile', element: <CandidateProfile /> },
          { path: 'resume-analysis', element: <ResumeAnalysis /> },
        ],
      },

      // Recruiter Routes
      {
        path: '/recruiter',
        element: (
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/recruiter/dashboard" replace /> },
          { path: 'dashboard', element: <RecruiterDashboard /> },
          { path: 'jobs', element: <JobManagement /> },
          { path: 'jobs/create', element: <CreateJob /> },
          { path: 'jobs/:id', element: <JobDetail /> },
          { path: 'jobs/edit/:id', element: <CreateJob /> },
          { path: 'applications', element: <ApplicationManagement /> },
          { path: 'profile', element: <RecruiterProfile /> },
        ],
      },

      // Admin Routes
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'jobs', element: <AdminJobManagement /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },

      // Catch all - 404
      // {
      //   path: '*',
      //   element: <Navigate to="/" replace />,
      // },
    ],
  },
]);

