import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { emitMockAction } from '../utils/mockActionBus';

const SentimentFeed = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/tickets')
            .then(res => res.json())
            .then(data => {
                // Prioritize highest-risk sentiment states at top.
                const rank = { Angry: 0, Frustrated: 1, Neutral: 2 };
                const sorted = [...data.tickets].sort((a, b) => (rank[a.sentiment] ?? 99) - (rank[b.sentiment] ?? 99));
                setTickets(sorted);
            })
            .catch(err => console.error(err));
    }, []);

    const getSentimentColor = (sentiment) => {
        if (sentiment === 'Angry' || sentiment === 'Frustrated') return 'var(--error)';
        return 'var(--neutral-4)';
    };

    const sentimentData = [
        { name: 'Angry', count: tickets.filter((t) => t.sentiment === 'Angry').length },
        { name: 'Frustrated', count: tickets.filter((t) => t.sentiment === 'Frustrated').length },
        { name: 'Neutral', count: tickets.filter((t) => t.sentiment === 'Neutral').length },
    ];

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--pink)' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Customer Sentiment Feed</h3>
                <span className="badge badge-pink">Live Feed</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Real-time feed with angry and escalation-risk tickets pinned.</p>

            <div style={{ marginTop: '16px', height: '150px', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--neutral-4)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--neutral-4)' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px' }} />
                        <Bar dataKey="count" fill="var(--pink)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tickets.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--neutral-8)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                            <strong style={{ fontSize: '11px', color: 'var(--primary)' }}>{t.id} - {t.customer}</strong>
                            <p style={{ fontSize: '10px', color: 'var(--neutral-2)' }}>{t.summary}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: getSentimentColor(t.sentiment) }}>
                                {t.sentiment.toUpperCase()}
                            </span>
                            { (t.sentiment === 'Angry' || t.sentiment === 'Frustrated') && 
                                <button
                                    id={`sentiment_escalate_${t.id}_btn`}
                                    className="btn btn-sm btn-primary"
                                    onClick={() => emitMockAction(`Intervention triggered for ${t.id}`, 'Mock escalation task assigned to support manager.', 'warning')}
                                >
                                    Intervene
                                </button> 
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentimentFeed;
