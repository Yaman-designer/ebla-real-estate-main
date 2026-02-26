import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    addRealEstateGridList as addRealEstateGridListApi,
    updateRealEstateGridList as updateRealEstateGridListApi,
    deleteRealEstateGridList as getDeleteRealEstateGridListApi,
    getAgentGridList as getAgentGridListApi,
    addAgentGridList as addAgentGridListApi,
    updateAgentGridList as updateAgentGridListApi,
    deleteAgentGridList as getDeleteAgentGridListApi,
    getAgentList as getAgentListApi,
    addAgentList as addAgentListApi,
    updateAgentList as updateAgentListApi,
    deleteAgentList as deleteAgentListApi,
    getEarningList as getEarningListApi,
    getAgenciesList as getAgenciesListApi,
    addAgenciesList as addAgenciesListApi,
    updateAgenciesList as updateAgenciesListApi,
    deleteAgenciesList as deleteAgenciesListApi,
    getRealEstateListingList as getRealEstateListingListApi,
    addRealEstateListingList as addRealEstateListingListApi,
    updateRealEstateListingList as updateRealEstateListingListApi,
    deleteRealEstateListingList as deleteRealEstateListingListApi,
    getRealestateAgencyOverview as getRealestateAgencyOverviewApi,
    updateRealEstateAgencyOverview as updateRealEstateAgencyOverviewApi,
    deleteRealestateAgencyOverview as deleteRealestateAgencyOverviewApi,
    addRealEstateListMap as addRealEstateListMapApi,
    updateRealEstateListMap as updateRealEstateListMapApi,
    deleteRealestateListMap as deleteRealestateListMapApi
} from "../../helpers/fakebackend_helper";
import { getProperties, getProperty } from "../../helpers/espocrm/propertyService";
import { toast } from "react-toastify";

// listing grid
// listing grid
export const getRealEstateProperty = createAsyncThunk("realestate/getRealEstateProperty", async (id: string) => {
    try {
        const response = await getProperty(id);
        return response;
    } catch (error) {
        return error;
    }
});
export const getRealEstateGridList = createAsyncThunk(
    "realestate/getRealEstateGridList",
    async ({
        page,
        size,
        whereGroup,
        textFilter,
        orderBy,
        order,
    }: {
        page: number;
        size: number;
        whereGroup?: any[];
        textFilter?: string;
        orderBy?: string;
        order?: "asc" | "desc";
    }) => {
    try {
        const params: any = {
            offset: (page - 1) * size,
            maxSize: size,
            orderBy: orderBy || "createdAt",
            order: order || "desc",
        };
        if (whereGroup) {
            params.whereGroup = whereGroup;
        }
        if (textFilter) {
            params.textFilter = textFilter;
        }
        const response = await getProperties(params);
        return {
            list: response.list,
            total: response.total
        };
    } catch (error) {
        return error;
    }
    }
);

export const addRealEstateGridList = createAsyncThunk("realestate/addRealEstateGridList", async (grid: any) => {
    try {
        const response = addRealEstateGridListApi(grid);
        const data = await response;
        toast.success("List Grid Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("List Grid Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const updateRealEstateGridList = createAsyncThunk("realestate/updateRealEstateGridList", async (grid: any) => {
    try {
        const response = updateRealEstateGridListApi(grid);
        const data = await response;
        toast.success("List Grid Updated Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("List Grid Updated Failed", { autoClose: 2000 });
        return error;
    }
});

export const deleteRealEstateGridList = createAsyncThunk("realestate/deleteRealEstateGridList", async (realestategrid: any) => {
    try {
        const response = getDeleteRealEstateGridListApi(realestategrid);
        toast.success("List Grid Deleted Successfully", { autoClose: 2000 });
        return response;
    } catch (error) {
        toast.error("List Grid Deleted Failed", { autoClose: 2000 });
        return error;
    }
})

//agent grid view
export const getAgentGridList = createAsyncThunk("realestate/getAgentGridList", async () => {
    try {
        const response = getAgentGridListApi();
        return response;
    } catch (error) {
        return error;
    }
})

export const addAgentGridList = createAsyncThunk("realestate/addAgentGridList", async (grid: any) => {
    try {
        const response = addAgentGridListApi(grid);
        const data = await response;
        toast.success("agent grid Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agent grid Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const updateAgentGridList = createAsyncThunk("realestate/updateAgentGridList", async (grid: any) => {
    try {
        const response = updateAgentGridListApi(grid);
        const data = await response;
        toast.success("agent grid Updated Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agent grid Updated Failed", { autoClose: 2000 });
        return error;
    }
});

export const deleteAgentGridList = createAsyncThunk("realestate/deleteAgentGridList", async (agentgrid: any) => {
    try {
        const response = getDeleteAgentGridListApi(agentgrid);
        toast.success("agent grid deleted Successfully", { autoClose: 2000 });
        return response;
    } catch (error) {
        toast.error("agent grid deleted Failed", { autoClose: 2000 });
        return error;
    }
})

//earning
export const getEarningList = createAsyncThunk("realestate/getEarningList", async () => {
    try {
        const response = getEarningListApi();
        return response;
    } catch (error) {
        return error;
    }
})

//agencies
export const getAgenciesList = createAsyncThunk("realestate/getAgenciesList", async () => {
    try {
        const response = getAgenciesListApi();
        return response;
    } catch (error) {
        return error;
    }
});

export const addAgenciesList = createAsyncThunk("realestate/addAgenciesList", async (agencieslist: any) => {
    try {
        const response = addAgenciesListApi(agencieslist);
        const data = await response;
        toast.success("agencies Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agencies Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const updateAgenciesList = createAsyncThunk("realestate/updateAgenciesList", async (agencieslist: any) => {
    try {
        const response = updateAgenciesListApi(agencieslist);
        const data = await response;
        toast.success("agencies Updated Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agencies Updated Failed", { autoClose: 2000 });
        return error;
    }
});

export const deleteAgenciesList = createAsyncThunk("realestate/deleteAgenciesList", async (agencieslist: any) => {
    try {
        const response = deleteAgenciesListApi(agencieslist);
        toast.success("agencies Deleted Successfully", { autoClose: 2000 });
        return response;
    } catch (error) {
        toast.error("agencies Deleted Failed", { autoClose: 2000 });
        return error;
    }
})

//agent
export const getAgentList = createAsyncThunk("realestate/getAgentList", async () => {
    try {
        const response = getAgentListApi();
        return response;
    } catch (error) {
        return error;
    }
})
export const addAgentList = createAsyncThunk("realestate/addAgentList", async (agentlist: any) => {
    try {
        const response = addAgentListApi(agentlist);
        const data = await response;
        toast.success("agent Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agent Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const updateAgentList = createAsyncThunk("realestate/updateAgentList", async (agentlist: any) => {
    try {
        const response = updateAgentListApi(agentlist);
        const data = await response;
        toast.success("agent Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agent Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const deleteAgentList = createAsyncThunk("realestate/deleteAgentList", async (agentlist: any) => {
    try {
        const response = deleteAgentListApi(agentlist);
        toast.success("agent Added Successfully", { autoClose: 2000 });
        return response;
    } catch (error) {
        toast.error("agent Added Failed", { autoClose: 2000 });
        return error;
    }
})


//listing list
export const getRealEstateListingList = createAsyncThunk("realestate/getRealEstateListingList", async () => {
    try {
        const response = getRealEstateListingListApi();
        return response;
    } catch (error) {
        return error;
    }
})

export const addRealEstateListingList = createAsyncThunk("realestate/addRealEstateListingList", async (list: any) => {
    try {
        const response = addRealEstateListingListApi(list);
        const data = await response;
        toast.success("List Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("List Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const updateRealEstateListingList = createAsyncThunk("realestate/updateRealEstateListingList", async (list: any) => {
    try {
        const response = updateRealEstateListingListApi(list);
        const data = await response;
        toast.success("List Updated Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("List Updated Failed", { autoClose: 2000 });
        return error;
    }
});
export const deleteRealEstateListingList = createAsyncThunk("realestate/deleteRealEstateListingList", async (listinglist: any) => {
    try {
        const response = deleteRealEstateListingListApi(listinglist);
        toast.success("List Deleted Successfully", { autoClose: 2000 });

        return response;
    } catch (error) {
        toast.error("List Deleted Failed", { autoClose: 2000 });
        return error;
    }
})

//agencies overview
export const getRealestateAgencyOverview = createAsyncThunk("realestate/getRealestateAgencyOverview", async () => {
    try {
        const response = getRealestateAgencyOverviewApi();
        return response;
    } catch (error) {
        return error;
    }
})
export const updateRealEstateAgencyOverview = createAsyncThunk("realestate/updateRealEstateAgencyOverview", async (agencyoverview: any) => {
    try {
        const response = updateRealEstateAgencyOverviewApi(agencyoverview);
        const data = await response;
        toast.success("agencies overview Updated Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("agencies overview Updated Failed", { autoClose: 2000 });
        return error;
    }
});

export const deleteRealestateAgencyOverview = createAsyncThunk("realestate/deleteRealestateAgencyOverview", async (agencyoverview: any) => {
    try {
        const response = deleteRealestateAgencyOverviewApi(agencyoverview);
        toast.success("agencies overview Deleted Successfully", { autoClose: 2000 });
        return response;
    } catch (error) {
        toast.error("agencies overview Deleted Failed", { autoClose: 2000 });
        return error;
    }
});

//list map
export const getRealestateListMap = createAsyncThunk(
    "realestate/getRealestateListMap",
    async ({
        page,
        size,
        whereGroup,
        textFilter,
        orderBy,
        order,
    }: {
        page: number;
        size: number;
        whereGroup?: any[];
        textFilter?: string;
        orderBy?: string;
        order?: "asc" | "desc";
    }) => {
    try {
        const defaultConditions = [
            { type: 'isNotNull', attribute: 'addressLatitude' },
            { type: 'notEquals', attribute: 'addressLatitude', value: '' }
        ];

        // Structure required by user:
        // Index 0..N: User filters (e.g. textFilter)
        // Last Index: AND group containing default location checks
        let finalWhereGroup: any[] = [];

        if (whereGroup && whereGroup.length > 0) {
            finalWhereGroup = [...whereGroup];
        }

        // Add default map location checks as a grouped 'AND' condition at the end
        finalWhereGroup.push({
            type: 'and',
            value: defaultConditions
        });

        const response = await getProperties({
            offset: (page - 1) * size,
            maxSize: size,
            whereGroup: finalWhereGroup,
            textFilter: textFilter || undefined,
            orderBy: orderBy || "createdAt",
            order: order || "desc",
        });
        return {
            list: response.list,
            total: response.total
        };
    } catch (error) {
        return error;
    }
    }
)

export const addRealEstateListMap = createAsyncThunk("realestate/addRealEstateListMap", async (list: any) => {
    try {
        const response = addRealEstateListMapApi(list);
        const data = await response;
        toast.success("list Added Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("list Added Failed", { autoClose: 2000 });
        return error;
    }
});

export const updateRealEstateListMap = createAsyncThunk("realestate/updateRealEstateListMap", async (list: any) => {
    try {
        const response = updateRealEstateListMapApi(list);
        const data = await response;
        toast.success("list Updated Successfully", { autoClose: 2000 });
        return data;
    } catch (error) {
        toast.error("list Updated Failed", { autoClose: 2000 });
        return error;
    }
});

export const deleteRealestateListMap = createAsyncThunk("realestate/deleteRealestateListMap", async (list: any) => {
    try {
        const response = deleteRealestateListMapApi(list);
        toast.success("list Deleted Successfully", { autoClose: 2000 });
        return response;
    } catch (error) {
        toast.error("list Deleted Failed", { autoClose: 2000 });
        return error;
    }
});
