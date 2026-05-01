import { useState, useEffect } from 'react';
import { useAuth } from '../state/auth-context';


const WALLPAPER = 'linear-gradient(135deg, #060314 0%, #0E0828 35%, #140530 60%, #0A1020 100%)';

const ROLE_COLORS = {
    SUPPORT_LEAD:       '#6B8EF0',
    SUPPORT_MANAGER:    '#5929d0',
    VP_CUSTOMER_SUCCESS:'#A855F7',
    LEGAL_COMPLIANCE:   '#01CAB8',
    ADMIN_OPS:          '#8B5CF6',
    CUSTOMER:           '#CF008B',
};

/* ── Ubuntu-style clock ── */
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

/* ── Ubuntu top bar ── */
const Topbar = () => (
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

/* ── Dock app icons ── */
const WordIcon = () => (
    <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#185ABD"/>
        <path d="M9 13h5l3 12 3-10 3 10 3-12h5l-5.5 18H20l-3-10-3 10h-4.5z" fill="white"/>
    </svg>
);

const PPTIcon = () => (
    <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#C43E1C"/>
        <rect x="9" y="10" width="16" height="24" rx="2" fill="white" opacity="0.15"/>
        <rect x="11" y="12" width="12" height="2" rx="1" fill="white" opacity="0.7"/>
        <circle cx="24" cy="21" r="7" fill="white" opacity="0.9"/>
        <circle cx="24" cy="21" r="4" fill="#C43E1C"/>
        <rect x="9" y="13" width="26" height="14" rx="2" fill="white" opacity="0.12"/>
        <text x="22" y="28" textAnchor="middle" fill="white" fontSize="20" fontWeight="900" fontFamily="Arial, sans-serif">P</text>
    </svg>
);

const ExcelIcon = () => (
    <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#107C41"/>
        <path d="M13 13l5.5 9-5.5 9h4l3.5-6 3.5 6h4L22.5 22 28 13h-4l-3 5.5-3-5.5z" fill="white"/>
    </svg>
);

const AppDockIcon = () => (
    <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="appDockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5929d0"/>
                <stop offset="100%" stopColor="#A855F7"/>
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#appDockGrad)"/>
        <path d="M22 8L13 13v8c0 6 4 11 9 13 5-2 9-7 9-13v-8z" fill="white" opacity="0.9"/>
        <path d="M22 14L17 17v5c0 3.5 2.2 6.5 5 7.5 2.8-1 5-4 5-7.5v-5z" fill="#5929d0" opacity="0.6"/>
    </svg>
);

/* ── Ubuntu Dock ── */
const UbuntuDock = ({ onAppClick }) => {
    const [hovered, setHovered] = useState(null);
    const [bouncing, setBouncing] = useState(null);

    const launchOffice = (label, url) => {
        setBouncing(label);
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(() => setBouncing(null), 700);
    };

    const handleAppClick = () => {
        setBouncing('aegis');
        setTimeout(() => {
            setBouncing(null);
            onAppClick?.();
        }, 500);
    };

    const tooltipStyle = (side = 'right') => ({
        position: 'absolute',
        left: side === 'right' ? 'calc(100% + 12px)' : undefined,
        right: side === 'left' ? 'calc(100% + 12px)' : undefined,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.78)',
        color: '#fff',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    });

    const dockBtnStyle = (label) => ({
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '10px',
        display: 'block',
        transition: 'transform 0.18s',
        transform: bouncing === label
            ? 'translateY(-10px)'
            : hovered === label
                ? 'scale(1.14)'
                : 'scale(1)',
    });

    const officeApps = [
        { label: 'Word',        icon: <WordIcon />, url: 'https://www.microsoft365.com/launch/word' },
        { label: 'PowerPoint',  icon: <PPTIcon />,  url: 'https://www.microsoft365.com/launch/powerpoint' },
        { label: 'Excel',       icon: <ExcelIcon />, url: 'https://www.microsoft365.com/launch/excel' },
    ];

    return (
        <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderRadius: '20px',
            padding: '12px 8px',
            border: '1px solid rgba(255,255,255,0.13)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}>
            <style>{`
                @keyframes dockBounce {
                    0%   { transform: translateY(0); }
                    30%  { transform: translateY(-12px); }
                    60%  { transform: translateY(-4px); }
                    100% { transform: translateY(0); }
                }
            `}</style>

            {/* Ubuntu logo */}
            <div style={{ padding: '4px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#E95420"/>
                    <circle cx="12" cy="12" r="5"  fill="#fff" opacity="0.22"/>
                    <circle cx="12" cy="5.5"  r="2.4" fill="#fff" opacity="0.88"/>
                    <circle cx="17.8" cy="15.5" r="2.4" fill="#fff" opacity="0.88"/>
                    <circle cx="6.2"  cy="15.5" r="2.4" fill="#fff" opacity="0.88"/>
                </svg>
            </div>

            <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.18)', margin: '2px 0' }} />

            {/* Office apps */}
            {officeApps.map((app) => (
                <div key={app.label} style={{ position: 'relative' }}>
                    <button
                        style={dockBtnStyle(app.label)}
                        onMouseEnter={() => setHovered(app.label)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => launchOffice(app.label, app.url)}
                        title={app.label}
                        id={`dock_${app.label.toLowerCase()}_btn`}
                        data-testid={`dock-${app.label.toLowerCase()}-btn`}
                    >
                        {app.icon}
                    </button>
                    {hovered === app.label && (
                        <div style={tooltipStyle('right')}>{app.label}</div>
                    )}
                </div>
            ))}

            <div style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.18)', margin: '2px 0' }} />

            {/* aegis.ai app icon */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                    style={dockBtnStyle('aegis')}
                    onMouseEnter={() => setHovered('aegis')}
                    onMouseLeave={() => setHovered(null)}
                    onClick={handleAppClick}
                    title="aegis.ai — Open Customer Portal"
                    id="dock_aegis_btn"
                    data-testid="dock-aegis-btn"
                    data-tour="dock-aegis"
                >
                    <AppDockIcon />
                </button>
                {/* Running indicator dot */}
                <div style={{
                    width: '5px', height: '5px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.75)',
                    marginTop: '2px',
                }} />
                {hovered === 'aegis' && (
                    <div style={tooltipStyle('right')}>aegis.ai</div>
                )}
            </div>
        </div>
    );
};

/* ── Login window ── */
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
                        data-testid="login-role-select"
                        data-tour="login-role-select"
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
                    data-testid="login-submit-btn"
                    data-tour="login-submit"
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

/* ── Main RoleSelector page (Ubuntu desktop) ── */
const RoleSelector = () => {
    const { rolesList, setRole, rolesLoading, rolesError } = useAuth();
    const [selectedId, setSelectedId] = useState('');

    const handleLogin = (roleId) => setRole(roleId);

    /* Clicking the dock app icon logs in as CUSTOMER → Customer Portal */
    const handleDockAppClick = () => setRole('CUSTOMER');

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

            {/* Background glows */}
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
                <path d="M-100,180 C150,80 350,280 600,160 S1000,60 1300,180 S1700,300 2000,180" fill="none" stroke="url(#waveGrad1)" strokeWidth="2"/>
                <path d="M-100,220 C150,120 350,320 600,200 S1000,100 1300,220 S1700,340 2000,220" fill="none" stroke="url(#waveGrad1)" strokeWidth="1.5"/>
                <path d="M-100,260 C150,160 350,360 600,240 S1000,140 1300,260 S1700,380 2000,260" fill="none" stroke="url(#waveGrad2)" strokeWidth="1"/>
                <path d="M-100,420 C200,300 400,520 700,380 S1100,260 1400,420 S1800,540 2100,420" fill="none" stroke="url(#waveGrad2)" strokeWidth="2"/>
                <path d="M-100,460 C200,340 400,560 700,420 S1100,300 1400,460 S1800,580 2100,460" fill="none" stroke="url(#waveGrad1)" strokeWidth="1.5"/>
                <path d="M-100,620 C250,500 450,700 750,560 S1150,440 1500,620 S1900,740 2200,620" fill="none" stroke="url(#waveGrad1)" strokeWidth="2"/>
                <path d="M-100,660 C250,540 450,740 750,600 S1150,480 1500,660 S1900,780 2200,660" fill="none" stroke="url(#waveGrad2)" strokeWidth="1.5"/>
                <path d="M-100,80  C300,20  500,160 800,60  S1200,0   1600,80  S2000,160 2300,80"  fill="none" stroke="url(#waveGrad2)" strokeWidth="1" opacity="0.6"/>
                <path d="M-100,760 C300,680 500,820 800,720 S1200,640 1600,760 S2000,840 2300,760" fill="none" stroke="url(#waveGrad1)" strokeWidth="1" opacity="0.6"/>
            </svg>

            <Topbar />
            <UbuntuDock onAppClick={handleDockAppClick} />
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
