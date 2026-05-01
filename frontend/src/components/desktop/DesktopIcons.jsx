import React from 'react';

export const DownloadIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <rect width="44" height="44" rx="10" fill="#0EA5E9" />
        <path d="M22 28l-8-8h5V12h6v8h5l-8 8zM12 30h20v2H12z" fill="white" />
    </svg>
);

export const NotesIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <rect width="44" height="44" rx="10" fill="#f59e0b" />
        <path d="M12 10h14l6 6v18H12z" fill="white" />
        <path d="M26 10v6h6" fill="#fef3c7" />
        <path d="M16 20h12M16 24h12M16 28h8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const PowerPointIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <defs>
            <linearGradient id="pptg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ED6C47" />
                <stop offset="100%" stopColor="#C43E1C" />
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#pptg)" />
        <circle cx="22" cy="22" r="10" fill="none" stroke="white" strokeWidth="2.2" />
        <path d="M22 12 A10 10 0 0 1 32 22 L22 22 Z" fill="white" />
        <text x="22" y="26.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="white" fontFamily="Arial">P</text>
    </svg>
);

export const WordIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <defs>
            <linearGradient id="wordg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#41A5EE" />
                <stop offset="100%" stopColor="#185ABD" />
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#wordg)" />
        <text x="22" y="29" textAnchor="middle" fontSize="18" fontWeight="800" fill="white" fontFamily="Arial">W</text>
    </svg>
);

export const ExcelIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <defs>
            <linearGradient id="excg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#21A366" />
                <stop offset="100%" stopColor="#107C41" />
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#excg)" />
        <text x="22" y="29" textAnchor="middle" fontSize="18" fontWeight="800" fill="white" fontFamily="Arial">X</text>
    </svg>
);

export const OutlookIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <defs>
            <linearGradient id="outg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F78D4" />
                <stop offset="100%" stopColor="#0A4F95" />
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#outg)" />
        <rect x="11" y="14" width="22" height="16" rx="2" fill="white" />
        <path d="M11 16 L22 24 L33 16" stroke="#0F78D4" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <text x="22" y="28" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0F78D4" fontFamily="Arial">O</text>
    </svg>
);

export const EdgeIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <defs>
            <radialGradient id="edgeBg" cx="30%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#3CCBF4" />
                <stop offset="55%" stopColor="#0F78D4" />
                <stop offset="100%" stopColor="#0A4F95" />
            </radialGradient>
            <linearGradient id="edgeArc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#36C1F0" />
                <stop offset="100%" stopColor="#1FCBA8" />
            </linearGradient>
        </defs>
        <circle cx="22" cy="22" r="16" fill="url(#edgeBg)" />
        <path d="M11 22 a11 11 0 0 1 21 -4 q-9 -3 -16 4 q-3 3 -2 8 q-2 -3 -3 -8 z"
            fill="white" opacity="0.95" />
        <path d="M14 28 q5 6 14 4 a10 10 0 0 1 -16 -2 q1 -1 2 -2 z"
            fill="url(#edgeArc)" />
    </svg>
);

export const TeamsIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
        <defs>
            <linearGradient id="teamsg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6264A7" />
                <stop offset="100%" stopColor="#464775" />
            </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#teamsg)" />
        <text x="22" y="29" textAnchor="middle" fontSize="18" fontWeight="800" fill="white" fontFamily="Arial">T</text>
        <circle cx="32" cy="14" r="4" fill="white" opacity="0.85" />
    </svg>
);

export const AegisDockIcon = () => (
    <svg viewBox="0 0 44 44" width="40" height="40">
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
