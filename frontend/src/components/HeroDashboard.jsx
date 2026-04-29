import { useAuth } from '../state/auth-context';
import { BRAND_COLORS, BRAND_PALETTES, ROLE_PILLARS } from '../config/brand';
import { BrandAreaChart, BrandBarChart } from '../components/BrandPieChart';

/* ── Helpers ── */
const formatMetricLabel = (key) => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/* ── Sub-components ── */
const MetricBox = ({ label, value }) => (
    <div className="hero-metric-box">
        <div className="hero-metric-value">{value}</div>
        <div className="hero-metric-label">{label}</div>
    </div>
);

const LoadingSkeleton = () => (
    <section className="page-hero dashboard-hero dashboard-hero-loading">
        <div>
            <div className="skeleton skeleton-badge" style={{ width: '200px', height: '24px', marginBottom: '12px' }} />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton-badges">
                <div className="skeleton skeleton-badge" />
                <div className="skeleton skeleton-badge" />
                <div className="skeleton skeleton-badge" />
            </div>
        </div>
        <div className="skeleton-metrics">
            <div className="skeleton skeleton-metric" />
            <div className="skeleton skeleton-metric" />
            <div className="skeleton skeleton-metric" />
            <div className="skeleton skeleton-metric" />
        </div>
        <div className="skeleton-charts">
            <div className="skeleton skeleton-chart" />
            <div className="skeleton skeleton-chart" />
        </div>
    </section>
);

const EmptyState = ({ roleName }) => (
    <section className="page-hero dashboard-hero">
        <div className="dashboard-hero-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-8 4 4 4-6" />
            </svg>
            <p>No dashboard metrics available for <strong>{roleName}</strong>. Data will appear here once the system is fully connected.</p>
        </div>
    </section>
);

/* ── Role hero content definitions ── */
const ROLE_HERO_CONTENT = {
    SUPPORT_LEAD: {
        title: 'Support Operations Command Center',
        subtitle: 'Prioritize first-contact resolution, keep SLA clocks healthy, and provide proactive customer updates in every ticket stage.',
        pillars: ROLE_PILLARS.SUPPORT_LEAD,
        chartTitle: '7-Day Ticket Resolution Trend',
        distributionTitle: 'Ticket Status Distribution',
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
        subtitle: 'Balance team throughput, SLA governance, and mandatory review approvals for billing, legal, VIP, and angry customer tickets.',
        pillars: ROLE_PILLARS.SUPPORT_MANAGER,
        chartTitle: '14-Day SLA Compliance Trend',
        distributionTitle: 'SLA Health Distribution',
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
        chartTitle: 'Quarterly Protected Revenue Trend',
        distributionTitle: 'Customer Segment Breakdown',
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
        pillars: ['Legal Review Queue', 'Compliance Flags', 'Correspondence Governance'],
        chartTitle: 'Compliance Flag Trend',
        distributionTitle: 'Case Type Distribution',
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
        chartTitle: 'Weekly Channel Volume',
        distributionTitle: 'Integration Health Status',
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
        chartTitle: 'Recent Ticket Status Flow',
        distributionTitle: 'Submission Channel Mix',
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

/* ── Main component ── */
const HeroDashboard = ({ metrics, loading }) => {
    const { role, rolesList } = useAuth();
    
    // Find friendly role name
    const activeRoleData = rolesList.find(r => r.id === role);
    const roleName = activeRoleData ? activeRoleData.name : role;

    // Loading state
    if (loading || metrics === null) return <LoadingSkeleton />;

    // Filter out description for metrics presentation
    const { description, ...metricData } = metrics;
    const metricKeys = Object.keys(metricData);

    // Empty state
    if (metricKeys.length === 0) return <EmptyState roleName={roleName} />;

    const roleHero = ROLE_HERO_CONTENT[role] || ROLE_HERO_CONTENT.SUPPORT_LEAD;

    return (
        <section className="page-hero dashboard-hero" id="dashboard-hero">
            {/* Header */}
            <div>
                <div className="dashboard-hero-context">
                    Active Context: {roleName}
                </div>
                <h1 style={{ margin: '0 0 8px', color: 'var(--neutral-9)' }}>{roleHero.title}</h1>
                <p style={{ maxWidth: '720px' }}>{description || roleHero.subtitle}</p>
                <div className="badge-row">
                    {roleHero.pillars.map((item) => (
                        <span key={item} className="badge-chip">{item}</span>
                    ))}
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="dashboard-hero-metrics">
                {metricKeys.map((key) => (
                    <MetricBox
                        key={key}
                        label={formatMetricLabel(key)}
                        value={metricData[key]}
                    />
                ))}
            </div>

            {/* Chart Grid */}
            <div className="dashboard-hero-grid">
                {/* Trend Chart Card */}
                <div className="dashboard-hero-card">
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

                {/* Distribution Chart Card */}
                <div className="dashboard-hero-card">
                    <div className="card-demo-header">
                        <h3 className="type-h4">{roleHero.distributionTitle}</h3>
                    </div>
                    <div className="dashboard-hero-distribution">
                        <BrandBarChart
                            data={roleHero.distribution}
                            categoryKey="name"
                            valueKey="value"
                            height={200}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroDashboard;
