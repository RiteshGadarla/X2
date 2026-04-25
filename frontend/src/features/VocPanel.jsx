import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { emitMockAction } from '../utils/mockActionBus';

const VocPanel = () => {
    const [voc, setVoc] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/voc')
            .then(res => res.json())
            .then(data => setVoc(data))
            .catch(err => console.error(err));
    }, []);

    if (!voc) return null;

    // Simulated trend data based on mock global CSAT
    const trendData = [
        { week: 'W1', csat: 3.8 },
        { week: 'W2', csat: 4.0 },
        { week: 'W3', csat: 3.9 },
        { week: 'W4', csat: 4.1 },
        { week: 'W5', csat: 4.2 }
    ];

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--primary)' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Voice of Customer Panel</h3>
                <span className="badge badge-success">Trend Analysis</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Feature request frequency mapping and 5-week CSAT trending.</p>
            
            <div className="layout-card-grid" style={{ marginTop: '16px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">Avg Rolling CSAT</div>
                    <div className="type-h2" style={{ color: 'var(--success)' }}>{voc.csat_trend}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">At-Risk Customers</div>
                    <div className="type-h2" style={{ color: 'var(--error)' }}>{voc.at_risk_count}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px' }}>
                {/* Line Chart */}
                <div>
                    <h4 style={{ fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '12px' }}>CSAT 5-Week Trend</h4>
                    <div style={{ height: '160px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="week" tick={{fontSize: 9, fill: 'var(--neutral-4)'}} axisLine={false} tickLine={false} />
                                <YAxis domain={[3, 5]} tick={{fontSize: 9, fill: 'var(--neutral-4)'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '6px', fontSize: '11px', padding: '4px 8px'}} />
                                <Line type="monotone" dataKey="csat" stroke="var(--pink)" strokeWidth={3} dot={{r: 4, fill: 'var(--pink)'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Feature Requests Map */}
                <div>
                    <h4 style={{ fontSize: '12px', color: 'var(--neutral-2)', marginBottom: '8px' }}>Top Feature Requests</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {voc.feature_requests.map((f, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--neutral-8)', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontSize: '10.5px', color: 'var(--neutral-1)' }}>{f.area}</span>
                                <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: 'var(--primary)' }}>{f.frequency}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px' }}>
                <button
                    id="voc_export_report_btn"
                    className="btn btn-sm btn-ghost"
                    onClick={() => emitMockAction('VoC report exported', 'Mock monthly VoC packet delivered to Product and CX leadership.', 'success')}
                >
                    Export Monthly VoC Report
                </button>
            </div>
        </div>
    );
};

export default VocPanel;
