import { useEffect, useState } from 'react';
import { fetchJson } from '../api/client';
import { emitMockAction } from '../utils/mockActionBus';

const CustomerPortal = () => {
    const [portalData, setPortalData] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [myTickets, setMyTickets] = useState([]);
    const [form, setForm] = useState({
        title: '',
        product_area: 'Payments',
        issue_type: 'Billing/Account',
        description: '',
        business_impact: ''
    });
    const [acknowledged, setAcknowledged] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMyTickets = async () => {
        try {
            const tickets = await fetchJson('/api/tickets/');
            setMyTickets(tickets);
        } catch (err) {
            console.error(err);
        }
    };

    const submitTicket = async () => {
        if (!form.title.trim() || !form.description.trim() || !form.business_impact.trim()) {
            emitMockAction('Ticket not submitted', 'Please complete title, description, and business impact before submit.', 'warning');
            return;
        }

        if (!customerId) {
            emitMockAction('Error', 'No customer account found to submit ticket.', 'error');
            return;
        }

        setIsSubmitting(true);

        // Map form issue type to backend enum ticket_type
        let mappedType = "enhancement";
        if (form.issue_type === "Bug") mappedType = "bug";
        if (form.issue_type === "Access Issue") mappedType = "access";
        if (form.issue_type === "Performance Issue") mappedType = "performance";
        if (form.issue_type === "Billing/Account") mappedType = "billing";

        try {
            await fetchJson('/api/tickets/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: customerId,
                    title: form.title,
                    description: form.description,
                    ticket_type: mappedType,
                    source_channel: "portal",
                    affected_product_area: form.product_area,
                    business_impact: form.business_impact
                })
            });
            emitMockAction('Ticket submitted', 'Ticket was successfully created via the CSAgent API.', 'success');
            setForm((prev) => ({ ...prev, title: '', description: '', business_impact: '' }));
            fetchMyTickets();
        } catch (err) {
            console.error(err);
            emitMockAction('Submit failed', 'Failed to create ticket: ' + err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchJson('/api/features/customer-portal')
            .then((data) => setPortalData(data))
            .catch((err) => console.error(err));

        // Fetch a mock customer to act as the current user
        fetchJson('/api/customers/')
            .then((customers) => {
                if (customers.length > 0) {
                    setCustomerId(customers[0].customer_id);
                }
            })
            .catch(err => console.error(err));

        fetchMyTickets();
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
                    <input type="checkbox" id="portal_ai_acknowledge_checkbox" data-testid="portal-ai-acknowledge" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} />
                    I understand and want to continue
                </label>
            </div>

            <div style={{ marginTop: '14px', border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <h4 className="type-h4" style={{ marginBottom: '10px' }}>Submit New Ticket</h4>
                <div className="layout-form-field" style={{ marginBottom: '10px' }}>
                    <label className="layout-form-label">Issue Title</label>
                    <input
                        type="text"
                        className="input-demo"
                        placeholder="Brief summary of the issue"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        id="ticket_title_input"
                        data-testid="ticket-title-input"
                        data-tour="ticket-title-input"
                    />
                </div>
                <div className="layout-form-grid">
                    <div className="layout-form-field">
                        <label className="layout-form-label">Product Area</label>
                        <select className="input-demo" id="ticket_product_area_select" data-testid="ticket-product-area-select" value={form.product_area} onChange={(e) => setForm({ ...form, product_area: e.target.value })}>
                            {portalData.product_areas.map((entry) => <option key={entry}>{entry}</option>)}
                        </select>
                    </div>
                    <div className="layout-form-field">
                        <label className="layout-form-label">Issue Type</label>
                        <select className="input-demo" id="ticket_issue_type_select" data-testid="ticket-issue-type-select" value={form.issue_type} onChange={(e) => setForm({ ...form, issue_type: e.target.value })}>
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
                        id="ticket_description_textarea"
                        data-testid="ticket-description-textarea"
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
                        id="ticket_business_impact_textarea"
                        data-testid="ticket-business-impact-textarea"
                    />
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-sm btn-primary" id="ticket_submit_btn" data-testid="ticket-submit-btn" data-tour="ticket-submit" disabled={!acknowledged || isSubmitting} onClick={submitTicket}>
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                    <button className="btn btn-sm btn-ghost" id="ticket_attach_evidence_btn" data-testid="ticket-attach-btn" onClick={() => emitMockAction('Attachment flow opened', 'Mock file upload dialog prepared.')}>Attach Evidence</button>
                </div>
            </div>

            <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">My Open Tickets</div>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {myTickets.length === 0 ? (
                            <div style={{ fontSize: '11px', color: 'var(--neutral-4)' }}>No tickets found.</div>
                        ) : myTickets.map((ticket) => (
                            <div key={ticket.ticket_id} style={{ border: '1px solid var(--neutral-7)', borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <strong style={{ fontSize: '11px', color: 'var(--primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>{ticket.title}</strong>
                                    <span className="badge badge-primary">{ticket.status}</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-2)' }}>Priority: {ticket.priority} | Type: {ticket.ticket_type}</div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-4)' }}>Created: {new Date(ticket.created_at).toLocaleString()}</div>
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
