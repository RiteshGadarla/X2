import { useEffect, useState } from 'react';
import { MOCK_ACTION_EVENT } from '../utils/mockActionBus';

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

  const tone = ['info', 'success', 'warning'].includes(toast.tone) ? toast.tone : 'info';

  return (
    <div className="mock-action-toast">
      <div className={`mock-action-toast-card ${tone}`}>
        <div className="mock-action-toast-title">{toast.title}</div>
        {toast.detail && <div className="mock-action-toast-detail">{toast.detail}</div>}
      </div>
    </div>
  );
};

export default MockActionToast;
