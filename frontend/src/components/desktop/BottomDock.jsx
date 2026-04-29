import React, { useState, useEffect } from 'react';
import { DownloadIcon, NotesIcon, AegisDockIcon } from './DesktopIcons';



const BottomDock = ({ aegisOpen, aegisMinimized, onAegisClick, reportsOpen, reportsMinimized, onReportsClick, notesOpen, notesMinimized, onNotesClick }) => {
    const [hovered, setHovered] = useState(null);
    const [bouncing, setBouncing] = useState(null);

    const handleReports = () => {
        setBouncing('downloads');
        setTimeout(() => { setBouncing(null); onReportsClick(); }, 300);
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

    return (
        <div className="bottom-dock">
            <div className="bottom-dock-left">
                {/* Reserved for Start button or weather */}
            </div>

            <div className="bottom-dock-center">
                <button
                    style={itemStyle('downloads')}
                    onMouseEnter={() => setHovered('downloads')}
                    onMouseLeave={() => setHovered(null)}
                    onClick={handleReports}
                >
                    <DownloadIcon />
                    {/* Running dot */}
                    {reportsOpen && (
                        <div className="bottom-dock-dot" style={{
                            background: reportsMinimized ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
                        }} />
                    )}
                    {tip('Reporting Center', 'downloads')}
                </button>

                <button
                    style={itemStyle('notes')}
                    onMouseEnter={() => setHovered('notes')}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                        setBouncing('notes');
                        setTimeout(() => { setBouncing(null); onNotesClick(); }, 300);
                    }}
                >
                    <NotesIcon />
                    {/* Running dot */}
                    {notesOpen && (
                        <div className="bottom-dock-dot" style={{
                            background: notesMinimized ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
                        }} />
                    )}
                    {tip('Notes', 'notes')}
                </button>

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
                        <div className="bottom-dock-dot" style={{
                            background: aegisMinimized ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)',
                        }} />
                    )}
                    {tip('aegis.ai', 'aegis')}
                </button>
            </div>

            <div className="bottom-dock-right">
                <div className="system-tray">
                    {/* WiFi */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M1 6.5C5.5 2 18.5 2 23 6.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4.5 10C7.5 7 16.5 7 19.5 10" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 13.5C9.5 12 14.5 12 16 13.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="17" r="1.5" fill="rgba(255,255,255,0.85)" />
                    </svg>
                    {/* Volume */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    {/* Power */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 2v6" /><path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
                    </svg>
                </div>

            </div>
        </div>
    );
};

export default BottomDock;
