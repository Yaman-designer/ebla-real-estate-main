import React, { useMemo } from "react";
import { Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import EntityCrudList, { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";

const getStatusBadge = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("held") || normalized.includes("done") || normalized.includes("complete")) {
        return <Badge bg="success-subtle" text="success">{status}</Badge>;
    }
    if (normalized.includes("plan") || normalized.includes("new") || normalized.includes("pending")) {
        return <Badge bg="warning-subtle" text="warning">{status}</Badge>;
    }
    if (normalized.includes("cancel") || normalized.includes("not held")) {
        return <Badge bg="danger-subtle" text="danger">{status}</Badge>;
    }
    return <Badge bg="secondary-subtle" text="secondary">{status || "-"}</Badge>;
};

const Calls = () => {
    document.title = "Calls | Steex - Admin & Dashboard Template";

    const columns = useMemo(
        () => [
            {
                header: (
                    <Form.Check>
                        <Form.Check.Input type="checkbox" value="option" id="checkAllCalls" />
                        <Form.Check.Label htmlFor="checkAllCalls"></Form.Check.Label>
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
                header: "Call",
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
                header: "Direction",
                accessorKey: "direction",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => cell.getValue() || "-",
            },
            {
                header: "Start At",
                accessorKey: "dateStart",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => {
                    const value = cell.getValue();
                    return value ? new Date(value).toLocaleString() : "-";
                },
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
                label: "Call Subject",
                type: "text",
                required: true,
                placeholder: "Enter call subject",
            },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Planned", value: "Planned" },
                    { label: "Held", value: "Held" },
                    { label: "Not Held", value: "Not Held" },
                ],
            },
            {
                name: "direction",
                label: "Direction",
                type: "select",
                options: [
                    { label: "Outbound", value: "Outbound" },
                    { label: "Inbound", value: "Inbound" },
                ],
            },
            {
                name: "dateStart",
                label: "Start At",
                type: "date",
            },
        ],
        []
    );

    return (
        <EntityCrudList
            entityType="Call"
            entityName="Call"
            title="Calls List"
            pageTitle="Calls"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Call"
            searchPlaceholder="Search for call subject, status, direction, agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,direction,dateStart,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status", "direction", "dateStart"]}
            defaultOrderBy="createdAt"
            defaultOrder="desc"
            defaultPageSize={10}
            views={["table", "grid"]}
            defaultView="table"
            floatingToolbar
        />
    );
};

export default Calls;
