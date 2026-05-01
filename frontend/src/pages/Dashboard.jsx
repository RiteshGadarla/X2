import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth-context';
import HeroDashboard from '../components/HeroDashboard';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';

const ACTION_CATALOG = {
    VIEW_TICKETS: { label: 'Monitor live ticket intake and queue state', route: '/support-lead/tickets' },
    VIEW_SLA: { label: 'Review SLA risk, breaches, and adherence trends', route: '/support-lead/sla' },
    VIEW_SENTIMENT: { label: 'Track angry and at-risk customer sentiment', route: '/support-manager/sentiment' },
    VIEW_HIL_STATUS: { label: 'Follow HIL queue checkpoints and aging', route: '/support-lead/hil' },
    APPROVE_HIL: { label: 'Approve/modify critical HIL escalations', route: '/support-manager/hil' },
    APPROVE_HIL_OVERRIDE: { label: 'Override escalations for executive outcomes', route: '/vp/hil' },
    DRAFT_KB: { label: 'Draft KB responses from solved incidents', route: '/support-lead/kb' },
    PUBLISH_KB: { label: 'Review and publish KB assets safely', route: '/support-manager/kb' },
    VIEW_KB: { label: 'Review KB quality and gap indicators', route: '/legal/kb' },
    VIEW_VOC: { label: 'Analyze VoC trends and feature demand', route: '/vp/voc' },
    VIEW_EXEC_DASH: { label: 'Track executive customer health rollups', route: '/vp/exec' },
    VIEW_LEGAL_TICKETS: { label: 'Review legal/compliance flagged tickets', route: '/legal/queue' },
    MANAGE_LEGAL_CORRESPONDENCE: { label: 'Take legal ownership and decision control', route: '/legal/hil' },
    MANAGE_INTEGRATIONS: { label: 'Manage channel and system integrations', route: '/admin/integrations' },
    VIEW_CUSTOMER_PORTAL: { label: 'Submit and track customer-facing tickets', route: '/customer/portal' },
};

const REPORTING_CATALOG = [
    { id: 'daily-support-digest', name: 'Daily Support Digest', freq: 'Daily 08:00', format: 'Dashboard + Email', permissions: ['VIEW_SLA', 'VIEW_TICKETS'] },
    { id: 'weekly-sla-compliance', name: 'Weekly SLA Compliance', freq: 'Weekly Monday', format: 'Report + Dashboard', permissions: ['VIEW_SLA'] },
    { id: 'csat-satisfaction', name: 'CSAT and Satisfaction', freq: 'Weekly + Monthly', format: 'Report + Dashboard', permissions: ['VIEW_VOC'] },
    { id: 'ticket-ageing-escalation', name: 'Ticket Ageing and Escalation', freq: 'Weekly + Monthly', format: 'Report + Dashboard', permissions: ['VIEW_HIL_STATUS'] },
    { id: 'monthly-voc-kb', name: 'Monthly VoC + KB Effectiveness', freq: 'Monthly', format: 'Dashboard + Email + Export', permissions: ['VIEW_VOC', 'VIEW_KB', 'DRAFT_KB', 'PUBLISH_KB'] }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { role, permissions } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (role) {
            setLoading(true);
            setError(null);
            fetchJson(`/api/metrics/${role}`)
                .then(data => {
                    setMetrics(data.metrics);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching metrics:", err);
                    setError(err.message || 'Failed to load dashboard metrics');
                    setLoading(false);
                });
        }
    }, [role]);

    const allowedActions = permissions
        .map((permission) => ({ permission, ...(ACTION_CATALOG[permission] || {}) }))
        .filter((entry) => entry.label && entry.route);
    const visibleReports = REPORTING_CATALOG.filter((report) => report.permissions.some((permission) => permissions.includes(permission)));

    return (
        <div>
            <HeroDashboard metrics={metrics} loading={loading} />

            {/* Error banner */}
            {error && (
                <div className="dashboard-workspace" style={{ paddingTop: '16px' }}>
                    <div className="card-demo" style={{ borderColor: 'var(--error)', background: 'var(--error-light)' }}>
                        <div className="card-demo-header">
                            <h3 className="type-h4" style={{ color: 'var(--error)' }}>Dashboard Error</h3>
                        </div>
                        <p className="type-body" style={{ color: 'var(--error)', fontSize: '13px' }}>
                            {error}. Please try refreshing the page or check your connection.
                        </p>
                    </div>
                </div>
            )}

            <div className="dashboard-workspace">
                <h2 className="section-title" style={{ marginTop: '28px' }}>Operational Workspace</h2>
                <p className="section-desc">Your actions, controls, and workflow priorities are loaded for this role context.</p>

                <div className="workspace-grid">
                    <div className="card-demo">
                        <div className="card-demo-header">
                            <h3 className="type-h4">What You Can Do</h3>
                            <span className="badge badge-primary">{allowedActions.length} Actions Enabled</span>
                        </div>
                        <div className="workspace-actions-grid">
                            {allowedActions.map((entry) => (
                                <button
                                    key={`${entry.permission}-${entry.route}`}
                                    className="btn btn-ghost workspace-action-btn"
                                    onClick={() => navigate(entry.route)}
                                    id={`action_${entry.permission.toLowerCase()}_btn`}
                                    data-testid={`action-${entry.permission.toLowerCase().replace(/_/g, '-')}-btn`}
                                >
                                    <span className="workspace-action-permission">
                                        {entry.permission}
                                    </span>
                                    <span className="workspace-action-label">{entry.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="card-demo" style={{ marginTop: '16px' }}>
                    <div className="card-demo-header">
                        <h3 className="type-h4">Reporting Center</h3>
                        <span className="badge badge-primary">{visibleReports.length} Reports Visible</span>
                    </div>
                    <p className="type-body" style={{ color: 'var(--neutral-4)' }}>
                        Role-filtered reports based on your current access permissions.
                    </p>
                    <div className="workspace-reports-grid">
                        {visibleReports.map((report) => (
                            <div key={report.id} className="workspace-report-card">
                                <div className="workspace-report-header">
                                    <strong className="workspace-report-name">{report.name}</strong>
                                    <span className="workspace-report-freq">{report.freq}</span>
                                </div>
                                <div className="workspace-report-format">{report.format}</div>
                                <button
                                    className="btn btn-sm btn-ghost"
                                    style={{ marginTop: '8px' }}
                                    id={`report_run_${report.id.replace(/-/g, '_')}_btn`}
                                    data-testid={`report-run-${report.id}-btn`}
                                    onClick={() => {
                                        emitMockAction(`${report.name} generated`, `Mock ${report.format} delivery started.`, 'success');
                                        fetchJson('/api/features/reports/generate', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ report_type: report.id })
                                        }).then(() => {
                                            window.dispatchEvent(new CustomEvent('reports-updated'));
                                        }).catch(console.error);
                                    }}
                                >
                                    Run Report
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
