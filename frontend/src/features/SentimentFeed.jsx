import { useEffect, useState } from 'react';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';
import { BRAND_COLORS } from '../config/brand';
import { BrandBarChart } from '../components/BrandPieChart';

const SentimentFeed = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchJson('/api/features/tickets')
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

            <div style={{ marginTop: '16px', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                <BrandBarChart data={sentimentData} categoryKey="name" valueKey="count" color={BRAND_COLORS.pink} height={150} />
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
                                    data-testid={`sentiment-intervene-${t.id}-btn`}
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
