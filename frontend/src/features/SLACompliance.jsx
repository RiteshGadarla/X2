import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { emitMockAction } from '../utils/mockActionBus';

const SLACompliance = () => {
    const data = [
        { name: 'P1 (Critical)', compliance: 98.2, target: 99 },
        { name: 'P2 (High)', compliance: 94.5, target: 95 },
        { name: 'P3 (Normal)', compliance: 88.0, target: 90 },
        { name: 'P4 (Low)', compliance: 99.1, target: 80 },
    ];

    return (
        <div className="card-demo" style={{ marginTop: '20px' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">SLA Compliance Dashboard</h3>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Per-priority compliance rate tracking vs targets.</p>
            
            <div className="layout-card-grid" style={{ marginTop: '16px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">P1 Resolution SLA</div>
                    <div className="type-h2" style={{ color: 'var(--success)' }}>98.2%</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Overdue Tickets</div>
                    <div className="type-h2" style={{ color: 'var(--error)' }}>14</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">At Risk (&lt; 25% SLA left)</div>
                    <div className="type-h2" style={{ color: 'var(--warning)' }}>42</div>
                </div>
            </div>

            <h4 style={{ marginTop: '32px', fontSize: '13px', color: 'var(--neutral-2)', marginBottom: '16px' }}>Priority SLA Adherence (%)</h4>
            <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{fontSize: 10, fill: 'var(--neutral-4)'}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 10, fill: 'var(--neutral-4)'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'var(--neutral-8)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--neutral-7)', fontSize: '11px'}} />
                        <Bar dataKey="compliance" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" fill="var(--neutral-6)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{width:'10px', height:'10px', background:'var(--primary)', borderRadius:'2px'}}></div><span style={{fontSize:'10px', color:'var(--neutral-4)'}}>Actual Compliance</span>
                <div style={{width:'10px', height:'10px', background:'var(--neutral-6)', borderRadius:'2px', marginLeft:'10px'}}></div><span style={{fontSize:'10px', color:'var(--neutral-4)'}}>Target SLA</span>
            </div>

            <div style={{ marginTop: '24px' }}>
                <button
                    id="sla_export_report_btn"
                    className="btn btn-sm btn-ghost"
                    onClick={() => emitMockAction('SLA report exported', 'Mock CSV and dashboard snapshot sent to email.', 'success')}
                >
                    Export SLA Report
                </button>
            </div>
        </div>
    );
};

export default SLACompliance;
