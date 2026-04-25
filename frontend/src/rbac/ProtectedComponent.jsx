import { useAuth } from '../state/auth-context';

export const ProtectedComponent = ({ permission, permissions, children, fallback = null }) => {
    const { canAccess } = useAuth();
    const required = permissions || (permission ? [permission] : []);
    const hasAccess = required.some((entry) => canAccess(entry));

    if (hasAccess) {
        return <>{children}</>;
    }

    return fallback;
};
