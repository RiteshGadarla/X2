import { env } from '../config/env';

export const apiUrl = (path) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${env.apiBaseUrl}${normalizedPath}`;
};

export const fetchJson = async (path, options = {}) => {
    const response = await fetch(apiUrl(path), {
        headers: {
            Accept: 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
};
