export const MOCK_ACTION_EVENT = 'mock-action-event';

export const emitMockAction = (title, detail = '', tone = 'info') => {
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
