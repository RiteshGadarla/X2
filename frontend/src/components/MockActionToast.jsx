import { useEffect, useState } from 'react';
import { MOCK_ACTION_EVENT } from '../utils/mockActionBus';

const toneStyles = {
  info: { border: '1px solid var(--primary-border)', background: 'var(--primary-light)', color: 'var(--neutral-1)' },
  success: { border: '1px solid #86efac', background: 'var(--success-light)', color: '#14532d' },
  warning: { border: '1px solid #fcd34d', background: 'var(--warning-light)', color: '#78350f' }
};

const MockActionToast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const listener = (event) => {
      setToast(event.detail);
    };

    window.addEventListener(MOCK_ACTION_EVENT, listener);
    return () => window.removeEventListener(MOCK_ACTION_EVENT, listener);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  if (!toast) return null;

  const style = toneStyles[toast.tone] || toneStyles.info;

  return (
    <div className="mock-action-toast">
      <div style={{ ...style, borderRadius: '12px', boxShadow: 'var(--shadow-md)', padding: '10px 14px', minWidth: '260px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700' }}>{toast.title}</div>
        {toast.detail && <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.9 }}>{toast.detail}</div>}
      </div>
    </div>
  );
};

export default MockActionToast;
