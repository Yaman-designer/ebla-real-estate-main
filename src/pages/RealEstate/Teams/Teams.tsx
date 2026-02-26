import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const Teams = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Team" },
            { key: "isActive", label: "Active", type: "boolean" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Team Name", type: "text", required: true, placeholder: "Enter team name" },
            { name: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Enter team description" },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="Team"
            entityName="Team"
            title="Teams List"
            pageTitle="Teams"
            pageParentTitle="Company"
            addButtonLabel="Add Team"
            searchPlaceholder="Search teams by name..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,isActive,createdAt,modifiedAt"
            allowedPayloadFields={["name", "description"]}
        />
    );
};

export default Teams;
