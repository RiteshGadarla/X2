import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth-context';

const ROLE_DEFAULT_ROUTES = {
    SUPPORT_LEAD:        '/tickets',
    SUPPORT_MANAGER:     '/sentiment',
    VP_CUSTOMER_SUCCESS: '/exec',
    LEGAL_COMPLIANCE:    '/legal',
    ADMIN_OPS:           '/integrations',
    CUSTOMER:            '/portal',
};

const WALLPAPER = 'linear-gradient(135deg, #060314 0%, #0E0828 35%, #140530 60%, #0A1020 100%)';

// Role-specific taskbar icon sets
const ROLE_ICONS = {
    SUPPORT_LEAD: [
        { label: 'Queues', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
        { label: 'Tickets', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
        { label: 'SLA', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        { label: 'KB Draft', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
    ],
    SUPPORT_MANAGER: [
        { label: 'All Queues', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
        { label: 'HIL Approvals', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
        { label: 'CSAT', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
        { label: 'KB Publish', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    ],
    VP_CUSTOMER_SUCCESS: [
        { label: 'Exec Dashboard', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
        { label: 'SLA Exceptions', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
        { label: 'VIP Override', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
        { label: 'Escalation', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="17 11 21 7 17 3"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 21 3 17 7 13"/><line x1="15" y1="17" x2="3" y2="17"/></svg> },
    ],
    LEGAL_COMPLIANCE: [
        { label: 'Legal Queue', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
        { label: 'Compliance', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="11" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
        { label: 'Comms Gate', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
        { label: 'Audit Log', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
    ],
    ADMIN_OPS: [
        { label: 'Integrations', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
        { label: 'Channel Health', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
        { label: 'Diagnostics', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
        { label: 'Config', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    ],
    CUSTOMER: [
        { label: 'Submit Ticket', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
        { label: 'Track Status', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
        { label: 'SLA View', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        { label: 'Human Support', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ],
};

const ROLE_COLORS = {
    SUPPORT_LEAD:       '#6B8EF0',
    SUPPORT_MANAGER:    '#5929d0',
    VP_CUSTOMER_SUCCESS:'#A855F7',
    LEGAL_COMPLIANCE:   '#01CAB8',
    ADMIN_OPS:          '#8B5CF6',
    CUSTOMER:           '#CF008B',
};

const UbuntuClock = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    return (
        <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
            <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.8)', fontWeight: 600 }}>{time}</div>
            <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.45)' }}>{date}</div>
        </div>
    );
};

const Topbar = () => {
    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '30px',
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 14px', zIndex: 10, userSelect: 'none',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#5929d0" />
                    <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.25" />
                    <circle cx="12" cy="7"   r="2" fill="#fff" opacity="0.8" />
                    <circle cx="16.5" cy="14.5" r="2" fill="#fff" opacity="0.8" />
                    <circle cx="7.5"  cy="14.5" r="2" fill="#fff" opacity="0.8" />
                </svg>
                <span style={{ color: 'rgba(0,0,0,0.72)', fontSize: '11px', fontWeight: 600 }}>Activities</span>
            </div>

            <UbuntuClock />

            {/* Right: system tray */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(0,0,0,0.55)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M1 6.5C5.5 2 18.5 2 23 6.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M4.5 10C7.5 7 16.5 7 19.5 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M8 13.5C9.5 12 14.5 12 16 13.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <circle cx="12" cy="17" r="1.5" fill="currentColor"/>
                </svg>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2v6"/><path d="M6.3 6.3a8 8 0 1 0 11.4 0"/>
                </svg>
            </div>
        </div>
    );
};

const LoginWindow = ({ roles, onLogin, loading, error, selectedId, setSelectedId }) => {
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState(null);

    const accentColor = selectedId ? (ROLE_COLORS[selectedId] || '#5929d0') : '#5929d0';

    const onMouseDown = (e) => {
        setDragging(true);
        setDragStart({ mx: e.clientX - pos.x, my: e.clientY - pos.y });
    };
    useEffect(() => {
        if (!dragging) return;
        const move = (e) => setPos({ x: e.clientX - dragStart.mx, y: e.clientY - dragStart.my });
        const up = () => setDragging(false);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    }, [dragging, dragStart]);

    return (
        <div style={{
            position: 'absolute', top: `calc(50% + ${pos.y}px)`, left: `calc(50% + ${pos.x}px)`,
            transform: 'translate(-50%, -50%)',
            width: '360px',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            boxShadow: `0 20px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)`,
            overflow: 'hidden',
            zIndex: 20,
            userSelect: 'none',
            transition: 'box-shadow 0.3s',
        }}>
            {/* Title bar */}
            <div onMouseDown={onMouseDown} style={{
                background: 'rgba(238,238,238,0.92)',
                height: '32px', display: 'flex', alignItems: 'center',
                padding: '0 12px', gap: '8px', cursor: 'grab',
                borderBottom: '1px solid rgba(0,0,0,0.07)', position: 'relative',
            }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} />
                <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: 'rgba(0,0,0,0.38)', fontWeight: 500, pointerEvents: 'none' }}>
                    Customer Support Agent
                </span>
            </div>

            <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                {/* Avatar — color transitions with role */}
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 0 4px ${accentColor}22, 0 4px 16px ${accentColor}33`,
                    transition: 'background 0.3s, box-shadow 0.3s',
                }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 2L4 6v6c0 5.5 3.5 10 8 12 4.5-2 8-6.5 8-12V6z"/>
                    </svg>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#1a1a1a', fontWeight: 700, fontSize: '15px' }}>aegis.ai</div>
                    <div style={{ color: 'rgba(0,0,0,0.42)', fontSize: '11px', marginTop: '3px' }}>Select your access profile to continue</div>
                </div>

                <div style={{ width: '100%' }}>
                    <select
                        id="global_select_role_dropdown"
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '9px 12px', borderRadius: '7px',
                            background: '#f5f5f5',
                            border: `1.5px solid ${selectedId ? accentColor + '55' : 'rgba(0,0,0,0.13)'}`,
                            color: selectedId ? '#1a1a1a' : 'rgba(0,0,0,0.35)',
                            fontSize: '13px', outline: 'none', cursor: 'pointer',
                            transition: 'border-color 0.25s',
                        }}
                    >
                        <option value="" disabled>{loading ? 'Loading roles…' : 'Choose a role profile'}</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>

                {error && <div style={{ color: '#c0392b', fontSize: '11px', textAlign: 'center' }}>{error}</div>}

                <button
                    id="global_login_btn"
                    onClick={() => selectedId && onLogin(selectedId)}
                    disabled={!selectedId || loading}
                    style={{
                        width: '100%', padding: '10px', borderRadius: '7px', border: 'none',
                        background: selectedId ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` : '#e8e8e8',
                        color: selectedId ? '#fff' : 'rgba(0,0,0,0.3)',
                        fontWeight: 600, fontSize: '13px', cursor: selectedId ? 'pointer' : 'not-allowed',
                        transition: 'background 0.3s, box-shadow 0.3s', letterSpacing: '0.3px',
                        boxShadow: selectedId ? `0 2px 10px ${accentColor}44` : 'none',
                    }}
                >
                    {loading ? 'Authenticating…' : 'Log In'}
                </button>
            </div>
        </div>
    );
};

const RoleSelector = () => {
    const { rolesList, setRole, rolesLoading, rolesError } = useAuth();
    const [selectedId, setSelectedId] = useState('');
    const navigate = useNavigate();

    const handleLogin = (roleId) => {
        setRole(roleId);
        navigate(ROLE_DEFAULT_ROUTES[roleId] || '/');
    };

    return (
        <div style={{
            position: 'relative', width: '100vw', height: '100vh',
            background: WALLPAPER, overflow: 'hidden',
            fontFamily: 'Ubuntu, "Segoe UI", sans-serif',
        }}>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            {/* Radial colour glows */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(ellipse at 15% 55%, rgba(168,85,247,0.30) 0%, transparent 50%), radial-gradient(ellipse at 80% 15%, rgba(207,0,139,0.22) 0%, transparent 45%), radial-gradient(ellipse at 65% 90%, rgba(1,202,184,0.18) 0%, transparent 40%), radial-gradient(ellipse at 50% 40%, rgba(89,41,208,0.15) 0%, transparent 55%)',
                pointerEvents: 'none',
            }} />

            {/* Wavy SVG pattern */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.13 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#A855F7"/>
                        <stop offset="50%"  stopColor="#6B8EF0"/>
                        <stop offset="100%" stopColor="#01CAB8"/>
                    </linearGradient>
                    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#CF008B"/>
                        <stop offset="50%"  stopColor="#A855F7"/>
                        <stop offset="100%" stopColor="#6B8EF0"/>
                    </linearGradient>
                </defs>
                {/* Wave set 1 */}
                <path d="M-100,180 C150,80 350,280 600,160 S1000,60 1300,180 S1700,300 2000,180" fill="none" stroke="url(#waveGrad1)" strokeWidth="2"/>
                <path d="M-100,220 C150,120 350,320 600,200 S1000,100 1300,220 S1700,340 2000,220" fill="none" stroke="url(#waveGrad1)" strokeWidth="1.5"/>
                <path d="M-100,260 C150,160 350,360 600,240 S1000,140 1300,260 S1700,380 2000,260" fill="none" stroke="url(#waveGrad2)" strokeWidth="1"/>
                {/* Wave set 2 */}
                <path d="M-100,420 C200,300 400,520 700,380 S1100,260 1400,420 S1800,540 2100,420" fill="none" stroke="url(#waveGrad2)" strokeWidth="2"/>
                <path d="M-100,460 C200,340 400,560 700,420 S1100,300 1400,460 S1800,580 2100,460" fill="none" stroke="url(#waveGrad1)" strokeWidth="1.5"/>
                <path d="M-100,500 C200,380 400,600 700,460 S1100,340 1400,500 S1800,620 2100,500" fill="none" stroke="url(#waveGrad2)" strokeWidth="1"/>
                {/* Wave set 3 */}
                <path d="M-100,620 C250,500 450,700 750,560 S1150,440 1500,620 S1900,740 2200,620" fill="none" stroke="url(#waveGrad1)" strokeWidth="2"/>
                <path d="M-100,660 C250,540 450,740 750,600 S1150,480 1500,660 S1900,780 2200,660" fill="none" stroke="url(#waveGrad2)" strokeWidth="1.5"/>
                {/* Thin accent waves */}
                <path d="M-100,80  C300,20  500,160 800,60  S1200,0   1600,80  S2000,160 2300,80"  fill="none" stroke="url(#waveGrad2)" strokeWidth="1" opacity="0.6"/>
                <path d="M-100,760 C300,680 500,820 800,720 S1200,640 1600,760 S2000,840 2300,760" fill="none" stroke="url(#waveGrad1)" strokeWidth="1" opacity="0.6"/>
            </svg>

            <Topbar />
            <LoginWindow
                roles={rolesList}
                onLogin={handleLogin}
                loading={rolesLoading}
                error={rolesError}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
        </div>
    );
};

export default RoleSelector;
