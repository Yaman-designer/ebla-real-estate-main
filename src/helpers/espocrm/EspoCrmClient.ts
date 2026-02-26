/**
 * EspoCRM API Client
 * Axios instance with automatic auth header injection
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthHeaders, logout } from './authService';
import { EspoActivitiesParams, EspoActivity, EspoListParams, EspoListResponse } from './types';

const ESPO_URL = process.env.REACT_APP_ESPOCRM_URL || '';

/**
 * Create Axios instance for EspoCRM API
 */
const createClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: `${ESPO_URL}/api/v1`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor - attach auth headers
    client.interceptors.request.use(
        (config) => {
            const authHeaders = getAuthHeaders();
            if (authHeaders) {
                Object.assign(config.headers, authHeaders);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor - handle auth errors
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Unauthorized - token expired/invalid
                logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return client;
};

const apiClient = createClient();

/**
 * GET request
 */
export const get = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(endpoint, config);
    return response.data;
};

/**
 * POST request
 */
export const post = async <T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data, config);
    return response.data;
};

/**
 * PUT request
 */
export const put = async <T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(endpoint, data, config);
    return response.data;
};

/**
 * PATCH request
 */
export const patch = async <T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(endpoint, data, config);
    return response.data;
};

/**
 * DELETE request
 */
export const del = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(endpoint, config);
    return response.data;
};

/**
 * Get list of entities with optional filters
 */
export const getList = async <T>(
    entityType: string,
    params?: EspoListParams
): Promise<EspoListResponse<T>> => {
    const queryParams = new URLSearchParams();

    if (params?.offset !== undefined) {
        queryParams.set('offset', String(params.offset));
    }
    if (params?.maxSize !== undefined) {
        queryParams.set('maxSize', String(params.maxSize));
    }
    if (params?.orderBy) {
        queryParams.set('orderBy', params.orderBy);
    }
    if (params?.order) {
        queryParams.set('order', params.order);
    }
    if (params?.select) {
        queryParams.set('select', params.select);
    }
    if (params?.where && params.where.length > 0) {
        queryParams.set('where', JSON.stringify(params.where));
    }
    if (params?.textFilter) {
        queryParams.set('textFilter', params.textFilter);
    }
    if (params?.attributeSelect) {
        queryParams.set('attributeSelect', params.attributeSelect);
    }
    if (params?.whereGroup && params.whereGroup.length > 0) {
        params.whereGroup.forEach((group, index) => {
            queryParams.set(`whereGroup[${index}][type]`, group.type);
            if (group.attribute) {
                queryParams.set(`whereGroup[${index}][attribute]`, group.attribute);
            }
            if (group.value !== undefined) {
                if (group.value !== undefined) {
                    if (Array.isArray(group.value)) {
                        group.value.forEach((val: any, valIndex: number) => {
                            if (typeof val === 'object' && val !== null) {
                                Object.keys(val).forEach((key) => {
                                    queryParams.set(`whereGroup[${index}][value][${valIndex}][${key}]`, val[key]);
                                });
                            } else {
                                queryParams.append(`whereGroup[${index}][value][]`, String(val));
                            }
                        });
                    } else {
                        queryParams.set(`whereGroup[${index}][value]`, String(group.value));
                    }
                }
            }
        });
    }

    const queryString = queryParams.toString();
    const endpoint = `/${entityType}${queryString ? `?${queryString}` : ''}`;

    return get<EspoListResponse<T>>(endpoint);
};

/**
 * Get activities for calendar range
 * Endpoint: /Activities?from=...&to=...&agenda=true|false
 */
export const getActivities = async (
    params: EspoActivitiesParams
): Promise<EspoActivity[]> => {
    const queryParams = new URLSearchParams();
    queryParams.set('from', params.from);
    queryParams.set('to', params.to);
    queryParams.set('agenda', String(params.agenda));

    return get<EspoActivity[]>(`/Activities?${queryParams.toString()}`);
};

/**
 * Get single entity by ID
 */
export const getEntity = async <T>(
    entityType: string,
    id: string
): Promise<T> => {
    return get<T>(`/${entityType}/${id}`);
};

/**
 * Create entity
 */
export const createEntity = async <T>(
    entityType: string,
    data: Partial<T>
): Promise<T> => {
    return post<T>(`/${entityType}`, data);
};

/**
 * Update entity
 */
export const updateEntity = async <T>(
    entityType: string,
    id: string,
    data: Partial<T>
): Promise<T> => {
    return put<T>(`/${entityType}/${id}`, data);
};

/**
 * Delete entity
 */
export const deleteEntity = async (
    entityType: string,
    id: string
): Promise<void> => {
    await del(`/${entityType}/${id}`);
};

export default {
    get,
    post,
    put,
    patch,
    del,
    getList,
    getActivities,
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity,
};
