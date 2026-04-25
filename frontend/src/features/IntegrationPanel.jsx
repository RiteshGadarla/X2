import { useEffect, useState } from 'react';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';
import BrandPieChart from '../components/BrandPieChart';

const IntegrationPanel = () => {
    const [channels, setChannels] = useState(null);

    useEffect(() => {
        fetchJson('/api/features/channels')
            .then(data => setChannels(data))
            .catch(err => console.error(err));
    }, []);

    if (!channels) return null;

    const data = [
        { name: 'Email', value: channels.email },
        { name: 'Chat', value: channels.chat },
        { name: 'Portal', value: channels.portal },
        { name: 'Slack', value: channels.slack },
        { name: 'WhatsApp', value: channels.whatsapp },
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
                <BrandPieChart
                    data={data}
                    height={220}
                    innerRadius={60}
                    outerRadius={80}
                    centerLabel={{ label: 'Peak Intake', value: channels.peak_hour }}
                />
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
