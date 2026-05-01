import { emitMockAction } from '../utils/mockActionBus';
import { BRAND_COLORS } from '../config/brand';
import { BrandBarChart } from '../components/BrandPieChart';

const SLACompliance = () => {
    const data = [
        { name: 'P1 (Critical)', compliance: 98.2, target: 99 },
        { name: 'P2 (High)', compliance: 94.5, target: 95 },
        { name: 'P3 (Normal)', compliance: 88.0, target: 90 },
        { name: 'P4 (Low)', compliance: 99.1, target: 80 },
    ];

    return (
        <div className="card-demo" style={{ marginTop: '20px' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">SLA Compliance Dashboard</h3>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Per-priority compliance rate tracking vs targets.</p>
            
            <div className="layout-card-grid" style={{ marginTop: '16px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">P1 Resolution SLA</div>
                    <div className="type-h2" style={{ color: 'var(--success)' }}>98.2%</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Overdue Tickets</div>
                    <div className="type-h2" style={{ color: 'var(--error)' }}>14</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">At Risk (&lt; 25% SLA left)</div>
                    <div className="type-h2" style={{ color: 'var(--warning)' }}>42</div>
                </div>
            </div>

            <h4 style={{ marginTop: '32px', fontSize: '13px', color: 'var(--neutral-2)', marginBottom: '16px' }}>Priority SLA Adherence (%)</h4>
            <BrandBarChart
                data={data}
                categoryKey="name"
                height={240}
                series={[
                    { key: 'compliance', label: 'Actual Compliance', color: BRAND_COLORS.primary },
                    { key: 'target', label: 'Target SLA', color: BRAND_COLORS.neutral6 },
                ]}
                valueFormatter={(value) => `${value}%`}
                showLegend
            />

            <div style={{ marginTop: '24px' }}>
                <button
                    id="sla_export_report_btn"
                    data-testid="sla-export-report-btn"
                    data-tour="sla-export-report"
                    className="btn btn-sm btn-ghost"
                    onClick={() => emitMockAction('SLA report exported', 'Mock CSV and dashboard snapshot sent to email.', 'success')}
                >
                    Export SLA Report
                </button>
            </div>
        </div>
    );
};

export default SLACompliance;
