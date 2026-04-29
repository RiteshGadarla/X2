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
