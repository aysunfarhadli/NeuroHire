import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicLayout from '@/components/PublicLayout';
import AiChatWidget from '@/components/AiChatWidget';
import { useAuth } from '@/store/auth';

import Landing from '@/pages/auth/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

import JobsBrowse from '@/pages/public/JobsBrowse';
import JobPublicDetail from '@/pages/public/JobPublicDetail';
import CompaniesBrowse from '@/pages/public/CompaniesBrowse';
import CompanyProfile from '@/pages/public/CompanyProfile';

import CandidateDashboard from '@/pages/candidate/CandidateDashboard';
import CvList from '@/pages/candidate/CvList';
import CvDetail from '@/pages/candidate/CvDetail';
import MyApplications from '@/pages/candidate/MyApplications';

import HrDashboard from '@/pages/hr/HrDashboard';
import JobsList from '@/pages/hr/JobsList';
import JobCreate from '@/pages/hr/JobCreate';
import JobDetail from '@/pages/hr/JobDetail';
import Candidates from '@/pages/hr/Candidates';
import Pipeline from '@/pages/hr/Pipeline';
import Analytics from '@/pages/hr/Analytics';

import Settings from '@/pages/Settings';

import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import SuperAdminUsers from '@/pages/superadmin/SuperAdminUsers';
import SuperAdminCompanies from '@/pages/superadmin/SuperAdminCompanies';
import SuperAdminJobs from '@/pages/superadmin/SuperAdminJobs';

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'SUPER_ADMIN') return <Navigate to="/superadmin" replace />;
  return user?.role === 'CANDIDATE' ? <CandidateDashboard /> : <HrDashboard />;
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes — guests can browse */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<JobsBrowse />} />
          <Route path="/jobs/:id" element={<JobPublicDetail />} />
          <Route path="/companies" element={<CompaniesBrowse />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated app for candidates / HR / managers */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardRouter />} />
          <Route path="cv" element={<ProtectedRoute roles={['CANDIDATE']}><CvList /></ProtectedRoute>} />
          <Route path="cv/:id" element={<CvDetail />} />
          <Route path="applications" element={<ProtectedRoute roles={['CANDIDATE']}><MyApplications /></ProtectedRoute>} />
          <Route path="jobs" element={<JobsList />} />
          <Route path="jobs/new" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><JobCreate /></ProtectedRoute>} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="candidates" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><Candidates /></ProtectedRoute>} />
          <Route path="pipeline" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><Pipeline /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><Analytics /></ProtectedRoute>} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Super admin — locked to SUPER_ADMIN */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="companies" element={<SuperAdminCompanies />} />
          <Route path="jobs" element={<SuperAdminJobs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AiChatWidget />
    </>
  );
}
