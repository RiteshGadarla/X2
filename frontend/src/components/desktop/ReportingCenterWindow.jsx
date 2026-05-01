import React, { useState, useEffect } from 'react';
import AppWindow from './AppWindow';
import { DownloadIcon } from './DesktopIcons';
import { fetchJson } from '../../api/client';

const ReportingCenterWindow = ({ onClose, isMaximized, onMinimize, onMaximize, zIndex, onFocus }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();

        const handleUpdate = () => fetchReports();
        window.addEventListener('reports-updated', handleUpdate);
        return () => window.removeEventListener('reports-updated', handleUpdate);
    }, []);

    const fetchReports = () => {
        fetchJson('/api/features/reports')
            .then(data => setReports(data.reports || []))
            .catch(console.error);
    };

    const clearReports = () => {
        setLoading(true);
        fetchJson('/api/features/reports', { method: 'DELETE' })
            .then(() => {
                setReports([]);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    return (
        <AppWindow
            title="Reporting Center"
            testId="reporting-center-window"
            isMaximized={isMaximized}
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            zIndex={zIndex}
            onFocus={onFocus}
        >
            <div style={{ padding: '36px', backgroundColor: '#f8fafc', height: '100%', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px' }}>
                        <DownloadIcon /> Reporting Center
                    </h2>
                    <button
                        onClick={clearReports}
                        disabled={loading || reports.length === 0}
                        style={{
                            padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none',
                            borderRadius: '8px', cursor: (loading || reports.length === 0) ? 'not-allowed' : 'pointer', fontWeight: '600',
                            transition: 'background 0.2s', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                        }}
                        id="reports_clear_btn"
                        data-testid="reports-clear-btn"
                        data-tour="reports-clear"
                    >
                        {loading ? 'Clearing...' : 'Clear Reports'}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {reports.length === 0 && !loading && (
                        <div style={{ color: '#64748b', padding: '40px 20px', textAlign: 'center', gridColumn: '1 / -1', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                            No reports generated yet. Reports triggered from the web application will appear here.
                        </div>
                    )}
                    {reports.map((r) => (
                        <div key={r.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                                {r.type.replace('_', ' ')}
                            </div>
                            <div style={{ fontSize: '15px', marginBottom: '20px', color: '#334155', fontWeight: '500' }}>
                                {new Date(r.period_start).toLocaleDateString()} — {new Date(r.period_end).toLocaleDateString()}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{r.data.total_tickets}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: '500' }}>Total Tickets</div>
                                </div>
                                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dcfce7' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a' }}>{r.data.csat_score}</div>
                                    <div style={{ fontSize: '12px', color: '#15803d', marginTop: '4px', fontWeight: '500' }}>Avg CSAT</div>
                                </div>
                                <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid #dbeafe' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>{r.data.resolved_tickets}</div>
                                    <div style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '4px', fontWeight: '500' }}>Resolved</div>
                                </div>
                                <div style={{ background: '#fefce8', padding: '16px', borderRadius: '8px', textAlign: 'center', border: '1px solid #fef9c3' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#ca8a04' }}>{r.data.avg_resolution_time_hrs}h</div>
                                    <div style={{ fontSize: '12px', color: '#a16207', marginTop: '4px', fontWeight: '500' }}>Avg Time</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px', textAlign: 'right' }}>
                                Downloaded on {new Date(r.generated_at).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppWindow>
    );
};

export default ReportingCenterWindow;
