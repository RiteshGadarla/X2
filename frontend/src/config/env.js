const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://134.33.132.134/luka-aegis';
const appEnv = import.meta.env.VITE_APP_ENV || 'production';

export const env = {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''),
    appEnv: appEnv,
    enableMockActions: import.meta.env.VITE_ENABLE_MOCK_ACTIONS === 'true',
};
