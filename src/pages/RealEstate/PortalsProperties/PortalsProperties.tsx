import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const PortalsProperties = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Property" },
            { key: "status", label: "Status", type: "status" },
            { key: "assignedUserName", label: "Agent" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Property Name", type: "text", required: true, placeholder: "Enter property name" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Active", value: "Active" },
                    { label: "Pending", value: "Pending" },
                    { label: "Inactive", value: "Inactive" },
                ],
            },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="PortalsProperties"
            entityName="FSBO"
            title="FSBO List"
            pageTitle="FSBO"
            pageParentTitle="Real Estate"
            addButtonLabel="Add FSBO"
            searchPlaceholder="Search FSBO properties, status, or agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status"]}
        />
    );
};

export default PortalsProperties;
