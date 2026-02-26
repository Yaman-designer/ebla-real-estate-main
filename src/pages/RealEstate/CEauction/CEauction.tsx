import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const CEauction = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Auction Property" },
            { key: "status", label: "Status", type: "status" },
            { key: "assignedUserName", label: "Agent" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Auction Name", type: "text", required: true, placeholder: "Enter auction property name" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Active", value: "Active" },
                    { label: "Upcoming", value: "Upcoming" },
                    { label: "Closed", value: "Closed" },
                ],
            },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="CEauction"
            entityName="Auction"
            title="Auction Properties"
            pageTitle="Auction Properties"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Auction"
            searchPlaceholder="Search auction properties, status, or agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status"]}
        />
    );
};

export default CEauction;
