const requiredEnv = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
};

const missingKeys = Object.entries(requiredEnv)
    .filter(([, value]) => typeof value !== 'string' || value.trim() === '')
    .map(([key]) => key);

if (missingKeys.length > 0) {
    throw new Error(`Missing required frontend environment variables: ${missingKeys.join(', ')}`);
}

export const env = {
    apiBaseUrl: requiredEnv.VITE_API_BASE_URL.replace(/\/+$/, ''),
    appEnv: requiredEnv.VITE_APP_ENV,
    enableMockActions: import.meta.env.VITE_ENABLE_MOCK_ACTIONS === 'true',
};
