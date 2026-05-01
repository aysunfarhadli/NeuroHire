import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
export default function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" }) }));
    }
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (roles && !roles.includes(user.role))
        return _jsx(Navigate, { to: "/app", replace: true });
    return _jsx(_Fragment, { children: children });
}
