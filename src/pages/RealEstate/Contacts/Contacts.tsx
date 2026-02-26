import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import EntityCrudList, { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";

const Contacts = () => {
    document.title = "Contacts | Steex - Admin & Dashboard Template";

    const columns = useMemo(
        () => [
            {
                header: (
                    <Form.Check>
                        <Form.Check.Input type="checkbox" value="option" id="checkAllContacts" />
                        <Form.Check.Label htmlFor="checkAllContacts"></Form.Check.Label>
                    </Form.Check>
                ),
                cell: () => <Form.Check type="checkbox" className="orderCheckBox" />,
                id: "#",
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "ID",
                accessorKey: "id",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => (
                    <Link to="#" className="fw-medium link-primary">
                        #{cell.getValue()}
                    </Link>
                ),
            },
            {
                header: "Name",
                accessorKey: "lastName",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => {
                    const row = cell.row.original;
                    const fullName = row?.name || [row?.firstName, row?.lastName].filter(Boolean).join(" ");
                    return fullName || "-";
                },
            },
            {
                header: "Email",
                accessorKey: "emailAddress",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => cell.getValue() || "-",
            },
            {
                header: "Phone",
                accessorKey: "phoneNumber",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => cell.getValue() || "-",
            },
            {
                header: "Agent",
                accessorKey: "assignedUserName",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => cell.getValue() || "-",
            },
            {
                header: "Created At",
                accessorKey: "createdAt",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => {
                    const value = cell.getValue();
                    return value ? new Date(value).toLocaleDateString() : "-";
                },
            },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            {
                name: "firstName",
                label: "First Name",
                type: "text",
                placeholder: "Enter first name",
            },
            {
                name: "lastName",
                label: "Last Name",
                type: "text",
                required: true,
                placeholder: "Enter last name",
            },
            {
                name: "emailAddress",
                label: "Email",
                type: "email",
                placeholder: "Enter email",
            },
            {
                name: "phoneNumber",
                label: "Phone",
                type: "text",
                placeholder: "Enter phone number",
            },
        ],
        []
    );

    return (
        <EntityCrudList
            entityType="Contact"
            entityName="Contact"
            title="Contacts List"
            pageTitle="Contacts"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Contact"
            searchPlaceholder="Search for name, email, phone, agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,firstName,lastName,emailAddress,phoneNumber,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["firstName", "lastName", "emailAddress", "phoneNumber"]}
            defaultOrderBy="createdAt"
            defaultOrder="desc"
            defaultPageSize={10}
            views={["table", "grid"]}
            defaultView="table"
            floatingToolbar
        />
    );
};

export default Contacts;
