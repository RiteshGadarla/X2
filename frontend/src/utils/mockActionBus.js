import { env } from '../config/env';

export const MOCK_ACTION_EVENT = 'mock-action-event';

export const emitMockAction = (title, detail = '', tone = 'info') => {
  if (!env.enableMockActions) return;

  window.dispatchEvent(
    new CustomEvent(MOCK_ACTION_EVENT, {
      detail: {
        title,
        detail,
        tone
      }
    })
  );
};
