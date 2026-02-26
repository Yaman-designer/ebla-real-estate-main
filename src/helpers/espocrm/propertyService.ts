import EspoCrmClient from "./EspoCrmClient";
import { EspoListResponse, RealEstateProperty, EspoListParams } from "./types";
import { getToken } from "./authService";

const PROPERTY_ENTITY = "RealEstateProperty";

/**
 * Fetch properties assigned to a specific agent
 * Updated to use user-requested API parameters
 */
export const getAgentProperties = async (
    agentId: string,
    params?: EspoListParams
): Promise<EspoListResponse<RealEstateProperty>> => {
    // User requested API:
    // maxSize=10&offset=0&orderBy=createdAt&order=desc
    // whereGroup[0][type]=bool&whereGroup[0][value][]=onlyMy
    // attributeSelect=mainImageId,mainImageName,propertyCode,status,createdAt,type,square,addressCity

    const defaultParams: EspoListParams = {
        maxSize: 10,
        offset: 0,
        orderBy: 'createdAt',
        order: 'desc',
        // Use whereGroup defined by user
        whereGroup: [
            {
                type: 'bool',
                value: ['onlyMy'] // Value is array based on URL value[]=onlyMy
            }
        ],
        // Select specific attributes
        attributeSelect: 'id,name,title,propertyCode,status,type,price,priceCurrency,square,yearBuilt,bedroomCount,bathroomCount,floor,floorCount,description,addressCity,addressStreet,addressState,addressPostalCode,addressCountry,addressLatitude,addressLongitude,locationName,regionLocationName,subRegionLocationName,createdAt,modifiedAt,mainImageId,mainImageName,imagesIds,imagesNames',
        ...params
    };

    return EspoCrmClient.getList<RealEstateProperty>(PROPERTY_ENTITY, defaultParams);
};

/**
 * Fetch all properties (public list)
 */
export const getProperties = async (
    params?: EspoListParams
): Promise<EspoListResponse<RealEstateProperty>> => {
    const defaultParams: EspoListParams = {
        maxSize: 10,
        offset: 0,
        orderBy: 'createdAt',
        order: 'desc',
        attributeSelect: 'id,name,title,propertyCode,status,type,price,priceCurrency,square,yearBuilt,bedroomCount,bathroomCount,floor,floorCount,description,addressCity,addressStreet,addressState,addressPostalCode,addressCountry,addressLatitude,addressLongitude,locationName,regionLocationName,subRegionLocationName,createdAt,modifiedAt,mainImageId,mainImageName,imagesIds,imagesNames',
        ...params
    };

    return EspoCrmClient.getList<RealEstateProperty>(PROPERTY_ENTITY, defaultParams);
};

/**
 * Get single property by ID
 */
export const getProperty = async (id: string): Promise<RealEstateProperty> => {
    return EspoCrmClient.getEntity<RealEstateProperty>(PROPERTY_ENTITY, id);
};

/**
 * Update a property
 */
export const updateProperty = async (
    id: string,
    data: Partial<RealEstateProperty>
): Promise<RealEstateProperty> => {
    return EspoCrmClient.updateEntity<RealEstateProperty>(PROPERTY_ENTITY, id, data);
};

/**
 * Delete a property
 */
export const deleteProperty = async (id: string): Promise<void> => {
    return EspoCrmClient.deleteEntity(PROPERTY_ENTITY, id);
};

/**
 * Fetch report stats for an agent's properties (Sale/Rent breakdown by month)
 */
export const getAgentStats = async (userId: string, filter: string): Promise<any> => {
    const REPORT_ID = "698f234422cf75f86";

    // Build where clauses
    const where: any[] = [
        {
            type: "equals",
            attribute: "assignedUserId",
            value: userId
        }
    ];

    if (filter === '1M') {
        // Current Month, Rent only
        where.push(
            { type: "in", attribute: "requestType", value: ["Rent"] },
            { type: "currentMonth", attribute: "createdAt", value: null, dateTime: true }
        );
    } else if (filter === '1Y') {
        // Current Year, Sale only
        where.push(
            { type: "in", attribute: "requestType", value: ["Sale"] },
            { type: "currentYear", attribute: "createdAt", value: null, dateTime: true }
        );
    } else if (filter === '6M') {
        // Last 6 months, Sale + Rent
        where.push(
            { type: "any", attribute: "requestType", value: null }
        );
    } else {
        // ALL - all time, both Sale and Rent
        where.push(
            { type: "any", attribute: "requestType", value: null },
            { type: "ever", attribute: "createdAt", value: null, dateTime: true }
        );
    }

    // Build query string for the where clauses (EspoCRM expects where[0][type]=... format)
    const queryParams = new URLSearchParams();
    queryParams.set('id', REPORT_ID);

    where.forEach((clause, index) => {
        Object.keys(clause).forEach(key => {
            const val = clause[key];
            if (val === null || val === undefined) {
                queryParams.set(`where[${index}][${key}]`, '');
            } else if (Array.isArray(val)) {
                val.forEach((item: string, itemIndex: number) => {
                    queryParams.set(`where[${index}][${key}][${itemIndex}]`, item);
                });
            } else {
                queryParams.set(`where[${index}][${key}]`, String(val));
            }
        });
    });

    const endpoint = `/Report/action/run?${queryParams.toString()}`;
    return EspoCrmClient.get<any>(endpoint);
};



/**
 * Get WebAsset URL for an image ID
 */
export const getWebAssetUrl = (id?: string | null): string => {
    if (!id) return '';
    const ESPO_URL = process.env.REACT_APP_ESPOCRM_URL || '';
    const token = getToken();
    // Append token if available to handle cross-domain/no-cookie auth if supported by backend
    // Note: Standard EspoCRM might not accept token in URL for WebAsset without customization,
    // but this is a common workaround. If this fails, we need a Blob fetcher.
    const tokenParam = token ? `&token=${token}` : '';
    return `${ESPO_URL}/?entryPoint=WebAsset&id=${id}${tokenParam}`;
};
