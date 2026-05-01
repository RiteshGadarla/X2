import { useEffect, useState } from 'react';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';
import { BRAND_COLORS } from '../config/brand';
import BrandPieChart, { BrandBarChart } from '../components/BrandPieChart';

const LegalComplianceDashboard = () => {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        fetchJson('/api/features/legal-overview')
            .then((data) => setOverview(data))
            .catch((err) => console.error(err));
    }, []);

    if (!overview) return null;

    const trendData = overview.weekly_flags;
    const breakdown = overview.case_breakdown;

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--error)' }}>
            <div className="card-demo-header" style={{ marginBottom: '12px' }}>
                <h3 className="type-h4" style={{ fontWeight: 700, fontSize: '18px' }}>Legal and Compliance Command Board</h3>
                <span className="badge badge-error" style={{ padding: '4px 12px' }}>{overview.pending_approvals} Pending Reviews</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>
                Central queue for legal correspondence approvals, compliance risks, and policy-safe customer communication.
            </p>

            <div className="layout-card-grid" style={{ marginTop: '16px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">Active Legal Cases</div>
                    <div className="type-h2" style={{ color: 'var(--error)' }}>{overview.active_cases}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Blocked Communications</div>
                    <div className="type-h2" style={{ color: 'var(--warning)' }}>{overview.blocked_comms}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Avg Review Turnaround</div>
                    <div className="type-h2">{overview.avg_review_turnaround}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px', marginTop: '20px' }}>
                <div>
                    <h4 style={{ fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '10px' }}>Weekly Compliance Flag Trend</h4>
                    <BrandBarChart data={trendData} categoryKey="day" valueKey="flags" color={BRAND_COLORS.error} height={170} />
                </div>
                <div>
                    <h4 style={{ fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '10px' }}>Case Type Distribution</h4>
                    <div style={{ height: '170px' }}>
                        <BrandPieChart data={breakdown} height={170} innerRadius={38} outerRadius={62} />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '48px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-sm btn-primary" id="legal_approve_response_btn" data-testid="legal-approve-response-btn" data-tour="legal-approve-response" style={{ paddingLeft: '20px', paddingRight: '20px' }} onClick={() => emitMockAction('Legal response approved', 'Mock approval recorded for customer communication.', 'success')}>Approve Legal Response</button>
                <button className="btn btn-sm btn-ghost" id="legal_request_policy_revision_btn" data-testid="legal-request-revision-btn" style={{ paddingLeft: '20px', paddingRight: '20px' }} onClick={() => emitMockAction('Policy revision requested', 'Mock compliance update routed to policy owners.', 'warning')}>Request Policy Revision</button>
            </div>
        </div>
    );
};

export default LegalComplianceDashboard;
