import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth-context';
import HeroDashboard from '../components/HeroDashboard';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';
const ACTION_CATALOG = {
    VIEW_TICKETS:                { label: 'Monitor live ticket intake and queue state',       route: '/support-lead/tickets' },
    VIEW_SLA:                    { label: 'Review SLA risk, breaches, and adherence trends',  route: '/support-lead/sla' },
    VIEW_SENTIMENT:              { label: 'Track angry and at-risk customer sentiment',        route: '/support-manager/sentiment' },
    VIEW_HIL_STATUS:             { label: 'Follow HIL queue checkpoints and aging',            route: '/support-lead/hil' },
    APPROVE_HIL:                 { label: 'Approve/modify critical HIL escalations',           route: '/support-manager/hil' },
    APPROVE_HIL_OVERRIDE:        { label: 'Override escalations for executive outcomes',       route: '/vp/hil' },
    DRAFT_KB:                    { label: 'Draft KB responses from solved incidents',           route: '/support-lead/kb' },
    PUBLISH_KB:                  { label: 'Review and publish KB assets safely',               route: '/support-manager/kb' },
    VIEW_KB:                     { label: 'Review KB quality and gap indicators',              route: '/legal/kb' },
    VIEW_VOC:                    { label: 'Analyze VoC trends and feature demand',             route: '/vp/voc' },
    VIEW_EXEC_DASH:              { label: 'Track executive customer health rollups',           route: '/vp/exec' },
    VIEW_LEGAL_TICKETS:          { label: 'Review legal/compliance flagged tickets',           route: '/legal/queue' },
    MANAGE_LEGAL_CORRESPONDENCE: { label: 'Take legal ownership and decision control',         route: '/legal/hil' },
    MANAGE_INTEGRATIONS:         { label: 'Manage channel and system integrations',            route: '/admin/integrations' },
    VIEW_CUSTOMER_PORTAL:        { label: 'Submit and track customer-facing tickets',          route: '/customer/portal' },
};

const ROLE_PRIORITIES = {
    SUPPORT_LEAD: ['Triage quickly', 'Maintain SLA windows', 'Draft quality KB artifacts'],
    SUPPORT_MANAGER: ['Control escalations', 'Improve CSAT and VoC', 'Publish validated KB updates'],
    VP_CUSTOMER_SUCCESS: ['Govern strategic risk', 'Approve SLA exceptions', 'Align VoC with product priorities'],
    LEGAL_COMPLIANCE: ['Mitigate legal exposure', 'Approve regulated responses', 'Maintain audit-ready correspondence'],
    ADMIN_OPS: ['Keep integrations healthy', 'Reduce failed channel syncs', 'Sustain operational uptime'],
    CUSTOMER: ['Submit clear incidents', 'Track status transparently', 'Use KB for faster resolution']
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

    useEffect(() => {
        if (role) {
            fetchJson(`/api/metrics/${role}`)
                .then(data => setMetrics(data.metrics))
                .catch(err => console.error("Error fetching metrics:", err));
        }
    }, [role]);

    const allowedActions = permissions
        .map((permission) => ({ permission, ...(ACTION_CATALOG[permission] || {}) }))
        .filter((entry) => entry.label && entry.route);
    const priorities = ROLE_PRIORITIES[role] || [];
    const visibleReports = REPORTING_CATALOG.filter((report) => report.permissions.some((permission) => permissions.includes(permission)));

    return (
        <div>
            <HeroDashboard metrics={metrics} />
            <div className="dashboard-workspace">
                <h2 className="section-title" style={{ marginTop: '32px' }}>Operational Workspace</h2>
                <p className="section-desc">Your actions, controls, and workflow priorities are loaded for this role context.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px', marginTop: '20px' }}>
                    <div className="card-demo">
                        <div className="card-demo-header">
                            <h3 className="type-h4">What You Can Do</h3>
                            <span className="badge badge-primary">{allowedActions.length} Actions Enabled</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                            {allowedActions.map((entry) => (
                                <button
                                    key={`${entry.permission}-${entry.route}`}
                                    className="btn btn-ghost"
                                    onClick={() => navigate(entry.route)}
                                    style={{
                                        textAlign: 'left',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '12px',
                                        border: '1px solid var(--neutral-7)',
                                        color: 'var(--neutral-1)'
                                    }}
                                >
                                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--primary)', fontWeight: '700', marginBottom: '3px' }}>
                                        {entry.permission}
                                    </span>
                                    <span style={{ fontSize: '11px' }}>{entry.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card-demo">
                        <div className="card-demo-header">
                            <h3 className="type-h4">Role Priorities</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                            {priorities.map((item) => (
                                <div key={item} style={{ background: 'var(--neutral-8)', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--neutral-2)' }}>{item}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-sm btn-outline"
                            style={{ marginTop: '12px' }}
                            onClick={() => emitMockAction('Role context refreshed', 'Priority and permission cache revalidated.', 'success')}
                        >
                            Refresh Role Context
                        </button>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                        {visibleReports.map((report) => (
                            <div key={report.id} style={{ border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                    <strong style={{ fontSize: '11px', color: 'var(--neutral-1)' }}>{report.name}</strong>
                                    <span style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>{report.freq}</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-4)', marginTop: '4px' }}>{report.format}</div>
                                <button
                                    className="btn btn-sm btn-ghost"
                                    style={{ marginTop: '8px' }}
                                    onClick={() => emitMockAction(`${report.name} generated`, `Mock ${report.format} delivery started.`, 'success')}
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
