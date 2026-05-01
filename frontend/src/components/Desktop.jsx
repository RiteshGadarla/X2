import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

    const fmtTime = (tz) => now.toLocaleTimeString('en-GB', {
        timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
    });
    const fmtDay = (tz) => now.toLocaleDateString('en-US', {
        timeZone: tz, weekday: 'short'
    });
    const fmtDate = (tz) => now.toLocaleDateString('en-US', {
        timeZone: tz, month: 'short', day: 'numeric', year: 'numeric'
    });

    const Zone = ({ label, tz }) => (
        <div style={{ textAlign: 'center', minWidth: '170px' }}>
            <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                opacity: 0.6,
                textTransform: 'uppercase',
                marginBottom: '6px'
            }}>{label}</div>
            <div style={{
                fontSize: '56px',
                fontWeight: 200,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.02em'
            }}>{fmtTime(tz)}</div>
            <div style={{
                fontSize: '13px',
                fontWeight: 500,
                opacity: 0.75,
                marginTop: '10px',
                letterSpacing: '0.05em'
            }}>
                {fmtDay(tz)} · {fmtDate(tz)}
            </div>
        </div>
    );

    return (
        <div style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            color: 'white',
            zIndex: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'stretch',
            gap: '28px'
        }}>
            <Zone label="GMT" tz="UTC" />
            <div style={{
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent)'
            }} />
            <Zone label="IST" tz="Asia/Kolkata" />
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
                <Route path="/" element={<Navigate to="/support-lead" replace />} />
                <Route path="/support-lead" element={<div className="route-page"><Dashboard /></div>} />
                <Route path="/support-manager" element={<div className="route-page"><Dashboard /></div>} />
                <Route path="/vp" element={<div className="route-page"><Dashboard /></div>} />
                <Route path="/legal" element={<div className="route-page"><Dashboard /></div>} />
                <Route path="/admin" element={<div className="route-page"><Dashboard /></div>} />
                <Route path="/customer" element={<div className="route-page"><Dashboard /></div>} />

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
        setRole('SUPPORT_LEAD');
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

            {/* Mesh gradient wallpaper + subtle support motifs */}
            <svg className="desktop-wallpaper" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="orb3" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="orb4" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="orb5" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.40" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="meshBlur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="80" />
                    </filter>
                    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.05" />
                    </pattern>
                </defs>

                {/* Mesh gradient orbs (heavily blurred, blended) */}
                <g filter="url(#meshBlur)">
                    <circle cx="180" cy="180" r="320" fill="url(#orb2)" />
                    <circle cx="1260" cy="160" r="380" fill="url(#orb1)" />
                    <circle cx="320" cy="780" r="360" fill="url(#orb3)" />
                    <circle cx="1180" cy="760" r="340" fill="url(#orb5)" />
                    <circle cx="760" cy="460" r="420" fill="url(#orb4)" />
                </g>

                {/* Soft dot grid for texture */}
                <rect x="0" y="0" width="1440" height="900" fill="url(#dots)" />

                {/* Subtle support motif — concentric "signal" rings */}
                <g stroke="#7dd3fc" fill="none" opacity="0.10">
                    <circle cx="1180" cy="720" r="60" strokeWidth="1" />
                    <circle cx="1180" cy="720" r="120" strokeWidth="1" />
                    <circle cx="1180" cy="720" r="190" strokeWidth="1" />
                    <circle cx="1180" cy="720" r="270" strokeWidth="1" />
                </g>
                <g stroke="#a5b4fc" fill="none" opacity="0.08">
                    <circle cx="220" cy="220" r="70" strokeWidth="1" />
                    <circle cx="220" cy="220" r="140" strokeWidth="1" />
                    <circle cx="220" cy="220" r="220" strokeWidth="1" />
                </g>

                {/* Faint chat-bubble silhouettes (support theme, very subtle) */}
                <g fill="#ffffff" opacity="0.04">
                    <path d="M880,640 q0,-40 40,-40 l140,0 q40,0 40,40 l0,60 q0,40 -40,40 l-90,0 l-30,28 l0,-28 l-20,0 q-40,0 -40,-40 z" />
                    <path d="M340,420 q0,-32 32,-32 l110,0 q32,0 32,32 l0,48 q0,32 -32,32 l-72,0 l-24,22 l0,-22 l-14,0 q-32,0 -32,-32 z" />
                </g>
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
                    testId="aegis-window"
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
