import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { fetchJson } from '../api/client';

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

const MOCK_LOG_CYCLE = [
    { severity: 'info', source: 'Ticket Intake', message: 'New priority ticket normalized from chat intake.', role_scope: 'Support' },
    { severity: 'success', source: 'SLA Monitor', message: 'Response timer recovered after automated reassignment.', role_scope: 'Manager' },
    { severity: 'warning', source: 'HIL Queue', message: 'Billing checkpoint is waiting on manager review.', role_scope: 'Manager' },
    { severity: 'info', source: 'VoC Engine', message: 'Recurring export issue linked to current ticket cluster.', role_scope: 'Executive' },
    { severity: 'error', source: 'Integration', message: 'Webhook delivery failed and retry has been queued.', role_scope: 'Admin' },
    { severity: 'warning', source: 'Compliance', message: 'Sensitive phrase detected in draft response.', role_scope: 'Legal' },
    { severity: 'success', source: 'Knowledge Base', message: 'Suggested article attached to active customer case.', role_scope: 'Support' }
];

const getCurrentTime = () => new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}).format(new Date());

const getRandomDelay = () => 3000 + Math.floor(Math.random() * 2001);

const createMockLog = () => {
    const template = MOCK_LOG_CYCLE[Math.floor(Math.random() * MOCK_LOG_CYCLE.length)];

    return {
        ...template,
        id: `LOG-LIVE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        time: getCurrentTime()
    };
};
const ActivityLogSidebar = () => {
    const [logs, setLogs] = useState(FALLBACK_LOGS);
    const [visibleCount, setVisibleCount] = useState(6);
    const listRef = useRef(null);

    const fetchLogs = () => {
        fetchJson('/api/features/logs')
            .then((data) => {
                if (Array.isArray(data.logs) && data.logs.length) {
                    setLogs(data.logs);
                }
            })
            .catch(() => setLogs(FALLBACK_LOGS));
    };

    useEffect(() => {
        fetchLogs();

        const handleUpdate = () => fetchLogs();
        window.addEventListener('logs-updated-event', handleUpdate);

        return () => window.removeEventListener('logs-updated-event', handleUpdate);
    }, []);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return undefined;

        const updateVisibleCount = () => {
            const itemHeight = 82;
            // Subtract top and bottom padding (14 + 4 = 18) to get actual available height
            const availableHeight = list.clientHeight - 18;
            setVisibleCount(Math.max(1, Math.floor(availableHeight / itemHeight)));
        };

        updateVisibleCount();
        const resizeObserver = new ResizeObserver(updateVisibleCount);
        resizeObserver.observe(list);

        return () => resizeObserver.disconnect();
    }, []);



    const visibleLogs = useMemo(() => logs.slice(0, visibleCount), [logs, visibleCount]);

    return (
        <aside className="activity-log-sidebar">
            <div className="activity-log-header">
                <div className="activity-log-title">
                    <Activity size={16} />
                    <span>Live Logs</span>
                </div>
                <span className="activity-log-count">{visibleLogs.length}</span>
            </div>

            <div className="activity-log-list" ref={listRef}>
                {visibleLogs.map((log) => {
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
