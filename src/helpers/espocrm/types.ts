/**
 * EspoCRM TypeScript Type Definitions
 * Based on /api/v1/App/user response structure
 */

// ============= User Types =============

export interface EspoUser {
    id: string;
    userName: string;
    name: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    type: 'admin' | 'regular' | 'portal' | 'api';
    isActive: boolean;
    emailAddress: string | null;
    phoneNumber: string | null;
    avatarId: string | null;
    avatarName: string | null;
    avatarColor: string | null;
    teamsIds: string[];
    teamsNames: Record<string, string>;
    defaultTeamId: string | null;
    createdAt: string;
    modifiedAt: string;
    cAssociatedateregistration?: string | null;
    cBirthday?: string | null;
    cNameday?: string | null;
}

// ============= Settings Types =============

export interface EspoSettings {
    applicationName: string;
    version: string;
    siteUrl: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    timeZone: string;
    weekStart: number;
    defaultCurrency: string;
    currencyList: string[];
    thousandSeparator: string;
    decimalMark: string;
    personNameFormat: string;
    // Theme
    theme: string;
    navbarColor: string;
    brandPrimary: string;
    brandSuccess: string;
    brandDanger: string;
    brandWarning: string;
    brandInfo: string;
    // Integrations
    googleMapsApiKey?: string;
    integrations?: Record<string, boolean>;
    // Global search entities
    globalSearchEntityList: string[];
    companyLogoId?: string;
}

// ============= Preferences Types =============

export interface EspoPreferences {
    id: string;
    language: string | null;
    dateFormat: string | null;
    timeFormat: string | null;
    timeZone: string | null;
    weekStart: number;
    defaultCurrency: string | null;
    thousandSeparator: string;
    decimalMark: string;
    theme: string | null;
    dashboardLocked: boolean;
}

// ============= Auth Types =============

export interface EspoLoginResponse {
    user: EspoUser;
    token: string;
    settings: EspoSettings;
    preferences: EspoPreferences;
    language: string;
    appParams: Record<string, unknown>;
}

export interface EspoAuthCredentials {
    username: string;
    password: string;
}

export interface EspoAuthState {
    user: EspoUser | null;
    token: string | null;
    isAuthenticated: boolean;
}

// ============= API Types =============

export interface EspoListParams {
    offset?: number;
    maxSize?: number;
    where?: EspoWhereClause[];
    orderBy?: string;
    order?: 'asc' | 'desc';
    select?: string;
    textFilter?: string;
    // Extended params
    attributeSelect?: string;
    whereGroup?: EspoWhereGroup[];
}

export interface EspoWhereGroup {
    type: string;
    attribute?: string;
    value?: any;
}

export interface EspoWhereClause {
    type: 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'isNull' | 'isNotNull' | 'greaterThan' | 'lessThan' | 'or' | 'and';
    attribute?: string;
    value?: string | number | boolean | string[] | null;
    dateTime?: boolean;
}

export interface EspoListResponse<T> {
    total: number;
    list: T[];
}

export interface EspoActivitiesParams {
    from: string;
    to: string;
    agenda: boolean;
}

export interface EspoActivity {
    id: string;
    scope: string;
    name: string;
    dateStart: string;
    dateEnd: string | null;
    status?: string | null;
    dateStartDate?: string;
    dateEndDate?: string;
    parentType?: string | null;
    parentId?: string | null;
    createdAt?: string;
    color?: string | null;
}

// ============= Entity Types (Real Estate specific) =============

export interface RealEstateProperty {
    id: string;
    name: string;
    deleted: boolean;
    createdAt: string;
    modifiedAt: string;
    assignedUserId: string | null;
    assignedUserName: string | null;
    teamsIds: string[];
    // Extended fields for Active Listing
    type?: string;
    bedroomCount?: number;
    bathroomCount?: number;
    square?: number;
    price?: number;
    priceCurrency?: string;
    title?: string;
    description?: string;
    propertyCode?: string;
    status?: string;
    yearBuilt?: number;
    floor?: number;
    floorCount?: number;
    // Address & Location
    addressCity?: string;
    addressStreet?: string;
    addressState?: string;
    addressPostalCode?: string;
    addressCountry?: string;
    locationName?: string;
    regionLocationName?: string;
    subRegionLocationName?: string;
    // Images
    mainImageId?: string;
    mainImageName?: string;
    imagesIds?: string[];
    imagesNames?: Record<string, string>;
    // Map
    addressLatitude?: number;
    addressLongitude?: number;
}

export interface RealEstateRequest {
    id: string;
    name: string;
    deleted: boolean;
    createdAt: string;
    modifiedAt: string;
    assignedUserId: string | null;
    assignedUserName?: string | null;
    status?: string | null;
    requestType?: string | null;
    description?: string | null;
}

// ============= Cache Types =============

export interface CachedData<T> {
    data: T;
    timestamp: number;
    ttl: number; // in milliseconds
}

export const CACHE_KEYS = {
    AUTH_USER: 'authUser',
    AUTH_TOKEN: 'authToken',
    ESPO_SETTINGS: 'espoSettings',
    USER_PREFERENCES: 'userPreferences',
    I18N: 'i18n',
    I18N_TIMESTAMP: 'i18n_timestamp',
} as const;

export const CACHE_TTL = {
    SETTINGS: 60 * 60 * 1000, // 1 hour
    I18N: 24 * 60 * 60 * 1000, // 24 hours
} as const;
