import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const CReference = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Reference" },
            { key: "status", label: "Status", type: "status" },
            { key: "assignedUserName", label: "Agent" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Reference Name", type: "text", required: true, placeholder: "Enter reference name" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "New", value: "New" },
                    { label: "In Progress", value: "In Progress" },
                    { label: "Closed", value: "Closed" },
                ],
            },
            { name: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Enter description" },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="CReference"
            entityName="Reference"
            title="References List"
            pageTitle="References"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Reference"
            searchPlaceholder="Search references by name, status, or agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status", "description"]}
        />
    );
};

export default CReference;
