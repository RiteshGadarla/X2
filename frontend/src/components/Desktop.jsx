import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
    Ticket, BarChart3, Users, ShieldAlert, Scale,
    UserRound, Plug, TrendingUp, Settings
} from 'lucide-react';
import { useAuth } from '../state/auth-context';
import { ProtectedComponent } from '../rbac/ProtectedComponent';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import LiveTicketQueue from '../features/LiveTicketQueue';
import SLACompliance from '../features/SLACompliance';
import SentimentFeed from '../features/SentimentFeed';
import HILReviewQueue from '../features/HILReviewQueue';
import KBPanel from '../features/KBPanel';
import VocPanel from '../features/VocPanel';
import IntegrationPanel from '../features/IntegrationPanel';
import ExecutiveDashboard from '../features/ExecutiveDashboard';
import LegalComplianceDashboard from '../features/LegalComplianceDashboard';
import CustomerPortal from '../features/CustomerPortal';

/* ── Constants ── */
const ROLE_DEFAULT_ROUTES = {
    SUPPORT_LEAD: '/support-lead',
    SUPPORT_MANAGER: '/support-manager',
    VP_CUSTOMER_SUCCESS: '/vp',
    LEGAL_COMPLIANCE: '/legal',
    ADMIN_OPS: '/admin',
    CUSTOMER: '/customer',
};

const ROLE_INFO = {
    SUPPORT_LEAD: { label: 'Support Lead', desc: 'Ticket triage, SLA tracking & HIL review', color: '#6B8EF0', Icon: Ticket },
    SUPPORT_MANAGER: { label: 'Support Manager', desc: 'Team oversight, sentiment & KB publishing', color: '#5929d0', Icon: Users },
    VP_CUSTOMER_SUCCESS: { label: 'VP Customer Success', desc: 'Executive dashboard, VoC & override controls', color: '#A855F7', Icon: TrendingUp },
    LEGAL_COMPLIANCE: { label: 'Legal & Compliance', desc: 'Legal queue, comms gating & audit logs', color: '#01CAB8', Icon: Scale },
    ADMIN_OPS: { label: 'Admin Ops', desc: 'Integrations, channel health & diagnostics', color: '#8B5CF6', Icon: Settings },
    CUSTOMER: { label: 'Customer', desc: 'Submit tickets, track status & view your portal', color: '#CF008B', Icon: UserRound },
};

/* ── Desktop clock ── */
const DesktopClock = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div style={{ textAlign: 'center', lineHeight: 1.25 }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
                {now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
        </div>
    );
};

/* ── Ubuntu-style desktop topbar ── */
const DesktopTopbar = () => (
    <div className="desktop-topbar">
        <div className="desktop-topbar-left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#5929d0" />
                <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.22" />
                <circle cx="12" cy="7" r="2" fill="#fff" opacity="0.85" />
                <circle cx="16.5" cy="14.5" r="2" fill="#fff" opacity="0.85" />
                <circle cx="7.5" cy="14.5" r="2" fill="#fff" opacity="0.85" />
            </svg>
            <span className="desktop-topbar-label">Activities</span>
        </div>

        <DesktopClock />

        <div className="desktop-topbar-right">
            {/* WiFi */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M1 6.5C5.5 2 18.5 2 23 6.5" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
                <path d="M4.5 10C7.5 7 16.5 7 19.5 10" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 13.5C9.5 12 14.5 12 16 13.5" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1.5" fill="rgba(255,255,255,0.55)" />
            </svg>
            {/* Volume */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            {/* Power */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v6" /><path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
            </svg>
        </div>
    </div>
);

/* ── Office + app icons for dock ── */
const WordIcon = () => (
    <svg viewBox="0 0 44 44" width="26" height="26">
        <rect width="44" height="44" rx="10" fill="#185ABD" />
        <path d="M8 12h5l3 11 3-9 3 9 3-11h5l-5 16H20l-3-9-3 9h-4z" fill="white" />
    </svg>
);
const PPTIcon = () => (
    <svg viewBox="0 0 44 44" width="26" height="26">
        <rect width="44" height="44" rx="10" fill="#C43E1C" />
        <path d="M9 11h13c2.8 0 5 2.2 5 5s-2.2 5-5 5h-7v8H9V11zm6 4v6h6c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-6z" fill="white" />
    </svg>
);
const ExcelIcon = () => (
    <svg viewBox="0 0 44 44" width="26" height="26">
        <rect width="44" height="44" rx="10" fill="#107C41" />
        <path d="M12 11l5 9-5 9h4l3-5.5 3 5.5h4l-5-9 5-9h-4l-3 5.5-3-5.5z" fill="white" />
    </svg>
);
const AegisDockIcon = () => (
    <svg viewBox="0 0 44 44" width="26" height="26">
        <defs>
            <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5929d0" />
                <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#dg)" />
        <path d="M22 7L13 12v7c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12v-7z" fill="white" opacity="0.95" />
        <path d="M22 13L17 16v4.5c0 3 2 5.8 5 7 3-1.2 5-4 5-7V16z" fill="#5929d0" opacity="0.5" />
    </svg>
);

/* ── Bottom dock ── */
const BottomDock = ({ aegisOpen, aegisMinimized, onAegisClick }) => {
    const [hovered, setHovered] = useState(null);
    const [bouncing, setBouncing] = useState(null);

    const launchOffice = (label, url) => {
        setBouncing(label);
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(() => setBouncing(null), 650);
    };

    const handleAegis = () => {
        setBouncing('aegis');
        setTimeout(() => { setBouncing(null); onAegisClick(); }, 300);
    };

    const itemStyle = (key) => ({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: '6px',
        transition: 'transform 0.18s',
        transform: bouncing === key
            ? 'translateY(-10px)'
            : hovered === key
                ? 'translateY(-4px) scale(1.1)'
                : 'none',
    });

    const tip = (label, key) =>
        hovered === key ? (
            <div style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.8)', color: '#fff',
                padding: '3px 10px', borderRadius: '6px',
                fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 10,
            }}>{label}</div>
        ) : null;

    const office = [
        { key: 'word', label: 'Word', icon: <WordIcon />, url: 'https://www.microsoft365.com/launch/word' },
        { key: 'ppt', label: 'PowerPoint', icon: <PPTIcon />, url: 'https://www.microsoft365.com/launch/powerpoint' },
        { key: 'xl', label: 'Excel', icon: <ExcelIcon />, url: 'https://www.microsoft365.com/launch/excel' },
    ];

    return (
        <div className="bottom-dock">
            {office.map(app => (
                <button
                    key={app.key}
                    style={itemStyle(app.key)}
                    onMouseEnter={() => setHovered(app.key)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => launchOffice(app.key, app.url)}
                >
                    {app.icon}
                    {tip(app.label, app.key)}
                </button>
            ))}

            <div className="bottom-dock-sep" />

            {/* aegis.ai */}
            <button
                style={itemStyle('aegis')}
                onMouseEnter={() => setHovered('aegis')}
                onMouseLeave={() => setHovered(null)}
                onClick={handleAegis}
            >
                <AegisDockIcon />
                {/* Running dot */}
                {aegisOpen && (
                    <div style={{
                        width: '4px', height: '4px', borderRadius: '50%',
                        background: aegisMinimized ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
                    }} />
                )}
                {tip('aegis.ai', 'aegis')}
            </button>
        </div>
    );
};

/* ── macOS-style app window ── */
const AppWindow = ({ children, isMaximized, onClose, onMinimize, onMaximize }) => {
    const windowRef = useRef(null);
    const [pos, setPos] = useState({ x: null, y: null });
    const dragging = useRef(false);
    const dragOrigin = useRef(null);

    const startDrag = (e) => {
        if (isMaximized) return;
        e.preventDefault();
        const rect = windowRef.current.getBoundingClientRect();
        if (pos.x === null) setPos({ x: rect.left, y: rect.top });
        dragOrigin.current = {
            mouseX: e.clientX, mouseY: e.clientY,
            winX: rect.left, winY: rect.top,
        };
        dragging.current = true;
    };

    useEffect(() => {
        const onMove = (e) => {
            if (!dragging.current || !dragOrigin.current) return;
            const { mouseX, mouseY, winX, winY } = dragOrigin.current;
            setPos({
                x: winX + (e.clientX - mouseX),
                y: Math.max(32, winY + (e.clientY - mouseY)),
            });
        };
        const onUp = () => { dragging.current = false; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    const inlineStyle = isMaximized
        ? {}
        : pos.x !== null
            ? { left: pos.x, top: pos.y, transform: 'none' }
            : {};

    return (
        <div
            ref={windowRef}
            className={`app-window${isMaximized ? ' maximized' : ''}`}
            style={inlineStyle}
        >
            {/* Title bar with 3 buttons */}
            <div className="win-titlebar" onMouseDown={startDrag}>
                <div className="win-controls">
                    <button
                        className="win-btn wc-close"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onClose}
                        title="Close"
                    >
                        <svg className="win-btn-icon" viewBox="0 0 10 10" fill="none">
                            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        className="win-btn wc-minimize"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onMinimize}
                        title="Minimize"
                    >
                        <svg className="win-btn-icon" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        className="win-btn wc-maximize"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onMaximize}
                        title={isMaximized ? 'Restore' : 'Maximize'}
                    >
                        <svg className="win-btn-icon" viewBox="0 0 10 10" fill="none">
                            {isMaximized
                                ? <path d="M3 2h5v5M7 3l-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                : <path d="M2 2h6v6H2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                            }
                        </svg>
                    </button>
                </div>
                <span className="win-title">aegis.ai — Customer Intelligence Platform</span>
            </div>

            {/* Window content */}
            <div className="win-body">
                {children}
            </div>
        </div>
    );
};

/* ── Welcome screen shown inside aegis window when no role ── */
const WelcomeScreen = () => {
    const { rolesList, setRole } = useAuth();

    return (
        <div className="welcome-screen">
            {/* Hero */}
            <div className="welcome-hero">
                <div className="welcome-shield">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6z" />
                    </svg>
                </div>
                <h1 className="welcome-title">Welcome to aegis.ai</h1>
                <p className="welcome-sub">Select your role profile to get started</p>
            </div>

            {/* Role cards */}
            <div className="welcome-role-grid">
                {rolesList.map((r) => {
                    const info = ROLE_INFO[r.id] || { label: r.name, desc: '', color: '#5929d0', Icon: Users };
                    const { Icon } = info;
                    return (
                        <button
                            key={r.id}
                            className="welcome-role-card"
                            onClick={() => setRole(r.id)}
                        >
                            <div
                                className="role-card-icon"
                                style={{ background: info.color + '18', color: info.color }}
                            >
                                <Icon size={22} />
                            </div>
                            <div className="role-card-text">
                                <div className="role-card-name">{info.label}</div>
                                <div className="role-card-desc">{info.desc}</div>
                            </div>
                            <svg
                                className="role-card-arrow"
                                width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            >
                                <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/* ── Route helpers ── */
const RoleRedirect = () => {
    const { role } = useAuth();
    if (!role) return <Navigate to="/" replace />;
    return <Navigate to={ROLE_DEFAULT_ROUTES[role] || '/'} replace />;
};

const P = ({ permission, permissions, children }) => (
    <ProtectedComponent permission={permission} permissions={permissions} fallback={<RoleRedirect />}>
        <div className="route-page">{children}</div>
    </ProtectedComponent>
);

/* ── Full aegis app (rendered inside window) ── */
const AegisApp = () => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const prevRole = useRef(null);

    useEffect(() => {
        if (role && prevRole.current !== role) {
            prevRole.current = role;
            navigate(ROLE_DEFAULT_ROUTES[role], { replace: true });
        }
        if (!role && prevRole.current) {
            prevRole.current = null;
            navigate('/', { replace: true });
        }
    }, [role, navigate]);

    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<WelcomeScreen />} />
                <Route path="/support-lead" element={<Dashboard />} />
                <Route path="/support-manager" element={<Dashboard />} />
                <Route path="/vp" element={<Dashboard />} />
                <Route path="/legal" element={<Dashboard />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/customer" element={<Dashboard />} />

                <Route path="/support-lead/tickets" element={<P permission="VIEW_TICKETS"><LiveTicketQueue /></P>} />
                <Route path="/support-lead/sla" element={<P permission="VIEW_SLA"><SLACompliance /></P>} />
                <Route path="/support-lead/kb" element={<P permissions={["DRAFT_KB", "PUBLISH_KB", "VIEW_KB"]}><KBPanel /></P>} />
                <Route path="/support-lead/hil" element={<P permissions={["VIEW_HIL_STATUS", "APPROVE_HIL"]}><HILReviewQueue /></P>} />

                <Route path="/support-manager/sentiment" element={<P permission="VIEW_SENTIMENT"><SentimentFeed /></P>} />
                <Route path="/support-manager/hil" element={<P permissions={["VIEW_HIL_STATUS", "APPROVE_HIL"]}><HILReviewQueue /></P>} />
                <Route path="/support-manager/kb" element={<P permissions={["DRAFT_KB", "PUBLISH_KB", "VIEW_KB"]}><KBPanel /></P>} />
                <Route path="/support-manager/voc" element={<P permission="VIEW_VOC"><VocPanel /></P>} />

                <Route path="/vp/exec" element={<P permission="VIEW_EXEC_DASH"><ExecutiveDashboard /></P>} />
                <Route path="/vp/voc" element={<P permission="VIEW_VOC"><VocPanel /></P>} />
                <Route path="/vp/hil" element={<P permission="APPROVE_HIL_OVERRIDE"><HILReviewQueue /></P>} />

                <Route path="/legal/queue" element={<P permission="VIEW_LEGAL_TICKETS"><LegalComplianceDashboard /></P>} />
                <Route path="/legal/hil" element={<P permission="MANAGE_LEGAL_CORRESPONDENCE"><HILReviewQueue /></P>} />
                <Route path="/legal/kb" element={<P permission="VIEW_KB"><KBPanel /></P>} />

                <Route path="/admin/integrations" element={<P permission="MANAGE_INTEGRATIONS"><IntegrationPanel /></P>} />
                <Route path="/admin/channels" element={<P permission="VIEW_CHANNEL_VOL"><SentimentFeed /></P>} />

                <Route path="/customer/portal" element={<P permission="VIEW_CUSTOMER_PORTAL"><CustomerPortal /></P>} />

                <Route path="*" element={<RoleRedirect />} />
            </Routes>
        </MainLayout>
    );
};

/* ── Desktop shell ── */
const Desktop = () => {
    const { setRole } = useAuth();
    const navigate = useNavigate();
    const [aegisOpen, setAegisOpen] = useState(false);
    const [aegisMinimized, setAegisMinimized] = useState(false);
    const [aegisMaximized, setAegisMaximized] = useState(false);

    const openAegis = () => {
        setAegisOpen(true);
        setAegisMinimized(false);
    };

    const closeAegis = () => {
        setAegisOpen(false);
        setAegisMaximized(false);
        setAegisMinimized(false);
        setRole(null);
        navigate('/', { replace: true });
    };

    const handleDockClick = () => {
        if (!aegisOpen) { openAegis(); return; }
        setAegisMinimized(v => !v);
    };

    return (
        <div className="desktop-shell">
            {/* Background glows */}
            <div className="desktop-glows" />

            {/* Wavy decorative lines */}
            <svg className="desktop-waves" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#01CAB8" />
                    </linearGradient>
                    <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#CF008B" />
                        <stop offset="100%" stopColor="#6B8EF0" />
                    </linearGradient>
                </defs>
                <path d="M-100,200 C200,100 400,300 700,180 S1100,60 1400,200 S1900,320 2200,200" fill="none" stroke="url(#wg1)" strokeWidth="1.5" opacity="0.18" />
                <path d="M-100,400 C200,280 450,520 750,380 S1150,240 1500,400 S1900,520 2200,400" fill="none" stroke="url(#wg2)" strokeWidth="1.5" opacity="0.15" />
                <path d="M-100,600 C250,480 500,700 800,560 S1200,420 1550,600 S1950,720 2250,600" fill="none" stroke="url(#wg1)" strokeWidth="1" opacity="0.12" />
                <path d="M-100,100 C300,40  550,160 850,80  S1250,0   1600,100 S2000,180 2300,100" fill="none" stroke="url(#wg2)" strokeWidth="1" opacity="0.10" />
            </svg>

            {/* Ubuntu topbar */}
            <DesktopTopbar />

            {/* Aegis app window */}
            {aegisOpen && !aegisMinimized && (
                <AppWindow
                    isMaximized={aegisMaximized}
                    onClose={closeAegis}
                    onMinimize={() => setAegisMinimized(true)}
                    onMaximize={() => setAegisMaximized(v => !v)}
                >
                    <AegisApp />
                </AppWindow>
            )}

            {/* Bottom dock */}
            <BottomDock
                aegisOpen={aegisOpen}
                aegisMinimized={aegisMinimized}
                onAegisClick={handleDockClick}
            />
        </div>
    );
};

export default Desktop;
