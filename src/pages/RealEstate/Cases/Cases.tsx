import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const Cases = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Case" },
            { key: "status", label: "Status", type: "status" },
            { key: "priority", label: "Priority" },
            { key: "assignedUserName", label: "Assignee" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Case Name", type: "text", required: true, placeholder: "Enter case name" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "New", value: "New" },
                    { label: "Pending", value: "Pending" },
                    { label: "Closed", value: "Closed" },
                ],
            },
            {
                name: "priority",
                label: "Priority",
                type: "select",
                options: [
                    { label: "Low", value: "Low" },
                    { label: "Normal", value: "Normal" },
                    { label: "High", value: "High" },
                ],
            },
            { name: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Enter case description" },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="Case"
            entityName="Case"
            title="Cases List"
            pageTitle="Cases"
            pageParentTitle="Support"
            addButtonLabel="Add Case"
            searchPlaceholder="Search cases by name, status, or assignee..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,priority,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status", "priority", "description"]}
        />
    );
};

export default Cases;
