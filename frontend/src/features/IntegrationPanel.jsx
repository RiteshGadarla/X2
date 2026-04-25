import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { emitMockAction } from '../utils/mockActionBus';

const IntegrationPanel = () => {
    const [channels, setChannels] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/channels')
            .then(res => res.json())
            .then(data => setChannels(data))
            .catch(err => console.error(err));
    }, []);

    if (!channels) return null;

    const data = [
        { name: 'Email', value: channels.email, color: '#5929d0' },
        { name: 'Chat', value: channels.chat, color: '#CF008B' },
        { name: 'Portal', value: channels.portal, color: '#22D3EE' },
        { name: 'Slack', value: channels.slack, color: '#16A34A' },
        { name: 'WhatsApp', value: channels.whatsapp, color: '#E4902E' },
    ];

    return (
        <div className="card-demo" style={{ marginTop: '20px' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Channel Volume & Integration Panel</h3>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Inbound volume distribution and active system integrations.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
                {/* Volume Metrics */}
                <div className="layout-card-grid" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
                    <div className="layout-card">
                        <div className="layout-card-title">Total Email Volume</div>
                        <div className="type-h2">{channels.email}</div>
                    </div>
                    <div className="layout-card">
                        <div className="layout-card-title">Live Chat / Portal</div>
                        <div className="type-h2">{channels.chat + channels.portal}</div>
                    </div>
                    <div className="layout-card">
                        <div className="layout-card-title">Slack / WhatsApp</div>
                        <div className="type-h2">{channels.slack + channels.whatsapp}</div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px'}} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>Peak Intake</div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{channels.peak_hour}</div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <button
                    id="settings_refresh_sync_btn"
                    className="btn btn-sm btn-outline"
                    onClick={() => emitMockAction('Integration sync started', 'Mock Jira and Salesforce sync queued.', 'success')}
                >
                    Force Sync Jira / Salesforce
                </button>
            </div>
        </div>
    );
};

export default IntegrationPanel;
