import { env } from '../config/env';
import { fetchJson } from '../api/client';

export const MOCK_ACTION_EVENT = 'mock-action-event';
export const LOGS_UPDATED_EVENT = 'logs-updated-event';

export const emitMockAction = (title, detail = '', tone = 'info') => {
  if (!env.enableMockActions) return;

  // Dispatch the toast event immediately
  window.dispatchEvent(
    new CustomEvent(MOCK_ACTION_EVENT, {
      detail: {
        title,
        detail,
        tone
      }
    })
  );

  // Send interaction to the DB for Live Logs
  const requestBody = {
    severity: tone,
    source: 'User Action',
    message: `${title}: ${detail}`,
    role_scope: 'System'
  };

  fetchJson('/api/features/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  }).then(() => {
    // Notify components like ActivityLogSidebar to refetch logs
    window.dispatchEvent(new CustomEvent(LOGS_UPDATED_EVENT));
  }).catch(err => {
    console.error('Failed to log action to DB', err);
  });
};
