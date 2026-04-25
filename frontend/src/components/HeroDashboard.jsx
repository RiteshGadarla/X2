import { AreaChart, Area, BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from 'recharts';
import { useAuth } from '../state/AuthContext';

const MetricBox = ({ label, value }) => (
    <div className="hero-metric-box">
        <div className="hero-metric-value">{value}</div>
        <div className="hero-metric-label">{label}</div>
    </div>
);

const ROLE_HERO_CONTENT = {
    SUPPORT_AGENT: {
        title: 'Support Operations Command Center',
        subtitle: 'Prioritize first-contact resolution, keep SLA clocks healthy, and provide proactive customer updates in every ticket stage.',
        pillars: ['UI-01 Live Intake', 'UI-02 SLA Focus', 'UI-07 KB Drafting'],
        access: ['Assigned Queues', 'Ticket Detail Access', 'SLA View', 'KB Draft Submission'],
        chartTitle: '7-Day Ticket Resolution Trend',
        trendData: [
            { label: 'Mon', value: 32 },
            { label: 'Tue', value: 38 },
            { label: 'Wed', value: 35 },
            { label: 'Thu', value: 41 },
            { label: 'Fri', value: 44 },
            { label: 'Sat', value: 39 },
            { label: 'Sun', value: 42 }
        ],
        distribution: [
            { name: 'Resolved', value: 64, color: 'var(--success)' },
            { name: 'In Progress', value: 26, color: 'var(--primary)' },
            { name: 'At Risk', value: 10, color: 'var(--warning)' }
        ]
    },
    SUPPORT_MANAGER: {
        title: 'Manager Escalation and SLA Control',
        subtitle: 'Balance team throughput, SLA governance, and mandatory HIL approvals for billing, legal, VIP, and angry customer tickets.',
        pillars: ['UI-03 Sentiment Feed', 'UI-06 HIL Review', 'UI-08 VoC Insights'],
        access: ['All Queue Access', 'HIL Approval Control', 'CSAT + SLA Dashboards', 'KB Publication'],
        chartTitle: '14-Day SLA Compliance Trend',
        trendData: [
            { label: 'W1-D1', value: 88 },
            { label: 'W1-D3', value: 90 },
            { label: 'W1-D5', value: 91 },
            { label: 'W2-D1', value: 92 },
            { label: 'W2-D3', value: 93 },
            { label: 'W2-D5', value: 94 },
            { label: 'Today', value: 91 }
        ],
        distribution: [
            { name: 'Healthy', value: 71, color: 'var(--success)' },
            { name: 'Warning', value: 20, color: 'var(--warning)' },
            { name: 'Breach', value: 9, color: 'var(--error)' }
        ]
    },
    VP_CUSTOMER_SUCCESS: {
        title: 'Executive Customer Success Overview',
        subtitle: 'Track enterprise health with SLA adherence, CSAT momentum, recurring issue visibility, and strategic risk reduction outcomes.',
        pillars: ['UI-11 Executive View', 'UI-08 VoC Panel', 'Escalation Overrides'],
        access: ['Executive Dashboard', 'SLA Exception Approvals', 'VIP Handling Override', 'Final Escalation Decisions'],
        chartTitle: 'Quarterly Protected Revenue Trend',
        trendData: [
            { label: 'Q1', value: 780000 },
            { label: 'Q2', value: 860000 },
            { label: 'Q3', value: 980000 },
            { label: 'Q4', value: 1200000 }
        ],
        distribution: [
            { name: 'Enterprise', value: 58, color: 'var(--primary)' },
            { name: 'Business', value: 29, color: 'var(--cyan)' },
            { name: 'Standard', value: 13, color: 'var(--pink)' }
        ]
    },
    LEGAL_COMPLIANCE: {
        title: 'Legal and Compliance Review Desk',
        subtitle: 'Handle legal-flagged tickets, enforce communication guardrails, and control customer-facing responses for regulated interactions.',
        pillars: ['Legal HIL Queue', 'Compliance Flags', 'Correspondence Governance'],
        access: ['Legal Ticket Ownership', 'Legal Override', 'Communication Block/Approve', 'Audit Outcome Logging'],
        chartTitle: 'Compliance Flag Trend',
        trendData: [
            { label: 'Mon', value: 2 },
            { label: 'Tue', value: 1 },
            { label: 'Wed', value: 3 },
            { label: 'Thu', value: 2 },
            { label: 'Fri', value: 1 },
            { label: 'Sat', value: 2 },
            { label: 'Sun', value: 1 }
        ],
        distribution: [
            { name: 'Legal Cases', value: 44, color: 'var(--error)' },
            { name: 'Privacy Review', value: 33, color: 'var(--warning)' },
            { name: 'Policy Advisory', value: 23, color: 'var(--primary)' }
        ]
    },
    ADMIN_OPS: {
        title: 'Integration and Channel Reliability Hub',
        subtitle: 'Monitor channel ingestion, API integration health, and operational readiness across ITSM, CRM, and support channels.',
        pillars: ['UI-04 Channel Volume', 'Integration Monitoring', 'Operational Availability'],
        access: ['Integration Settings', 'Channel Health', 'System Diagnostics', 'Config Governance'],
        chartTitle: 'Weekly Channel Volume',
        trendData: [
            { label: 'Email', value: 450 },
            { label: 'Chat', value: 320 },
            { label: 'Portal', value: 200 },
            { label: 'Slack', value: 115 },
            { label: 'WhatsApp', value: 50 }
        ],
        distribution: [
            { name: 'Healthy Integrations', value: 80, color: 'var(--success)' },
            { name: 'Warnings', value: 15, color: 'var(--warning)' },
            { name: 'Failed Syncs', value: 5, color: 'var(--error)' }
        ]
    },
    CUSTOMER: {
        title: 'Customer Support Portal Overview',
        subtitle: 'Submit issues faster, view real-time ticket progress, and receive structured updates with clear SLA targets and next steps.',
        pillars: ['UI-09 Customer Portal', 'AI Disclosure + Human Escalation', 'Linked KB Guidance'],
        access: ['Ticket Submission', 'Status Tracking', 'SLA Target Visibility', 'Request Human Support'],
        chartTitle: 'Recent Ticket Status Flow',
        trendData: [
            { label: 'New', value: 8 },
            { label: 'In Triage', value: 6 },
            { label: 'In Progress', value: 5 },
            { label: 'Pending', value: 3 },
            { label: 'Resolved', value: 10 }
        ],
        distribution: [
            { name: 'Portal', value: 48, color: 'var(--primary)' },
            { name: 'Email', value: 32, color: 'var(--cyan)' },
            { name: 'Chat', value: 20, color: 'var(--pink)' }
        ]
    }
};

const HeroDashboard = ({ metrics }) => {
    const { role, rolesList } = useAuth();
    
    // Find friendly role name
    const activeRoleData = rolesList.find(r => r.id === role);
    const roleName = activeRoleData ? activeRoleData.name : role;

    if (!metrics) return null;

    // Filter out description for metrics presentation
    const { description, ...metricData } = metrics;
    const metricKeys = Object.keys(metricData);
    const roleHero = ROLE_HERO_CONTENT[role] || ROLE_HERO_CONTENT.SUPPORT_AGENT;

    return (
        <section className="page-hero dashboard-hero">
            <div>
                <div className="dashboard-hero-context">
                    Active Context: {roleName}
                </div>
                <h1 style={{ margin: '0 0 12px', color: '#fff' }}>{roleHero.title}</h1>
                <p style={{ maxWidth: '760px' }}>{description || roleHero.subtitle}</p>
                <div className="badge-row">
                    {roleHero.pillars.map((item) => (
                        <span key={item} className="badge-chip">{item}</span>
                    ))}
                </div>
            </div>

            <div className="dashboard-hero-metrics">
                {metricKeys.map((key) => {
                    const formattedLabel = key.split('_').join(' ');
                    return <MetricBox key={key} label={formattedLabel} value={metricData[key]} />;
                })}
            </div>

            <div className="dashboard-hero-grid">
                <div className="card-demo dashboard-hero-card">
                    <div className="card-demo-header">
                        <h3 className="type-h4">{roleHero.chartTitle}</h3>
                    </div>
                    <div className="dashboard-hero-trend">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={roleHero.trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="heroTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--neutral-4)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: 'var(--neutral-4)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="url(#heroTrend)" strokeWidth={2.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-demo dashboard-hero-card">
                    <div className="card-demo-header">
                        <h3 className="type-h4">Access Scope</h3>
                    </div>
                    <ul className="dashboard-hero-access-list">
                        {roleHero.access.map((item) => (
                            <li key={item}>- {item}</li>
                        ))}
                    </ul>
                    <div className="dashboard-hero-bars">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roleHero.distribution} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    <LabelList dataKey="value" position="top" formatter={(value) => `${value}%`} style={{ fill: 'var(--neutral-2)', fontSize: '10px', fontWeight: 700 }} />
                                    {roleHero.distribution.map((item) => (
                                        <Cell key={item.name} fill={item.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
                        {roleHero.distribution.map((item) => (
                            <div key={`${item.name}-value`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: item.color }} />
                                    <span style={{ fontSize: '10px', color: 'var(--neutral-3)' }}>{item.name}</span>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--neutral-1)' }}>{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroDashboard;
