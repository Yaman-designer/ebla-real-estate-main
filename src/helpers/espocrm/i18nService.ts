/**
 * EspoCRM i18n Service
 * Handles fetching, caching, and determining translations with fallback.
 */

import { get } from 'lodash';
import { CACHE_KEYS, CACHE_TTL } from './types';
import EspoCrmClient from './EspoCrmClient';
import fallbackLabels from 'Common/locales/en.json'; // Static fallback

// Type for the translation object (key-value pairs, potentially nested)
export type I18nLabels = Record<string, any>;

interface CachedI18n {
    labels: I18nLabels;
    timestamp: number;
    language: string;
}

/**
 * Fetch translations from API or return cached version if valid
 * Endpoint: /I18n
 * Params: { default: true } to get default system language
 */
export const fetchTranslations = async (language?: string): Promise<I18nLabels> => {
    // 1. Check Cache
    const cachedJson = localStorage.getItem(CACHE_KEYS.I18N);
    const now = Date.now();

    if (cachedJson) {
        try {
            const cached: CachedI18n = JSON.parse(cachedJson);

            // Validate: 
            // - Not expired
            // - Matches requested language (if specified) or just generally valid
            const isExpired = (now - cached.timestamp) > CACHE_TTL.I18N;
            const matchesLang = !language || cached.language === language;

            if (!isExpired && matchesLang) {
                console.log('EspoCRM i18n: Using cached translations');
                return cached.labels;
            }
        } catch (e) {
            console.warn('EspoCRM i18n: Failed to parse cache', e);
        }
    }

    // 2. Fetch from API
    console.log('EspoCRM i18n: Fetching from API', language ? `for ${language}` : 'default');

    try {
        // Construct params
        // Based on Knowledge Item: default=true forces default system language labels
        const params: any = {
            default: 'true'
        };

        // If we want to support switching languages, we might validly pass the language somehow, 
        // but for now we follow the "default=true" pattern or rely on User context.
        if (language) {
            // For some endpoints, Espo accepts specific params, but for now we stick to the known working pattern.
            // We can accept Accept-Language header handling by the browser/client if applicable.
        }

        const response = await EspoCrmClient.get<I18nLabels>('/I18n', { params });
        const labels = response; // EspoCrmClient.get returns response.data directly

        console.log('EspoCRM i18n: Fetched labels structure keys:', Object.keys(labels));

        // 3. Update Cache
        const cacheData: CachedI18n = {
            labels, // Nested structure, e.g. { website: { labels: { create: "Create" } } }
            timestamp: now,
            language: language || 'default' // We might want to resolve the actual language from response if possible
        };

        localStorage.setItem(CACHE_KEYS.I18N, JSON.stringify(cacheData));

        return labels;
    } catch (error) {
        console.error('EspoCRM i18n: Fetch failed', error);
        // Fallback: return empty or cached expired if available? 
        // For now, throw or return empty
        throw error;
    }
};

/**
 * Get synchronously from cache (might be null if not loaded)
 */
export const getCachedTranslations = (): I18nLabels | null => {
    const cachedJson = localStorage.getItem(CACHE_KEYS.I18N);
    if (!cachedJson) return null;
    try {
        const cached: CachedI18n = JSON.parse(cachedJson);
        return cached.labels;
    } catch {
        return null;
    }
};

/**
 * Reference to in-memory labels to avoid parsing JSON on every render if possible.
 * You might want to initialize this on app load.
 */
let memoryLabels: I18nLabels | null = null;

export const loadLabelsToMemory = () => {
    memoryLabels = getCachedTranslations();
};

/**
 * Translate a key with fallback to English
 * @param key The key path (e.g., 'website.labels.create')
 * @returns Translated string, or English fallback, or key if neither found.
 */
export const t = (key: string): string => {
    if (!memoryLabels) {
        loadLabelsToMemory();
    }

    // 1. Try fetched/cached labels (nested)
    const translated = get(memoryLabels, key);
    if (translated) return translated;

    // 2. Try English fallback (nested or flat)
    // Note: fallbackLabels from en.json is likely flat { "Menu": "Menu" }
    // If key is 'Menu', this works. If key is 'website.labels.create', it checks that path.
    const fallback = get(fallbackLabels, key);
    if (fallback) return fallback;

    // 3. Return key as last resort
    return key;
};

/**
 * Clear i18n cache (e.g. on language change)
 */
export const clearI18nCache = () => {
    localStorage.removeItem(CACHE_KEYS.I18N);
    memoryLabels = null;
};

const i18nService = {
    fetchTranslations,
    getCachedTranslations,
    clearI18nCache,
    t
};

export default i18nService;
