import { useState } from 'react';
import { emitMockAction } from '../utils/mockActionBus';
import { BRAND_COLORS } from '../config/brand';
import { BrandAreaChart } from '../components/BrandPieChart';

const ExecutiveDashboard = () => {
    const [stats] = useState({
        "total_revenue_protected": "$1.2M",
        "open_p1": 4,
        "global_csat": "4.6/5"
    });

    const revenueTrend = [
        { month: 'Jan', revenue: 900000 },
        { month: 'Feb', revenue: 950000 },
        { month: 'Mar', revenue: 1050000 },
        { month: 'Apr', revenue: 1100000 },
        { month: 'May', revenue: 1200000 }
    ];

    const formatCurrency = (val) => `$${(val / 1000000).toFixed(1)}M`;

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--primary)' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Executive Support Summary</h3>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>High-level rollup of operational health and financial mitigation.</p>
            
            <div className="layout-card-grid" style={{ marginTop: '16px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">At-Risk Revenue Protected</div>
                    <div className="type-h2" style={{ color: 'var(--success)' }}>{stats.total_revenue_protected}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Active P1 Major Outages</div>
                    <div className="type-h2" style={{ color: 'var(--error)' }}>{stats.open_p1}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Global Aggregate CSAT</div>
                    <div className="type-h2">{stats.global_csat}</div>
                </div>
            </div>

            <h4 style={{ marginTop: '32px', fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '12px' }}>Protected Revenue Trend (YTD)</h4>
            <BrandAreaChart data={revenueTrend} categoryKey="month" valueKey="revenue" color={BRAND_COLORS.success} height={200} valueFormatter={formatCurrency} />

            <div style={{ marginTop: '24px' }}>
                <button
                    id="exec_export_rollup_btn"
                    data-testid="exec-export-rollup-btn"
                    data-tour="exec-export-rollup"
                    className="btn btn-sm btn-primary"
                    onClick={() => emitMockAction('Executive rollup downloaded', 'Mock R-01 digest generated with SLA and CSAT summary.', 'success')}
                >
                    Download Daily R-01 Rollup
                </button>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;
