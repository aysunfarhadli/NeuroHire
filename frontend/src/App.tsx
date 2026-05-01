import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/store/auth';

import Landing from '@/pages/auth/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

import CandidateDashboard from '@/pages/candidate/CandidateDashboard';
import CvList from '@/pages/candidate/CvList';
import CvDetail from '@/pages/candidate/CvDetail';

import HrDashboard from '@/pages/hr/HrDashboard';
import JobsList from '@/pages/hr/JobsList';
import JobCreate from '@/pages/hr/JobCreate';
import JobDetail from '@/pages/hr/JobDetail';
import Candidates from '@/pages/hr/Candidates';
import Pipeline from '@/pages/hr/Pipeline';
import Analytics from '@/pages/hr/Analytics';

import Settings from '@/pages/Settings';

function DashboardRouter() {
  const { user } = useAuth();
  return user?.role === 'CANDIDATE' ? <CandidateDashboard /> : <HrDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRouter />} />

        {/* CV — visible to candidates, but HR can also view a CV detail by id */}
        <Route path="cv" element={<ProtectedRoute roles={['CANDIDATE']}><CvList /></ProtectedRoute>} />
        <Route path="cv/:id" element={<CvDetail />} />

        {/* Jobs — both roles can list/view; only HR-like can create/edit (server enforces too) */}
        <Route path="jobs" element={<JobsList />} />
        <Route path="jobs/new" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><JobCreate /></ProtectedRoute>} />
        <Route path="jobs/:id" element={<JobDetail />} />

        {/* HR-only */}
        <Route path="candidates" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><Candidates /></ProtectedRoute>} />
        <Route path="pipeline" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><Pipeline /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute roles={['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER']}><Analytics /></ProtectedRoute>} />

        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
