import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const FALLBACK_ROLES = [
    { id: 'SUPPORT_AGENT', name: 'Support Agent' },
    { id: 'SUPPORT_MANAGER', name: 'Support Manager / CSM' },
    { id: 'VP_CUSTOMER_SUCCESS', name: 'VP Customer Success' },
    { id: 'LEGAL_COMPLIANCE', name: 'Legal / Compliance' },
    { id: 'ADMIN_OPS', name: 'Admin / Support Operations' },
    { id: 'CUSTOMER', name: 'Customer (External Portal)' }
];

const FALLBACK_PERMISSIONS = {
    SUPPORT_AGENT: ['VIEW_TICKETS', 'VIEW_SLA', 'VIEW_HIL_STATUS', 'DRAFT_KB'],
    SUPPORT_MANAGER: ['VIEW_TICKETS', 'VIEW_SLA', 'VIEW_HIL_STATUS', 'DRAFT_KB', 'PUBLISH_KB', 'APPROVE_HIL', 'VIEW_SENTIMENT', 'VIEW_VOC'],
    VP_CUSTOMER_SUCCESS: ['APPROVE_HIL_OVERRIDE', 'VIEW_EXEC_DASH', 'VIEW_VOC', 'VIEW_HIL_STATUS', 'VIEW_SLA'],
    LEGAL_COMPLIANCE: ['VIEW_LEGAL_TICKETS', 'MANAGE_LEGAL_CORRESPONDENCE', 'VIEW_HIL_STATUS', 'VIEW_KB'],
    ADMIN_OPS: ['MANAGE_INTEGRATIONS', 'VIEW_CHANNEL_VOL', 'MANAGE_AGENT_CONFIG'],
    CUSTOMER: ['VIEW_CUSTOMER_PORTAL', 'SUBMIT_CUSTOMER_TICKET', 'VIEW_TICKET_STATUS']
};

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [rolesList, setRolesList] = useState(FALLBACK_ROLES);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [rolesError, setRolesError] = useState(null);

    // Fetch master roles list
    useEffect(() => {
        setRolesLoading(true);
        fetch('http://localhost:8000/api/rbac/roles')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.roles) && data.roles.length) {
                    setRolesList(data.roles);
                    setRolesError(null);
                } else {
                    setRolesList(FALLBACK_ROLES);
                    setRolesError('Roles API returned empty data. Using offline roles.');
                }
            })
            .catch((err) => {
                console.error('Error fetching roles:', err);
                setRolesList(FALLBACK_ROLES);
                setRolesError('Backend unavailable. Using offline role catalog.');
            })
            .finally(() => setRolesLoading(false));
    }, []);

    // Permission retrieval with fallback guarantees role usability.
    useEffect(() => {
        if (role) {
            setPermissions(FALLBACK_PERMISSIONS[role] || []);
            fetch(`http://localhost:8000/api/rbac/roles/${role}/permissions`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data.permissions) && data.permissions.length) {
                        setPermissions(data.permissions);
                    }
                })
                .catch((err) => console.error('Error fetching permissions:', err));
        } else {
            setPermissions([]);
        }
    }, [role]);

    const canAccess = (requiredPermission) => permissions.includes(requiredPermission);

    return (
        <AuthContext.Provider value={{ role, setRole, permissions, rolesList, canAccess, rolesLoading, rolesError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
