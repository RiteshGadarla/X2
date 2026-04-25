import React from 'react';
import { useAuth } from '../state/AuthContext';

export const ProtectedComponent = ({ permission, permissions, children, fallback = null }) => {
    const { canAccess } = useAuth();
    const required = permissions || (permission ? [permission] : []);
    const hasAccess = required.some((entry) => canAccess(entry));

    if (hasAccess) {
        return <>{children}</>;
    }

    return fallback;
};
