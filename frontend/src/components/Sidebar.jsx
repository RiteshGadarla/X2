import React from 'react';
import { useAuth } from '../state/AuthContext';
import { ProtectedComponent } from '../rbac/ProtectedComponent';
import { LayoutDashboard, Ticket, BarChart3, ShieldAlert, BookOpen, Settings, LogOut, MessageSquareHeart, TrendingUp, Scale, UserRound } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, onClick, active }) => (
    <div 
        onClick={onClick}
        style={{
            width: '40px', height: '40px',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
            background: active ? 'var(--primary-light)' : 'transparent',
            color: active ? 'var(--primary)' : 'var(--neutral-4)',
            transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--primary)'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--neutral-4)'; }}
    >
        <Icon size={20} />
    </div>
);

const Sidebar = () => {
    const { setRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside style={{
            position: 'fixed', left: 0, top: 0, 
            width: '70px', height: '100vh',
            background: '#fff',
            borderRight: '1px solid var(--neutral-7)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '24px 0',
            zIndex: 100
        }}>
            {/* Logo area */}
            <div style={{ marginBottom: '40px' }}>
                <div className="sidebar-logo-mark">A</div>
            </div>

            {/* Navigation Links wrapped via RBAC */}
            <div style={{ flex: 1, width: '100%' }}>
                <SidebarItem 
                    icon={LayoutDashboard} 
                    active={location.pathname === "/"} 
                    onClick={() => navigate("/")} 
                />
                
                <ProtectedComponent permission="VIEW_TICKETS">
                    <SidebarItem icon={Ticket} active={location.pathname === "/tickets"} onClick={() => navigate("/tickets")} />
                </ProtectedComponent>

                <ProtectedComponent permission="VIEW_SLA">
                    <SidebarItem icon={BarChart3} active={location.pathname === "/sla"} onClick={() => navigate("/sla")} />
                </ProtectedComponent>

                <ProtectedComponent permission="VIEW_HIL_STATUS">
                    <SidebarItem icon={ShieldAlert} active={location.pathname === "/hil"} onClick={() => navigate("/hil")} />
                </ProtectedComponent>

                <ProtectedComponent permission="VIEW_SENTIMENT">
                    <SidebarItem icon={MessageSquareHeart} active={location.pathname === "/sentiment"} onClick={() => navigate("/sentiment")} />
                </ProtectedComponent>

                <ProtectedComponent permission="VIEW_VOC">
                    <SidebarItem icon={TrendingUp} active={location.pathname === "/voc"} onClick={() => navigate("/voc")} />
                </ProtectedComponent>

                <ProtectedComponent permission="DRAFT_KB">
                    <SidebarItem icon={BookOpen} active={location.pathname === "/kb"} onClick={() => navigate("/kb")} />
                </ProtectedComponent>

                <ProtectedComponent permission="VIEW_LEGAL_TICKETS">
                    <SidebarItem icon={Scale} active={location.pathname === "/legal"} onClick={() => navigate("/legal")} />
                </ProtectedComponent>

                <ProtectedComponent permission="MANAGE_INTEGRATIONS">
                    <SidebarItem icon={Settings} active={location.pathname === "/integrations"} onClick={() => navigate("/integrations")} />
                </ProtectedComponent>

                <ProtectedComponent permission="VIEW_CUSTOMER_PORTAL">
                    <SidebarItem icon={UserRound} active={location.pathname === "/portal"} onClick={() => navigate("/portal")} />
                </ProtectedComponent>
            </div>

            {/* Bottom Section */}
            <div style={{ paddingBottom: '16px' }}>
                <SidebarItem 
                    icon={LogOut} 
                    onClick={() => setRole(null)} 
                />
            </div>
        </aside>
    );
};

export default Sidebar;
