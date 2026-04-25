import { useAuth } from '../state/auth-context';
import { LayoutDashboard, Ticket, BarChart3, ShieldAlert, BookOpen, Settings, LogOut, MessageSquareHeart, TrendingUp, Scale, UserRound } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, onClick, active }) => (
    <button
        type="button"
        className={`sidenav-link${active ? ' active' : ''}`}
        onClick={onClick}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
);

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

const Sidebar = () => {
    const { setRole, canAccess } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const canShowItem = (item) => !item.permissions || item.permissions.some((permission) => canAccess(permission));

    return (
        <aside className="sidenav">
            <div className="sidenav-logo">
                <div className="sidenav-logo-mark">A</div>
                <div className="sidenav-logo-copy">
                    <div className="sidenav-logo-text">aegis.ai</div>
                    <div className="sidenav-logo-sub">RBAC console</div>
                </div>
            </div>

            <nav className="sidenav-nav" aria-label="Primary navigation">
                {navSections.map((section) => {
                    const visibleItems = section.items.filter(canShowItem);
                    if (!visibleItems.length) return null;

                    return (
                        <div key={section.label}>
                            <div className="sidenav-section-label">{section.label}</div>
                            {visibleItems.map((item) => (
                                <SidebarItem
                                    key={item.route}
                                    icon={item.icon}
                                    label={item.label}
                                    active={location.pathname === item.route}
                                    onClick={() => navigate(item.route)}
                                />
                            ))}
                        </div>
                    );
                })}
            </nav>

            <div className="sidenav-footer">
                <SidebarItem
                    icon={LogOut}
                    label="Switch Role"
                    onClick={() => setRole(null)}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
