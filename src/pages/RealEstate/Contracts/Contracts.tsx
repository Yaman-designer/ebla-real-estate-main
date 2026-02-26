import React, { useMemo } from "react";
import { Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import EntityCrudList, { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";

const getStatusBadge = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("active") || normalized.includes("signed")) {
        return <Badge bg="success-subtle" text="success">{status}</Badge>;
    }
    if (normalized.includes("draft") || normalized.includes("pending")) {
        return <Badge bg="warning-subtle" text="warning">{status}</Badge>;
    }
    if (normalized.includes("cancel") || normalized.includes("expire") || normalized.includes("closed")) {
        return <Badge bg="danger-subtle" text="danger">{status}</Badge>;
    }
    return <Badge bg="secondary-subtle" text="secondary">{status || "-"}</Badge>;
};

const Contracts = () => {
    document.title = "Contracts | Steex - Admin & Dashboard Template";

    const columns = useMemo(
        () => [
            {
                header: (
                    <Form.Check>
                        <Form.Check.Input type="checkbox" value="option" id="checkAllContracts" />
                        <Form.Check.Label htmlFor="checkAllContracts"></Form.Check.Label>
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
                header: "Contract",
                accessorKey: "name",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => cell.getValue() || "-",
            },
            {
                header: "Status",
                accessorKey: "status",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => getStatusBadge(cell.getValue()),
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
                name: "name",
                label: "Contract Name",
                type: "text",
                required: true,
                placeholder: "Enter contract name",
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Draft", value: "Draft" },
                    { label: "Active", value: "Active" },
                    { label: "Closed", value: "Closed" },
                ],
            },
        ],
        []
    );

    return (
        <EntityCrudList
            entityType="EblaContract"
            entityName="Contract"
            title="Contracts List"
            pageTitle="Contracts"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Contract"
            searchPlaceholder="Search for contract name, status, agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status"]}
            defaultOrderBy="createdAt"
            defaultOrder="desc"
            defaultPageSize={10}
            views={["table", "grid"]}
            defaultView="table"
            floatingToolbar
        />
    );
};

export default Contracts;
