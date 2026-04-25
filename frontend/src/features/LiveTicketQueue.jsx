import { useEffect, useMemo, useState } from 'react';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';
import BrandPieChart from '../components/BrandPieChart';
import { BRAND_PALETTES } from '../config/brand';

const slaPriorityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const ticketPriorityRank = { P1: 0, P2: 1, P3: 2, P4: 3 };
const customerTierRank = { Enterprise: 0, Business: 1, Standard: 2 };
const priorityColors = BRAND_PALETTES.priorityByTicket;

const parseTimeRemainingMinutes = (timeRemaining = '') => {
    return timeRemaining.split(' ').reduce((total, part) => {
        const value = Number.parseInt(part, 10);

        if (Number.isNaN(value)) return total;
        if (part.endsWith('d')) return total + value * 24 * 60;
        if (part.endsWith('h')) return total + value * 60;
        if (part.endsWith('m')) return total + value;

        return total;
    }, 0);
};

const getSlaPriority = (timeRemaining) => {
    const minutes = parseTimeRemainingMinutes(timeRemaining);

    if (minutes <= 60) return 'Critical';
    if (minutes <= 4 * 60) return 'High';
    if (minutes <= 8 * 60) return 'Medium';
    return 'Low';
};

const sortTicketsByQueuePriority = (ticketList) => {
    return [...ticketList].sort((a, b) => {
        const aSlaPriority = a.sla_priority || getSlaPriority(a.time_remaining);
        const bSlaPriority = b.sla_priority || getSlaPriority(b.time_remaining);
        const aTimeRemaining = a.time_remaining_minutes ?? parseTimeRemainingMinutes(a.time_remaining);
        const bTimeRemaining = b.time_remaining_minutes ?? parseTimeRemainingMinutes(b.time_remaining);

        return (
            (a.sla_priority_rank ?? slaPriorityRank[aSlaPriority] ?? 99) - (b.sla_priority_rank ?? slaPriorityRank[bSlaPriority] ?? 99) ||
            (a.priority_rank ?? ticketPriorityRank[a.priority] ?? 99) - (b.priority_rank ?? ticketPriorityRank[b.priority] ?? 99) ||
            (a.customer_tier_rank ?? customerTierRank[a.tier] ?? 99) - (b.customer_tier_rank ?? customerTierRank[b.tier] ?? 99) ||
            aTimeRemaining - bTimeRemaining ||
            a.id.localeCompare(b.id)
        );
    });
};

const LiveTicketQueue = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchJson('/api/features/tickets')
            .then(data => setTickets(data.tickets))
            .catch(err => console.error(err));
    }, []);

    const sortedTickets = useMemo(() => sortTicketsByQueuePriority(tickets), [tickets]);

    const getStatusBadge = (status) => {
        if (status === 'In Progress') return 'badge-primary';
        if (status === 'HIL Legal') return 'badge-error';
        if (status === 'Routed') return 'badge-cyan';
        return 'badge-warning'; // Ack
    };

    const priorityCounts = ['P1', 'P2', 'P3', 'P4'].map((priority) => ({
        name: priority,
        value: tickets.filter((ticket) => ticket.priority === priority).length,
        color: priorityColors[priority]
    }));
    const priorityData = priorityCounts.filter((entry) => entry.value > 0);

    return (
        <div className="card-demo" style={{ marginTop: '20px' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Live Ticket Queue and Intake Dashboard</h3>
                <span className="badge badge-primary">Active</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Real-time view of all open tickets sorted by SLA priority, ticket priority, and customer tier.</p>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(260px, 0.85fr)', gap: '14px', alignItems: 'stretch' }}>
                <div className="layout-card" style={{ minHeight: '154px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div>
                            <div className="layout-card-title">Queue Snapshot</div>
                            <div style={{ marginTop: '3px', fontSize: '10px', color: 'var(--neutral-4)' }}>Open workload by ticket priority</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>Total</div>
                            <div className="type-h2" style={{ color: 'var(--neutral-1)', lineHeight: 1 }}>{tickets.length}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(72px, 1fr))', gap: '8px', marginTop: '14px' }}>
                        {priorityCounts.map((entry) => {
                            const percent = tickets.length ? Math.round((entry.value / tickets.length) * 100) : 0;

                            return (
                                <div key={entry.name} style={{ border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '9px 10px', background: 'var(--neutral-9)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: entry.color }}>{entry.name}</span>
                                        <span style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>{percent}%</span>
                                    </div>
                                    <div style={{ marginTop: '6px', fontSize: '22px', lineHeight: 1, fontWeight: 800, color: entry.color }}>{entry.value}</div>
                                    <div style={{ marginTop: '8px', height: '4px', borderRadius: '999px', background: 'var(--neutral-7)', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', background: entry.color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="layout-card" style={{ minHeight: '154px', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
                    <div>
                        <div className="layout-card-title">Priority Mix</div>
                        <div style={{ marginTop: '3px', fontSize: '10px', color: 'var(--neutral-4)' }}>Current open queue</div>
                    </div>

                    <BrandPieChart data={priorityData} height={118} innerRadius={28} outerRadius={46} legend={false} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '10px', fontWeight: 700 }}>
                        {priorityCounts.map((entry) => (
                            <div key={entry.name} style={{ color: entry.color, textAlign: 'center', whiteSpace: 'nowrap' }}>{entry.name}: {entry.value}</div>
                        ))}
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
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Priority</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>SLA Priority</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>SLA Left</th>
                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--neutral-7)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTickets.map(t => {
                            const slaPriority = t.sla_priority || getSlaPriority(t.time_remaining);

                            return (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--neutral-8)' }}>
                                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--primary)' }}>{t.id}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--neutral-1)' }}>{t.customer}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--neutral-4)' }}>{t.tier}</td>
                                <td style={{ padding: '10px 12px', color: 'var(--neutral-2)' }}>{t.summary}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <span className={`badge ${getStatusBadge(t.status)}`}>{t.status}</span>
                                </td>
                                <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--neutral-2)' }}>{t.priority}</td>
                                <td style={{ padding: '10px 12px', color: slaPriority === 'Critical' ? 'var(--error)' : 'var(--neutral-2)' }}>{slaPriority}</td>
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveTicketQueue;
