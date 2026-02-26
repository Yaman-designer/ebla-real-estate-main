import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const Users = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "userName", label: "Username" },
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "isActive", label: "Active", type: "boolean" },
            { key: "emailAddress", label: "Email" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "userName", label: "Username", type: "text", required: true, placeholder: "Enter username" },
            { name: "firstName", label: "First Name", type: "text", placeholder: "Enter first name" },
            { name: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Enter last name" },
            { name: "emailAddress", label: "Email", type: "email", placeholder: "Enter email" },
            {
                name: "type",
                label: "Type",
                type: "select",
                options: [
                    { label: "Regular", value: "regular" },
                    { label: "Admin", value: "admin" },
                    { label: "Portal", value: "portal" },
                ],
            },
            { name: "isActive", label: "Active", type: "checkbox" },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="User"
            entityName="User"
            title="Users List"
            pageTitle="Users"
            pageParentTitle="Company"
            addButtonLabel="Add User"
            searchPlaceholder="Search users by username, name, email..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,userName,name,type,isActive,emailAddress,createdAt,modifiedAt"
            allowedPayloadFields={["userName", "firstName", "lastName", "emailAddress", "type", "isActive"]}
        />
    );
};

export default Users;
