import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
    Ticket, Users, UserRound, TrendingUp, Settings, Scale
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

const DesktopClock = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            textAlign: 'right',
            color: 'white',
            zIndex: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            userSelect: 'none'
        }}>
            <div style={{ fontSize: '72px', fontWeight: '200', lineHeight: 1 }}>
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '400', opacity: 0.8, marginTop: '8px' }}>
                {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
};

// Extracted desktop components
import AppWindow from './desktop/AppWindow';
import BottomDock from './desktop/BottomDock';
import ReportingCenterWindow from './desktop/ReportingCenterWindow';
import NotesWindow from './desktop/NotesWindow';

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
    SUPPORT_LEAD: { label: 'Support Lead', desc: 'Ticket triage, SLA tracking & review', color: '#6B8EF0', Icon: Ticket },
    SUPPORT_MANAGER: { label: 'Support Manager', desc: 'Team oversight, sentiment & KB publishing', color: '#5929d0', Icon: Users },
    VP_CUSTOMER_SUCCESS: { label: 'VP Customer Success', desc: 'Executive dashboard, VoC & override controls', color: '#A855F7', Icon: TrendingUp },
    LEGAL_COMPLIANCE: { label: 'Legal & Compliance', desc: 'Legal queue, comms gating & audit logs', color: '#01CAB8', Icon: Scale },
    ADMIN_OPS: { label: 'Admin Ops', desc: 'Integrations, channel health & diagnostics', color: '#8B5CF6', Icon: Settings },
    CUSTOMER: { label: 'Customer', desc: 'Submit tickets, track status & view your portal', color: '#CF008B', Icon: UserRound },
};

/* ── Welcome screen shown inside aegis window when no role ── */
const WelcomeScreen = () => {
    const { rolesList, setRole } = useAuth();

    return (
        <div className="welcome-screen">
            <div className="welcome-hero">
                <div className="welcome-shield">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6z" />
                    </svg>
                </div>
                <h1 className="welcome-title">Welcome to aegis.ai</h1>
                <p className="welcome-sub">Select your role profile to get started</p>
            </div>

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
                <Route path="/support-lead/review" element={<P permissions={["VIEW_HIL_STATUS", "APPROVE_HIL"]}><HILReviewQueue /></P>} />

                <Route path="/support-manager/sentiment" element={<P permission="VIEW_SENTIMENT"><SentimentFeed /></P>} />
                <Route path="/support-manager/review" element={<P permissions={["VIEW_HIL_STATUS", "APPROVE_HIL"]}><HILReviewQueue /></P>} />
                <Route path="/support-manager/kb" element={<P permissions={["DRAFT_KB", "PUBLISH_KB", "VIEW_KB"]}><KBPanel /></P>} />
                <Route path="/support-manager/voc" element={<P permission="VIEW_VOC"><VocPanel /></P>} />

                <Route path="/vp/exec" element={<P permission="VIEW_EXEC_DASH"><ExecutiveDashboard /></P>} />
                <Route path="/vp/voc" element={<P permission="VIEW_VOC"><VocPanel /></P>} />
                <Route path="/vp/review" element={<P permission="APPROVE_HIL_OVERRIDE"><HILReviewQueue /></P>} />

                <Route path="/legal/queue" element={<P permission="VIEW_LEGAL_TICKETS"><LegalComplianceDashboard /></P>} />
                <Route path="/legal/review" element={<P permission="MANAGE_LEGAL_CORRESPONDENCE"><HILReviewQueue /></P>} />
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
    const [reportsOpen, setReportsOpen] = useState(false);
    const [reportsMinimized, setReportsMinimized] = useState(false);
    const [reportsMaximized, setReportsMaximized] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);
    const [notesMinimized, setNotesMinimized] = useState(false);
    const [notesMaximized, setNotesMaximized] = useState(false);
    const [activeApp, setActiveApp] = useState('aegis');

    const openAegis = () => {
        setAegisOpen(true);
        setAegisMinimized(false);
        setAegisMaximized(true);
        setActiveApp('aegis');
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
        if (aegisMinimized) {
            setAegisMinimized(false);
            setActiveApp('aegis');
        } else if (activeApp !== 'aegis') {
            setActiveApp('aegis');
        } else {
            setAegisMinimized(true);
        }
    };

    const openReports = () => {
        setReportsOpen(true);
        setReportsMinimized(false);
        setActiveApp('reports');
    };

    const closeReports = () => {
        setReportsOpen(false);
        setReportsMaximized(false);
        setReportsMinimized(false);
    };

    const handleReportsDockClick = () => {
        if (!reportsOpen) { openReports(); return; }
        if (reportsMinimized) {
            setReportsMinimized(false);
            setActiveApp('reports');
        } else if (activeApp !== 'reports') {
            setActiveApp('reports');
        } else {
            setReportsMinimized(true);
        }
    };

    const openNotes = () => {
        setNotesOpen(true);
        setNotesMinimized(false);
        setActiveApp('notes');
    };

    const closeNotes = () => {
        setNotesOpen(false);
        setNotesMaximized(false);
        setNotesMinimized(false);
    };

    const handleNotesDockClick = () => {
        if (!notesOpen) { openNotes(); return; }
        if (notesMinimized) {
            setNotesMinimized(false);
            setActiveApp('notes');
        } else if (activeApp !== 'notes') {
            setActiveApp('notes');
        } else {
            setNotesMinimized(true);
        }
    };

    return (
        <div className="desktop-shell">
            <DesktopClock />

            {/* Desktop Branding */}
            <div style={{
                position: 'absolute',
                top: '40px',
                left: '60px',
                color: 'white',
                zIndex: 0,
                pointerEvents: 'none',
                userSelect: 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '0.02em' }}>
                            Aegis AI
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '500', opacity: 0.6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Customer Support Management
                        </div>
                    </div>
                </div>
            </div>

            {/* Background glows */}
            <div className="desktop-glows" />

            {/* Wavy decorative lines */}
            <svg className="desktop-waves" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#bae6fd" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#7dd3fc" />
                    </linearGradient>
                </defs>
                <path d="M-100,200 C200,100 400,300 700,180 S1100,60 1400,200 S1900,320 2200,200" fill="none" stroke="url(#wg1)" strokeWidth="1.5" opacity="0.18" />
                <path d="M-100,400 C200,280 450,520 750,380 S1150,240 1500,400 S1900,520 2200,400" fill="none" stroke="url(#wg2)" strokeWidth="1.5" opacity="0.15" />
                <path d="M-100,600 C250,480 500,700 800,560 S1200,420 1550,600 S1950,720 2250,600" fill="none" stroke="url(#wg1)" strokeWidth="1" opacity="0.12" />
                <path d="M-100,100 C300,40  550,160 850,80  S1250,0   1600,100 S2000,180 2300,100" fill="none" stroke="url(#wg2)" strokeWidth="1" opacity="0.10" />
            </svg>

            {/* Reporting Center window */}
            {reportsOpen && !reportsMinimized && (
                <ReportingCenterWindow
                    isMaximized={reportsMaximized}
                    onClose={closeReports}
                    onMinimize={() => setReportsMinimized(true)}
                    onMaximize={() => setReportsMaximized(v => !v)}
                    zIndex={activeApp === 'reports' ? 10 : 1}
                    onFocus={() => setActiveApp('reports')}
                />
            )}

            {/* Notes window */}
            {notesOpen && !notesMinimized && (
                <NotesWindow
                    isMaximized={notesMaximized}
                    onClose={closeNotes}
                    onMinimize={() => setNotesMinimized(true)}
                    onMaximize={() => setNotesMaximized(v => !v)}
                    zIndex={activeApp === 'notes' ? 10 : 1}
                    onFocus={() => setActiveApp('notes')}
                />
            )}

            {/* Aegis app window */}
            {aegisOpen && !aegisMinimized && (
                <AppWindow
                    title="aegis.ai — Customer Intelligence Platform"
                    isMaximized={aegisMaximized}
                    onClose={closeAegis}
                    onMinimize={() => setAegisMinimized(true)}
                    onMaximize={() => setAegisMaximized(v => !v)}
                    zIndex={activeApp === 'aegis' ? 10 : 1}
                    onFocus={() => setActiveApp('aegis')}
                >
                    <AegisApp />
                </AppWindow>
            )}

            {/* Bottom dock */}
            <BottomDock
                aegisOpen={aegisOpen}
                aegisMinimized={aegisMinimized}
                onAegisClick={handleDockClick}
                reportsOpen={reportsOpen}
                reportsMinimized={reportsMinimized}
                onReportsClick={handleReportsDockClick}
                notesOpen={notesOpen}
                notesMinimized={notesMinimized}
                onNotesClick={handleNotesDockClick}
            />
        </div>
    );
};

export default Desktop;
