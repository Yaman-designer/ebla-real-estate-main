import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const CPipeline = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Pipeline" },
            { key: "status", label: "Status", type: "status" },
            { key: "assignedUserName", label: "Owner" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Pipeline Name", type: "text", required: true, placeholder: "Enter pipeline name" },
            { name: "stage", label: "Stage", type: "text", placeholder: "Enter stage" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Open", value: "Open" },
                    { label: "In Progress", value: "In Progress" },
                    { label: "Closed", value: "Closed" },
                ],
            },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="CPipeline"
            entityName="Pipeline"
            title="Pipeline List"
            pageTitle="Pipeline"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Pipeline"
            searchPlaceholder="Search pipeline by name, stage, status..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,stage,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "stage", "status"]}
        />
    );
};

export default CPipeline;
