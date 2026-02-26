/**
 * EspoCRM Authentication Service
 * Handles login, logout, and auth header generation
 */

import axios from 'axios';
import {
    EspoLoginResponse,
    EspoUser,
    EspoSettings,
    EspoPreferences,
    CACHE_KEYS,
} from './types';

const ESPO_URL = process.env.REACT_APP_ESPOCRM_URL || '';

/**
 * Encode credentials to Base64 for Espo-Authorization header
 */
const encodeCredentials = (username: string, secret: string): string => {
    return btoa(`${username}:${secret}`);
};

/**
 * Login to EspoCRM with username and password
 */
export const login = async (
    username: string,
    password: string
): Promise<EspoLoginResponse> => {
    const url = `${ESPO_URL}/api/v1/App/user`;

    console.log('EspoCRM Login: Attempting login to', url);

    try {
        const response = await axios.get(url, {
            headers: {
                'Espo-Authorization': encodeCredentials(username, password),
                'Espo-Authorization-By-Token': 'false',
            },
        });

        // Handle both: response.data (standard axios) or response itself (if interceptor extracted data)
        const data: EspoLoginResponse = response.data !== undefined ? response.data : response;

        console.log('EspoCRM Login: Parsed data:', data);

        // Validate response
        if (!data || !data.user || !data.token) {
            console.error('EspoCRM Login: Invalid response structure', data);
            throw new Error('Invalid login response from EspoCRM');
        }

        console.log('EspoCRM Login: Success for user', data.user.userName);

        // Store auth data in localStorage
        localStorage.setItem(CACHE_KEYS.AUTH_USER, JSON.stringify(data.user));
        localStorage.setItem(CACHE_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(CACHE_KEYS.ESPO_SETTINGS, JSON.stringify(data.settings));
        localStorage.setItem(CACHE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));

        // Also store the username for subsequent requests
        localStorage.setItem('authUsername', username);

        return data;
    } catch (error: any) {
        console.error('EspoCRM Login: Error:', error.message || error);
        throw error;
    }
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (
    userId: string,
    data: Partial<EspoUser>
): Promise<EspoUser> => {
    const url = `${ESPO_URL}/api/v1/User/${userId}`;
    const headers = getAuthHeaders();

    if (!headers) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await axios.put(url, data, { headers });
        return response.data;
    } catch (error: any) {
        console.error('EspoCRM Update Profile: Error:', error.message || error);
        throw error;
    }
};

/**
 * Logout - Clear all auth data from localStorage
 */
export const logout = (): void => {
    localStorage.removeItem(CACHE_KEYS.AUTH_USER);
    localStorage.removeItem(CACHE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(CACHE_KEYS.ESPO_SETTINGS);
    localStorage.removeItem(CACHE_KEYS.USER_PREFERENCES);
    localStorage.removeItem('authUsername');
    // Optionally clear i18n cache on logout
    // localStorage.removeItem(CACHE_KEYS.I18N);
    // localStorage.removeItem(CACHE_KEYS.I18N_TIMESTAMP);
};

/**
 * Get authentication headers for subsequent API requests
 */
export const getAuthHeaders = (): Record<string, string> | null => {
    const username = localStorage.getItem('authUsername');
    const token = localStorage.getItem(CACHE_KEYS.AUTH_TOKEN);

    if (!username || !token) {
        return null;
    }

    return {
        'Espo-Authorization': encodeCredentials(username, token),
        'Espo-Authorization-By-Token': 'true',
    };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(CACHE_KEYS.AUTH_TOKEN);
    const user = localStorage.getItem(CACHE_KEYS.AUTH_USER);
    return !!(token && user);
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): EspoUser | null => {
    const userJson = localStorage.getItem(CACHE_KEYS.AUTH_USER);
    if (!userJson) return null;
    try {
        return JSON.parse(userJson) as EspoUser;
    } catch {
        return null;
    }
};

/**
 * Get current token from localStorage
 */
export const getToken = (): string | null => {
    return localStorage.getItem(CACHE_KEYS.AUTH_TOKEN);
};

/**
 * Get cached settings from localStorage
 */
export const getCachedSettings = (): EspoSettings | null => {
    const settingsJson = localStorage.getItem(CACHE_KEYS.ESPO_SETTINGS);
    if (!settingsJson) return null;
    try {
        return JSON.parse(settingsJson) as EspoSettings;
    } catch {
        return null;
    }
};

/**
 * Get cached preferences from localStorage
 */
export const getCachedPreferences = (): EspoPreferences | null => {
    const prefsJson = localStorage.getItem(CACHE_KEYS.USER_PREFERENCES);
    if (!prefsJson) return null;
    try {
        return JSON.parse(prefsJson) as EspoPreferences;
    } catch {
        return null;
    }
};

const authService = {
    login,
    logout,
    getAuthHeaders,
    isAuthenticated,
    getCurrentUser,
    getToken,
    getCachedSettings,
    getCachedPreferences,
    updateUserProfile,
};

export default authService;
