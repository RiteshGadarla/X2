import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../state/auth-context';
import {
    LayoutDashboard, Ticket, BarChart3, ShieldAlert, BookOpen,
    MessageSquareHeart, TrendingUp, Scale, UserRound, Plug, Radio, Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ROLE_NAV = {
    SUPPORT_LEAD: [
        { label: 'Home', route: '/support-lead', icon: LayoutDashboard },
        { label: 'Tickets', route: '/support-lead/tickets', icon: Ticket },
        { label: 'SLA', route: '/support-lead/sla', icon: BarChart3 },
        { label: 'HIL Review', route: '/support-lead/hil', icon: ShieldAlert },
        { label: 'Knowledge Base', route: '/support-lead/kb', icon: BookOpen },
    ],
    SUPPORT_MANAGER: [
        { label: 'Home', route: '/support-manager', icon: LayoutDashboard },
        { label: 'Sentiment', route: '/support-manager/sentiment', icon: MessageSquareHeart },
        { label: 'HIL Review', route: '/support-manager/hil', icon: ShieldAlert },
        { label: 'Knowledge Base', route: '/support-manager/kb', icon: BookOpen },
        { label: 'VoC', route: '/support-manager/voc', icon: TrendingUp },
    ],
    VP_CUSTOMER_SUCCESS: [
        { label: 'Home', route: '/vp', icon: LayoutDashboard },
        { label: 'Executive', route: '/vp/exec', icon: BarChart3 },
        { label: 'VoC', route: '/vp/voc', icon: TrendingUp },
        { label: 'HIL Override', route: '/vp/hil', icon: ShieldAlert },
    ],
    LEGAL_COMPLIANCE: [
        { label: 'Home', route: '/legal', icon: LayoutDashboard },
        { label: 'Legal Queue', route: '/legal/queue', icon: Scale },
        { label: 'HIL Review', route: '/legal/hil', icon: ShieldAlert },
        { label: 'Knowledge Base', route: '/legal/kb', icon: BookOpen },
    ],
    ADMIN_OPS: [
        { label: 'Home', route: '/admin', icon: LayoutDashboard },
        { label: 'Integrations', route: '/admin/integrations', icon: Plug },
        { label: 'Channels', route: '/admin/channels', icon: Radio },
    ],
    CUSTOMER: [
        { label: 'Dashboard', route: '/customer', icon: LayoutDashboard },
        { label: 'My Portal', route: '/customer/portal', icon: UserRound },
    ],
};

const ROLE_COLORS = {
    SUPPORT_LEAD: '#6B8EF0',
    SUPPORT_MANAGER: '#5929d0',
    VP_CUSTOMER_SUCCESS: '#A855F7',
    LEGAL_COMPLIANCE: '#01CAB8',
    ADMIN_OPS: '#8B5CF6',
    CUSTOMER: '#CF008B',
};

const ROLE_INITIALS = {
    SUPPORT_LEAD: 'SL',
    SUPPORT_MANAGER: 'SM',
    VP_CUSTOMER_SUCCESS: 'VP',
    LEGAL_COMPLIANCE: 'LC',
    ADMIN_OPS: 'AO',
    CUSTOMER: 'CU',
};

const AppSidebar = () => {
    const { role, setRole, rolesList } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [showPanel, setShowPanel] = useState(false);
    const [panelPos, setPanelPos] = useState({ bottom: 60 });
    const roleBtnRef = useRef(null);
    const panelRef = useRef(null);

    const items = ROLE_NAV[role] || [];
    const homeRoute = items[0]?.route || '/';
    const roleColor = ROLE_COLORS[role] || '#5929d0';

    const openPanel = () => {
        if (roleBtnRef.current) {
            const rect = roleBtnRef.current.getBoundingClientRect();
            // always open upward: anchor panel bottom to button top + small gap
            setPanelPos({ bottom: window.innerHeight - rect.top + 6 });
        }
        setShowPanel(v => !v);
    };

    useEffect(() => {
        if (!showPanel) return;
        const close = (e) => {
            if (!panelRef.current?.contains(e.target) && !roleBtnRef.current?.contains(e.target)) {
                setShowPanel(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [showPanel]);

    return (
        <>
            <aside className="app-sidebar">
                {/* Logo */}
                <button
                    type="button"
                    className="sidebar-logo-btn"
                    onClick={() => navigate(homeRoute)}
                    data-label="aegis.ai"
                >
                    <div className="sidenav-logo-mark">A</div>
                </button>

                <div className="sidebar-sep" />

                {/* Role nav icons */}
                <nav className="sidebar-nav">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.route;
                        return (
                            <button
                                key={item.route}
                                type="button"
                                className={`sidebar-item${active ? ' active' : ''}`}
                                onClick={() => navigate(item.route)}
                                data-label={item.label}
                            >
                                <Icon size={20} />
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-spacer" />

                <div className="sidebar-sep" />

                {/* Role selector button — pinned to bottom */}
                <button
                    ref={roleBtnRef}
                    type="button"
                    className={`sidebar-role-toggle${showPanel ? ' open' : ''}`}
                    onClick={openPanel}
                    data-label={role ? `Role: ${role.replace(/_/g, ' ')}` : 'Select Role'}
                    style={{ marginBottom: '4px' }}
                >
                    {role ? (
                        <span className="sidebar-role-avatar" style={{ background: roleColor }}>
                            {ROLE_INITIALS[role]}
                        </span>
                    ) : (
                        <span className="sidebar-role-avatar sidebar-role-avatar--empty">
                            <Users size={16} />
                        </span>
                    )}
                </button>
            </aside>

            {/* Role selection panel — opens upward from bottom button */}
            {showPanel && (
                <div
                    ref={panelRef}
                    className="sidebar-role-panel"
                    style={{ bottom: panelPos.bottom, top: 'auto' }}
                >
                    <div className="sidebar-role-panel-header">Switch Role</div>
                    {rolesList.map((r) => {
                        const firstRoute = (ROLE_NAV[r.id] || [])[0]?.route;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                className={`sidebar-role-option${role === r.id ? ' selected' : ''}`}
                                onClick={() => {
                                    setRole(r.id);
                                    setShowPanel(false);
                                    if (firstRoute) navigate(firstRoute);
                                }}
                            >
                                <span
                                    className="role-option-dot"
                                    style={{ background: ROLE_COLORS[r.id] || '#5929d0' }}
                                />
                                <span className="role-option-name">{r.name}</span>
                                {role === r.id && (
                                    <span className="role-option-check">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default AppSidebar;
