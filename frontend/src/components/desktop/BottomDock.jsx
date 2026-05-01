import React, { useState, useEffect } from 'react';
import { DownloadIcon, NotesIcon, AegisDockIcon, PowerPointIcon, WordIcon, ExcelIcon, OutlookIcon, TeamsIcon, EdgeIcon } from './DesktopIcons';



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

    const tip = () => null;

    return (
        <div className="bottom-dock">
            <div className="bottom-dock-left">
                {/* Reserved for Start button or weather */}
            </div>

            <div className="bottom-dock-center">
                {/* Decorative (non-functional) office apps */}
                {[
                    { key: 'edge', label: 'Microsoft Edge', Icon: EdgeIcon },
                    { key: 'ppt', label: 'PowerPoint', Icon: PowerPointIcon },
                    { key: 'word', label: 'Word', Icon: WordIcon },
                    { key: 'excel', label: 'Excel', Icon: ExcelIcon },
                    { key: 'outlook', label: 'Outlook', Icon: OutlookIcon },
                    { key: 'teams', label: 'Teams', Icon: TeamsIcon },
                ].map(({ key, label, Icon }) => (
                    <button
                        key={key}
                        style={itemStyle(key)}
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={(e) => {
                            e.preventDefault();
                            setBouncing(key);
                            setTimeout(() => setBouncing(null), 300);
                        }}
                        aria-label={label}
                        tabIndex={-1}
                    >
                        <Icon />
                        {tip(label, key)}
                    </button>
                ))}

                <button
                    style={itemStyle('downloads')}
                    onMouseEnter={() => setHovered('downloads')}
                    onMouseLeave={() => setHovered(null)}
                    onClick={handleReports}
                    id="dock_reporting_center_btn"
                    data-testid="dock-reporting-center-btn"
                    data-tour="dock-reporting-center"
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
                    id="dock_notes_btn"
                    data-testid="dock-notes-btn"
                    data-tour="dock-notes"
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
                    id="dock_aegis_btn"
                    data-testid="dock-aegis-btn"
                    data-tour="dock-aegis"
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
