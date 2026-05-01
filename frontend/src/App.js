import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return user?.role === 'CANDIDATE' ? _jsx(CandidateDashboard, {}) : _jsx(HrDashboard, {});
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { path: "/app", element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(DashboardRouter, {}) }), _jsx(Route, { path: "cv", element: _jsx(ProtectedRoute, { roles: ['CANDIDATE'], children: _jsx(CvList, {}) }) }), _jsx(Route, { path: "cv/:id", element: _jsx(CvDetail, {}) }), _jsx(Route, { path: "jobs", element: _jsx(JobsList, {}) }), _jsx(Route, { path: "jobs/new", element: _jsx(ProtectedRoute, { roles: ['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER'], children: _jsx(JobCreate, {}) }) }), _jsx(Route, { path: "jobs/:id", element: _jsx(JobDetail, {}) }), _jsx(Route, { path: "candidates", element: _jsx(ProtectedRoute, { roles: ['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER'], children: _jsx(Candidates, {}) }) }), _jsx(Route, { path: "pipeline", element: _jsx(ProtectedRoute, { roles: ['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER'], children: _jsx(Pipeline, {}) }) }), _jsx(Route, { path: "analytics", element: _jsx(ProtectedRoute, { roles: ['HR', 'ADMIN', 'RECRUITER_AGENCY', 'HIRING_MANAGER'], children: _jsx(Analytics, {}) }) }), _jsx(Route, { path: "settings", element: _jsx(Settings, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
