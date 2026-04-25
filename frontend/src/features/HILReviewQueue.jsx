import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';
import { BRAND_COLORS, BRAND_PALETTES, CHART_THEME } from '../config/brand';

const HILReviewQueue = () => {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        fetchJson('/api/features/hil')
            .then(data => setQueue(data.queue))
            .catch(err => console.error(err));
    }, []);

    const checkpointSummary = ['VIP Interaction', 'Billing Dispute', 'Legal Correspondence'].map((type, index) => ({
        name: type,
        value: queue.filter((entry) => entry.checkpoint_type === type).length,
        color: BRAND_PALETTES.checkpoint[index]
    })).filter((entry) => entry.value > 0);

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--warning)' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Escalation Queue and HIL Review Board</h3>
                <span className="badge badge-warning">{queue.length} Pending Actions</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Tickets requiring Human-in-the-Loop validation across billing, legal, and VIP escalations.</p>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">Escalation Mix</div>
                    <div style={{ height: '120px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={checkpointSummary}
                                    innerRadius={24}
                                    outerRadius={45}
                                    dataKey="value"
                                    stroke={BRAND_COLORS.neutral9}
                                    strokeWidth={2}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {checkpointSummary.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                        {checkpointSummary.map((entry) => (
                            <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: entry.color }} />
                                    <span style={{ fontSize: '10px', color: 'var(--neutral-3)' }}>{entry.name}</span>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--neutral-1)' }}>{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">SLA Action Window</div>
                    <div className="type-body" style={{ color: 'var(--neutral-4)', marginTop: '8px' }}>
                        Prioritize entries older than 2h first, then Enterprise tier checkpoints.
                    </div>
                    <div style={{ marginTop: '8px' }} className="badge badge-warning">HIL Gate Active</div>
                </div>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {queue.map(q => (
                    <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <span className="badge badge-error">{q.checkpoint_type}</span>
                                <strong style={{ fontSize: '12px', marginLeft: '8px', color: 'var(--neutral-1)' }}>{q.ticket_id}</strong>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--neutral-5)' }}>Waiting for {q.age}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button id={`hil_approve_${q.id}_btn`} className="btn btn-sm btn-primary" onClick={() => emitMockAction(`Approved ${q.ticket_id}`, 'Mock decision logged to ITSM.', 'success')}>Approve</button>
                            <button id={`hil_modify_${q.id}_btn`} className="btn btn-sm btn-secondary" onClick={() => emitMockAction(`Modify requested for ${q.ticket_id}`, 'Mock edit workflow sent to assigned agent.')}>Modify</button>
                            <button id={`hil_reject_${q.id}_btn`} className="btn btn-sm btn-ghost" onClick={() => emitMockAction(`Rejected ${q.ticket_id}`, 'Mock rejection reason captured for audit.', 'warning')}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '16px' }}>
                <button id="hil_approve_all_btn" className="btn btn-sm btn-outline" onClick={() => emitMockAction('Bulk approval executed', 'Mock standard escalations approved in queue.', 'success')}>Bulk Approve Standard Escapes</button>
            </div>
        </div>
    );
};

export default HILReviewQueue;
