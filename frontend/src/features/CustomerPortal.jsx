import { useEffect, useState } from 'react';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';

const CustomerPortal = () => {
    const [portalData, setPortalData] = useState(null);
    const [form, setForm] = useState({
        product_area: 'Payments',
        issue_type: 'Bug',
        description: '',
        business_impact: ''
    });
    const [acknowledged, setAcknowledged] = useState(false);

    const submitTicket = () => {
        if (!form.description.trim() || !form.business_impact.trim()) {
            emitMockAction('Ticket not submitted', 'Please complete description and business impact before submit.', 'warning');
            return;
        }
        emitMockAction('Ticket submitted', 'Mock confirmation email and SLA target shared.', 'success');
        setForm((prev) => ({ ...prev, description: '', business_impact: '' }));
    };

    useEffect(() => {
        fetchJson('/api/features/customer-portal')
            .then((data) => setPortalData(data))
            .catch((err) => console.error(err));
    }, []);

    if (!portalData) return null;

    return (
        <div className="card-demo" style={{ marginTop: '20px', borderLeft: '4px solid var(--cyan)' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Customer Ticket Portal</h3>
                <span className="badge badge-cyan">Customer Portal</span>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>
                Submit support tickets, track SLA commitments, and get linked knowledge base help in one place.
            </p>

            <div style={{ marginTop: '12px', background: 'var(--cyan-light)', border: '1px solid var(--cyan)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--neutral-1)', marginBottom: '6px' }}>
                    You are being assisted by an AI-powered Customer Support Agent. Human support specialists are always available for escalation.
                </div>
                <label style={{ fontSize: '11px', color: 'var(--neutral-2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} />
                    I understand and want to continue
                </label>
            </div>

            <div style={{ marginTop: '14px', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <h4 className="type-h4" style={{ marginBottom: '10px' }}>Submit New Ticket</h4>
                <div className="layout-form-grid">
                    <div className="layout-form-field">
                        <label className="layout-form-label">Product Area</label>
                        <select className="input-demo" value={form.product_area} onChange={(e) => setForm({ ...form, product_area: e.target.value })}>
                            {portalData.product_areas.map((entry) => <option key={entry}>{entry}</option>)}
                        </select>
                    </div>
                    <div className="layout-form-field">
                        <label className="layout-form-label">Issue Type</label>
                        <select className="input-demo" value={form.issue_type} onChange={(e) => setForm({ ...form, issue_type: e.target.value })}>
                            {portalData.issue_types.map((entry) => <option key={entry}>{entry}</option>)}
                        </select>
                    </div>
                </div>
                <div className="layout-form-field" style={{ marginBottom: '10px' }}>
                    <label className="layout-form-label">Description</label>
                    <textarea
                        className="input-demo"
                        rows={3}
                        placeholder="Describe the issue, error message, and expected behavior."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div className="layout-form-field">
                    <label className="layout-form-label">Business Impact</label>
                    <textarea
                        className="input-demo"
                        rows={2}
                        placeholder="Describe user or revenue impact."
                        value={form.business_impact}
                        onChange={(e) => setForm({ ...form, business_impact: e.target.value })}
                    />
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-sm btn-primary" disabled={!acknowledged} onClick={submitTicket}>Submit Ticket</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => emitMockAction('Attachment flow opened', 'Mock file upload dialog prepared.')}>Attach Evidence</button>
                </div>
            </div>

            <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">My Open Tickets</div>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {portalData.tickets.map((ticket) => (
                            <div key={ticket.id} style={{ border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <strong style={{ fontSize: '11px', color: 'var(--primary)' }}>{ticket.id}</strong>
                                    <span className="badge badge-primary">{ticket.status}</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-2)' }}>{ticket.summary}</div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>SLA target: {ticket.sla_target}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Suggested Knowledge Articles</div>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {portalData.linked_kb.map((entry) => (
                            <div key={entry.title} style={{ background: 'var(--neutral-8)', borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                                <div style={{ fontSize: '10.5px', color: 'var(--neutral-1)', fontWeight: '600' }}>{entry.title}</div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>{entry.tag}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerPortal;
