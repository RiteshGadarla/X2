import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { Shield, ShieldCheck, ChevronRight } from 'lucide-react';

const RoleSelector = () => {
    const { rolesList, setRole, rolesLoading, rolesError } = useAuth();
    const [selectedId, setSelectedId] = useState("");

    const handleLogin = () => {
        if (selectedId) setRole(selectedId);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)' }}>
            <div className="card-demo" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="card-demo-icon" style={{ margin: '0 auto 12px' }}>
                        <Shield color="var(--primary)" size={20} />
                    </div>
                    <h2 className="type-h3" style={{ marginBottom: '8px' }}>aegis.ai Access Control</h2>
                    <p className="type-body" style={{ color: 'var(--neutral-4)' }}>Select a role profile to initialize the RBAC dashboard context.</p>
                </div>
                
                <div className="layout-form-field">
                    <label className="layout-form-label">Active Directory Profile</label>
                    <select 
                        id="global_select_role_dropdown"
                        className="input-demo" 
                        value={selectedId} 
                        onChange={(e) => setSelectedId(e.target.value)}
                        disabled={rolesLoading}
                    >
                        <option value="" disabled>{rolesLoading ? '-- Loading roles --' : '-- Select a testing role --'}</option>
                        {rolesList.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    {rolesError && (
                        <p className="type-caption" style={{ color: 'var(--warning)', marginTop: '6px' }}>{rolesError}</p>
                    )}
                </div>

                <button 
                    id="global_login_btn"
                    className="btn btn-primary" 
                    onClick={handleLogin} 
                    disabled={!selectedId || rolesLoading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <ShieldCheck size={16} /> Authenticate
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default RoleSelector;
