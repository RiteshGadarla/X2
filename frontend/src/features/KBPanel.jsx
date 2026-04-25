import React, { useEffect, useState } from 'react';
import { emitMockAction } from '../utils/mockActionBus';

const KBPanel = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/features/kb')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) return null;

    return (
        <div className="card-demo" style={{ marginTop: '20px' }}>
            <div className="card-demo-header">
                <h3 className="type-h4">Knowledge Base Effectiveness Panel</h3>
            </div>
            <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Article effectiveness, resolution success, and gap analysis.</p>
            
            <div className="layout-card-grid" style={{ marginTop: '16px' }}>
                <div className="layout-card">
                    <div className="layout-card-title">Usage Rate</div>
                    <div className="type-h2">{stats.usage_rate}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Success Rate</div>
                    <div className="type-h2" style={{ color: 'var(--success)' }}>{stats.success_rate}</div>
                </div>
                <div className="layout-card">
                    <div className="layout-card-title">Drafts Pending HIL</div>
                    <div className="type-h2" style={{ color: 'var(--warning)' }}>{stats.drafts_pending}</div>
                </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--neutral-1)' }}>
                <strong>Top KB Gap:</strong> {stats.top_gap}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button id="kb_review_drafts_btn" className="btn btn-sm btn-primary" onClick={() => emitMockAction('KB drafts opened', 'Mock queue filtered to pending review articles.')}>Review Drafts</button>
                <button id="kb_create_new_btn" className="btn btn-sm btn-outline" onClick={() => emitMockAction('New KB draft created', 'Mock editor initialized with incident template.', 'success')}>Create Article</button>
            </div>
        </div>
    );
};

export default KBPanel;
