import { useAuth } from '../state/auth-context';
import { BRAND_COLORS, BRAND_PALETTES, ROLE_PILLARS } from '../config/brand';
import { BrandAreaChart, BrandBarChart } from '../components/BrandPieChart';

const MetricBox = ({ label, value }) => (
    <div className="hero-metric-box">
        <div className="hero-metric-value">{value}</div>
        <div className="hero-metric-label">{label}</div>
    </div>
);

const ROLE_HERO_CONTENT = {
    SUPPORT_LEAD: {
        title: 'Support Operations Command Center',
        subtitle: 'Prioritize first-contact resolution, keep SLA clocks healthy, and provide proactive customer updates in every ticket stage.',
        pillars: ROLE_PILLARS.SUPPORT_LEAD,
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
            { name: 'Resolved', value: 64, color: BRAND_PALETTES.roleStatus[0] },
            { name: 'In Progress', value: 26, color: BRAND_PALETTES.roleStatus[1] },
            { name: 'At Risk', value: 10, color: BRAND_PALETTES.roleStatus[2] }
        ]
    },
    SUPPORT_MANAGER: {
        title: 'Manager Escalation and SLA Control',
        subtitle: 'Balance team throughput, SLA governance, and mandatory HIL approvals for billing, legal, VIP, and angry customer tickets.',
        pillars: ROLE_PILLARS.SUPPORT_MANAGER,
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
            { name: 'Healthy', value: 71, color: BRAND_COLORS.success },
            { name: 'Warning', value: 20, color: BRAND_COLORS.warning },
            { name: 'Breach', value: 9, color: BRAND_COLORS.error }
        ]
    },
    VP_CUSTOMER_SUCCESS: {
        title: 'Executive Customer Success Overview',
        subtitle: 'Track enterprise health with SLA adherence, CSAT momentum, recurring issue visibility, and strategic risk reduction outcomes.',
        pillars: ROLE_PILLARS.VP_CUSTOMER_SUCCESS,
        access: ['Executive Dashboard', 'SLA Exception Approvals', 'VIP Handling Override', 'Final Escalation Decisions'],
        chartTitle: 'Quarterly Protected Revenue Trend',
        trendData: [
            { label: 'Q1', value: 780000 },
            { label: 'Q2', value: 860000 },
            { label: 'Q3', value: 980000 },
            { label: 'Q4', value: 1200000 }
        ],
        distribution: [
            { name: 'Enterprise', value: 58, color: BRAND_COLORS.primary },
            { name: 'Business', value: 29, color: BRAND_COLORS.cyan },
            { name: 'Standard', value: 13, color: BRAND_COLORS.pink }
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
            { name: 'Legal Cases', value: 44, color: BRAND_COLORS.error },
            { name: 'Privacy Review', value: 33, color: BRAND_COLORS.warning },
            { name: 'Policy Advisory', value: 23, color: BRAND_COLORS.primary }
        ]
    },
    ADMIN_OPS: {
        title: 'Integration and Channel Reliability Hub',
        subtitle: 'Monitor channel ingestion, API integration health, and operational readiness across ITSM, CRM, and support channels.',
        pillars: ROLE_PILLARS.ADMIN_OPS,
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
            { name: 'Healthy Integrations', value: 80, color: BRAND_COLORS.success },
            { name: 'Warnings', value: 15, color: BRAND_COLORS.warning },
            { name: 'Failed Syncs', value: 5, color: BRAND_COLORS.error }
        ]
    },
    CUSTOMER: {
        title: 'Customer Support Portal Overview',
        subtitle: 'Submit issues faster, view real-time ticket progress, and receive structured updates with clear SLA targets and next steps.',
        pillars: ROLE_PILLARS.CUSTOMER,
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
            { name: 'Portal', value: 48, color: BRAND_COLORS.primary },
            { name: 'Email', value: 32, color: BRAND_COLORS.cyan },
            { name: 'Chat', value: 20, color: BRAND_COLORS.pink }
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
    const roleHero = ROLE_HERO_CONTENT[role] || ROLE_HERO_CONTENT.SUPPORT_LEAD;

    return (
        <section className="page-hero dashboard-hero">
            <div>
                <div className="dashboard-hero-context">
                    Active Context: {roleName}
                </div>
                <h1 style={{ margin: '0 0 12px', color: 'var(--neutral-9)' }}>{roleHero.title}</h1>
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
                        <BrandAreaChart
                            data={roleHero.trendData}
                            categoryKey="label"
                            valueKey="value"
                            color={BRAND_COLORS.primary}
                        />
                    </div>
                </div>

                <div className="card-demo dashboard-hero-card">
                    <div className="card-demo-header">
                        <h3 className="type-h4">Access Scope</h3>
                    </div>
                    <ul className="dashboard-hero-access-list">
                        {roleHero.access.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <div style={{ marginTop: 'auto' }}>
                        <BrandBarChart data={roleHero.distribution} categoryKey="name" valueKey="value" height={150} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroDashboard;
