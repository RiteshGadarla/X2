import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { emitMockAction } from '../utils/mockActionBus';

const LegalComplianceDashboard = () => {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/legal-overview')
            .then((res) => res.json())
            .then((data) => setOverview(data))
            .catch((err) => console.error(err));
    }, []);

    if (!overview) return null;

    const trendData = overview.weekly_flags;
    const breakdown = overview.case_breakdown;

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--error)' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Legal and Compliance Command Board</h3>
                <span className="badge badge-error">{overview.pending_approvals} Pending Reviews</span>
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
                    <div className="layout-card-title">Avg HIL Turnaround</div>
                    <div className="type-h2">{overview.avg_hil_turnaround}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px', marginTop: '20px' }}>
                <div>
                    <h4 style={{ fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '10px' }}>Weekly Compliance Flag Trend</h4>
                    <div style={{ height: '170px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--neutral-4)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: 'var(--neutral-4)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px' }} />
                                <Bar dataKey="flags" radius={[6, 6, 0, 0]} fill="var(--error)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                    <h4 style={{ fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '10px' }}>Case Type Distribution</h4>
                    <div style={{ height: '170px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={breakdown} innerRadius={38} outerRadius={62} dataKey="value" stroke="none">
                                    {breakdown.map((item) => (
                                        <Cell key={item.name} fill={item.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-sm btn-primary" onClick={() => emitMockAction('Legal response approved', 'Mock approval recorded for customer communication.', 'success')}>Approve Legal Response</button>
                <button className="btn btn-sm btn-ghost" onClick={() => emitMockAction('Policy revision requested', 'Mock compliance update routed to policy owners.', 'warning')}>Request Policy Revision</button>
            </div>
        </div>
    );
};

export default LegalComplianceDashboard;
