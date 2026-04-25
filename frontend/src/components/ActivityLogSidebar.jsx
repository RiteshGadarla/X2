import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const FALLBACK_LOGS = [
    { id: 'LOG-1042', time: '09:42', severity: 'success', source: 'SLA Monitor', message: 'P1 first-response window recovered for Acme Corp.', role_scope: 'Support' },
    { id: 'LOG-1041', time: '09:36', severity: 'warning', source: 'HIL Queue', message: 'VIP checkpoint waiting 45m for manager approval.', role_scope: 'Manager' },
    { id: 'LOG-1040', time: '09:28', severity: 'info', source: 'Ticket Intake', message: '12 new omnichannel tickets normalized and triaged.', role_scope: 'Support' },
    { id: 'LOG-1039', time: '09:17', severity: 'error', source: 'Integration', message: 'Zendesk webhook retry failed on channel sync batch.', role_scope: 'Admin' },
    { id: 'LOG-1038', time: '09:04', severity: 'info', source: 'VoC Engine', message: 'Recurring reporting export theme linked to 8 tickets.', role_scope: 'Executive' },
    { id: 'LOG-1037', time: '08:52', severity: 'warning', source: 'Compliance', message: 'Legal phrase detected in draft customer response.', role_scope: 'Legal' }
];

const severityMeta = {
    success: { icon: CheckCircle2, className: 'log-success' },
    warning: { icon: AlertTriangle, className: 'log-warning' },
    error: { icon: XCircle, className: 'log-error' },
    info: { icon: Info, className: 'log-info' }
};

const ActivityLogSidebar = () => {
    const [logs, setLogs] = useState(FALLBACK_LOGS);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/logs')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.logs) && data.logs.length) {
                    setLogs(data.logs);
                }
            })
            .catch(() => setLogs(FALLBACK_LOGS));
    }, []);

    return (
        <aside className="activity-log-sidebar">
            <div className="activity-log-header">
                <div className="activity-log-title">
                    <Activity size={16} />
                    <span>Live Logs</span>
                </div>
                <span className="activity-log-count">{logs.length}</span>
            </div>

            <div className="activity-log-list">
                {logs.map((log) => {
                    const meta = severityMeta[log.severity] || severityMeta.info;
                    const Icon = meta.icon;

                    return (
                        <div key={log.id} className="activity-log-item">
                            <div className={`activity-log-icon ${meta.className}`}>
                                <Icon size={14} />
                            </div>
                            <div className="activity-log-body">
                                <div className="activity-log-meta">
                                    <span>{log.source}</span>
                                    <time>{log.time}</time>
                                </div>
                                <p>{log.message}</p>
                                <span className="activity-log-scope">{log.role_scope}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default ActivityLogSidebar;
