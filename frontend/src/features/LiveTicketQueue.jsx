import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { emitMockAction } from '../utils/mockActionBus';

const LiveTicketQueue = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/tickets')
            .then(res => res.json())
            .then(data => setTickets(data.tickets))
            .catch(err => console.error(err));
    }, []);

    const getStatusBadge = (status) => {
        if (status === 'In Progress') return 'badge-primary';
        if (status === 'HIL Legal') return 'badge-error';
        if (status === 'Routed') return 'badge-cyan';
        return 'badge-warning'; // Ack
    };

    const priorityData = ['P1', 'P2', 'P3', 'P4'].map((priority, index) => ({
        name: priority,
        value: tickets.filter((ticket) => ticket.priority === priority).length,
        color: ['#DC2626', '#E4902E', '#5929d0', '#22D3EE'][index]
    })).filter((entry) => entry.value > 0);

    return (
        <div className="card-demo" style={{ marginTop: '20px' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Live Ticket Queue and Intake Dashboard</h3>
                <span className="badge badge-primary">Active</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Real-time view of all open tickets sorted by SLA urgency.</p>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">Queue Snapshot</div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>Open Tickets</div>
                            <div className="type-h3">{tickets.length}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>Critical (P1/P2)</div>
                            <div className="type-h3" style={{ color: 'var(--error)' }}>
                                {tickets.filter((ticket) => ticket.priority === 'P1' || ticket.priority === 'P2').length}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="layout-card" style={{ height: '130px' }}>
                    <div style={{ height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={priorityData} innerRadius={26} outerRadius={42} dataKey="value" stroke="none">
                                    {priorityData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '16px', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
                    <thead style={{ background: 'var(--neutral-8)', color: 'var(--neutral-4)' }}>
                        <tr>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>ID</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Customer</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Tier</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Summary</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Status</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>SLA Left</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--neutral-8)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--primary)' }}>{t.id}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--neutral-1)' }}>{t.customer}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--neutral-4)' }}>{t.tier}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--neutral-2)' }}>{t.summary}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <span className={`badge ${getStatusBadge(t.status)}`}>{t.status}</span>
                                </td>
                                <td style={{ padding: '10px 12px', fontWeight: '600', color: t.time_remaining.includes('m') ? 'var(--error)' : 'var(--success)' }}>{t.time_remaining}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <button
                                        id={`tickets_view_${t.id}_btn`}
                                        className="btn btn-sm btn-outline"
                                        onClick={() => emitMockAction(`Opened ${t.id}`, `Mock ticket review started for ${t.customer}.`)}
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveTicketQueue;
