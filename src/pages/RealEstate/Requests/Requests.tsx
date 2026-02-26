import React, { useMemo } from "react";
import { Badge, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { ActionItem } from "Common/UniversalList";
import EntityCrudList, { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";

const getStatusBadge = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("active") || normalized.includes("open")) {
        return <Badge bg="success-subtle" text="success">{status}</Badge>;
    }
    if (normalized.includes("progress") || normalized.includes("pending")) {
        return <Badge bg="warning-subtle" text="warning">{status}</Badge>;
    }
    if (normalized.includes("close") || normalized.includes("reject")) {
        return <Badge bg="danger-subtle" text="danger">{status}</Badge>;
    }
    return <Badge bg="secondary-subtle" text="secondary">{status || "-"}</Badge>;
};

const Requests = () => {
    document.title = "Requests | Steex - Admin & Dashboard Template";

    const columns = useMemo(
        () => [
            {
                header: (
                    <Form.Check>
                        <Form.Check.Input type="checkbox" value="option" id="checkAllRequests" />
                        <Form.Check.Label htmlFor="checkAllRequests"></Form.Check.Label>
                    </Form.Check>
                ),
                cell: () => (
                    <Form.Check type="checkbox" className="orderCheckBox" />
                ),
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
                header: "Request",
                accessorKey: "name",
                enableColumnFilter: false,
                enableSorting: true,
                cell: (cell: any) => cell.getValue() || "-",
            },
            {
                header: "Type",
                accessorKey: "requestType",
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

    // Minimal payload fields for safe generic CRUD bootstrap.
    // Additional fields can be enabled per entity as we add more pages.
    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            {
                name: "name",
                label: "Request Name",
                type: "text",
                required: true,
                placeholder: "Enter request name",
            },
        ],
        []
    );

    const gridItemRender = useMemo(
        () => (row: any, actions: ActionItem[]) => (
            <Card className="h-100 shadow-sm border-0 bg-white">
                <Card.Body>
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                        <div>
                            <h6 className="mb-1 text-truncate">{row?.name || "-"}</h6>
                            <p className="text-muted mb-0 small">#{row?.id || "-"}</p>
                        </div>
                        {getStatusBadge(row?.status)}
                    </div>

                    <div className="vstack gap-2 mb-3">
                        <div className="d-flex justify-content-between gap-2">
                            <span className="text-muted small">Type</span>
                            <span className="small text-truncate">{row?.requestType || "-"}</span>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            <span className="text-muted small">Agent</span>
                            <span className="small text-truncate">{row?.assignedUserName || "-"}</span>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            <span className="text-muted small">Created</span>
                            <span className="small text-truncate">
                                {row?.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        {actions.map((action, idx) => (
                            <button
                                key={`${action.label}-${idx}`}
                                type="button"
                                className={`btn btn-subtle-${action.variant} btn-sm btn-icon`}
                                title={action.label}
                                onClick={() => action.onClick(row)}
                            >
                                <i className={action.icon}></i>
                            </button>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        ),
        []
    );

    return (
        <EntityCrudList
            entityType="RealEstateRequest"
            entityName="Request"
            title="Requests List"
            pageTitle="Requests"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Request"
            searchPlaceholder="Search for request name, type, status, agent..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,requestType,status,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name"]}
            defaultOrderBy="createdAt"
            defaultOrder="desc"
            defaultPageSize={10}
            views={["table", "grid"]}
            defaultView="table"
            gridItemRender={gridItemRender}
            floatingToolbar
        />
    );
};

export default Requests;
