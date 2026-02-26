/**
 * EspoCRM Settings Service
 * Handles retrieval of application settings and user preferences with caching policies.
 */

import { EspoSettings, EspoPreferences, CACHE_KEYS, CACHE_TTL } from './types';
import authService from './authService';

/**
 * Get application settings from cache if valid
 */
export const getSettings = (): EspoSettings | null => {
    const settingsJson = localStorage.getItem(CACHE_KEYS.ESPO_SETTINGS);

    // Check if we have settings
    if (!settingsJson) return null;

    // TODO: Implement precise TTL check if we store timestamp separately
    // Currently relying on authService login to refresh, but we can add timestamp check here if we store it
    // For now, return what we have
    try {
        return JSON.parse(settingsJson) as EspoSettings;
    } catch {
        return null;
    }
};

/**
 * Get user preferences from cache
 */
export const getPreferences = (): EspoPreferences | null => {
    const prefsJson = localStorage.getItem(CACHE_KEYS.USER_PREFERENCES);
    if (!prefsJson) return null;
    try {
        return JSON.parse(prefsJson) as EspoPreferences;
    } catch {
        return null;
    }
};

/**
 * Get effectively used date format (User Preference > System Setting > Default)
 */
export const getDateFormat = (): string => {
    const prefs = getPreferences();
    if (prefs?.dateFormat) return prefs.dateFormat;

    const settings = getSettings();
    return settings?.dateFormat || 'DD.MM.YYYY';
};

/**
 * Get effectively used time format (User Preference > System Setting > Default)
 */
export const getTimeFormat = (): string => {
    const prefs = getPreferences();
    if (prefs?.timeFormat) return prefs.timeFormat;

    const settings = getSettings();
    return settings?.timeFormat || 'HH:mm';
};

/**
 * Get effectively used time zone (User Preference > System Setting > Default)
 */
export const getTimeZone = (): string => {
    const prefs = getPreferences();
    if (prefs?.timeZone) return prefs.timeZone;

    const settings = getSettings();
    return settings?.timeZone || 'UTC';
};

/**
 * Get default currency
 */
export const getDefaultCurrency = (): string => {
    const settings = getSettings();
    return settings?.defaultCurrency || 'EUR';
};

/**
 * Get thousands separator
 */
export const getThousandSeparator = (): string => {
    const settings = getSettings();
    // Default to dot if not specified, or checks if user prefs has override (rare)
    return settings?.thousandSeparator || '.';
};

/**
 * Get decimal mark
 */
export const getDecimalMark = (): string => {
    const settings = getSettings();
    return settings?.decimalMark || ',';
};

/**
 * Get Google Maps API Key
 */
export const getGoogleMapsApiKey = (): string | undefined => {
    const settings = getSettings();
    return settings?.googleMapsApiKey;
};

/**
 * Get Site URL
 */
export const getSiteUrl = (): string => {
    const settings = getSettings();
    return settings?.siteUrl || '';
};

const settingsService = {
    getSettings,
    getPreferences,
    getDateFormat,
    getTimeFormat,
    getTimeZone,
    getDefaultCurrency,
    getThousandSeparator,
    getDecimalMark,
    getGoogleMapsApiKey,
    getSiteUrl
};

export default settingsService;
