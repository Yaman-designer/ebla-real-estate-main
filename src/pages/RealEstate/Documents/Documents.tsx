import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const Documents = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Document" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status", type: "status" },
            { key: "assignedUserName", label: "Owner" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            {
                name: "name",
                label: "Document Name",
                type: "text",
                required: true,
                placeholder: "Enter document name",
            },
            {
                name: "type",
                label: "Type",
                type: "text",
                placeholder: "Enter document type",
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Draft", value: "Draft" },
                    { label: "Active", value: "Active" },
                    { label: "Archived", value: "Archived" },
                ],
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                rows: 3,
                placeholder: "Enter document description",
            },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="Document"
            entityName="Document"
            title="Documents List"
            pageTitle="Documents"
            pageParentTitle="Tools"
            addButtonLabel="Add Document"
            searchPlaceholder="Search documents by name, type, status, owner..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,type,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "type", "status", "description"]}
        />
    );
};

export default Documents;
