import { useAuth } from '../state/auth-context';
import { LayoutDashboard, Ticket, BarChart3, ShieldAlert, BookOpen, Settings, LogOut, MessageSquareHeart, TrendingUp, Scale, UserRound } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navSections = [
    {
        label: 'Overview',
        items: [
            { label: 'Dashboard', route: '/', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Support',
        items: [
            { label: 'Tickets', route: '/tickets', icon: Ticket, permissions: ['VIEW_TICKETS'] },
            { label: 'SLA', route: '/sla', icon: BarChart3, permissions: ['VIEW_SLA'] },
            { label: 'HIL Review', route: '/hil', icon: ShieldAlert, permissions: ['VIEW_HIL_STATUS', 'APPROVE_HIL', 'APPROVE_HIL_OVERRIDE', 'MANAGE_LEGAL_CORRESPONDENCE'] },
            { label: 'Sentiment', route: '/sentiment', icon: MessageSquareHeart, permissions: ['VIEW_SENTIMENT'] },
            { label: 'Knowledge Base', route: '/kb', icon: BookOpen, permissions: ['DRAFT_KB', 'PUBLISH_KB', 'VIEW_KB'] },
        ],
    },
    {
        label: 'Insights',
        items: [
            { label: 'VoC', route: '/voc', icon: TrendingUp, permissions: ['VIEW_VOC'] },
            { label: 'Executive', route: '/exec', icon: BarChart3, permissions: ['VIEW_EXEC_DASH'] },
        ],
    },
    {
        label: 'Governance',
        items: [
            { label: 'Legal', route: '/legal', icon: Scale, permissions: ['VIEW_LEGAL_TICKETS'] },
            { label: 'Integrations', route: '/integrations', icon: Settings, permissions: ['MANAGE_INTEGRATIONS'] },
            { label: 'Portal', route: '/portal', icon: UserRound, permissions: ['VIEW_CUSTOMER_PORTAL'] },
        ],
    },
];

const Taskbar = () => {
    const { setRole, canAccess } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const canShowItem = (item) => !item.permissions || item.permissions.some((p) => canAccess(p));
    const allItems = navSections.flatMap(s => s.items).filter(canShowItem);

    return (
        <header className="taskbar">
            {/* Logo */}
            <div className="taskbar-logo" onClick={() => navigate('/')}>
                <div className="sidenav-logo-mark">A</div>
                <span className="taskbar-brand">aegis.ai</span>
            </div>

            <div className="taskbar-divider" />

            {/* Nav items */}
            <nav className="taskbar-nav">
                {allItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.route;
                    return (
                        <button
                            key={item.route}
                            type="button"
                            className={`taskbar-item${active ? ' active' : ''}`}
                            onClick={() => navigate(item.route)}
                            title={item.label}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Right: switch role */}
            <div className="taskbar-actions">
                <button
                    type="button"
                    className="taskbar-item taskbar-logout"
                    onClick={() => setRole(null)}
                    title="Switch Role"
                >
                    <LogOut size={15} />
                    <span>Switch Role</span>
                </button>
            </div>
        </header>
    );
};

export default Taskbar;
