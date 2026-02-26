import React, { useMemo } from "react";
import { Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import EntityCrudList, { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";

type ColumnType = "text" | "status" | "date" | "datetime" | "boolean";

export interface SimpleEntityColumn {
    key: string;
    label: string;
    type?: ColumnType;
    sortable?: boolean;
}

interface SimpleEntityCrudPageProps {
    pageTitle: string;
    pageParentTitle: string;
    title: string;
    entityType: string;
    entityName: string;
    addButtonLabel?: string;
    searchPlaceholder?: string;
    attributeSelect?: string;
    defaultOrderBy?: string;
    defaultOrder?: "asc" | "desc";
    defaultPageSize?: number;
    allowedPayloadFields?: string[];
    formFields: CrudFieldConfig[];
    columns: SimpleEntityColumn[];
}

const renderStatusBadge = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("active") || normalized.includes("open") || normalized.includes("held") || normalized.includes("done") || normalized.includes("complete")) {
        return <Badge bg="success-subtle" text="success">{status || "Active"}</Badge>;
    }
    if (normalized.includes("pending") || normalized.includes("new") || normalized.includes("plan") || normalized.includes("draft") || normalized.includes("progress")) {
        return <Badge bg="warning-subtle" text="warning">{status || "Pending"}</Badge>;
    }
    if (normalized.includes("close") || normalized.includes("cancel") || normalized.includes("reject") || normalized.includes("expire") || normalized.includes("not held")) {
        return <Badge bg="danger-subtle" text="danger">{status || "Closed"}</Badge>;
    }
    return <Badge bg="secondary-subtle" text="secondary">{status || "-"}</Badge>;
};

const formatValue = (value: unknown, type: ColumnType) => {
    if (type === "status") {
        return renderStatusBadge(typeof value === "string" ? value : undefined);
    }

    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (type === "date") {
        const date = new Date(String(value));
        return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
    }

    if (type === "datetime") {
        const date = new Date(String(value));
        return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
    }

    if (type === "boolean") {
        return Boolean(value) ? "Yes" : "No";
    }

    return String(value);
};

const SimpleEntityCrudPage = ({
    pageTitle,
    pageParentTitle,
    title,
    entityType,
    entityName,
    addButtonLabel,
    searchPlaceholder,
    attributeSelect,
    defaultOrderBy = "createdAt",
    defaultOrder = "desc",
    defaultPageSize = 10,
    allowedPayloadFields,
    formFields,
    columns,
}: SimpleEntityCrudPageProps) => {
    document.title = `${pageTitle} | Steex - Admin & Dashboard Template`;

    const listColumns = useMemo(() => {
        const baseColumns: any[] = [
            {
                header: (
                    <Form.Check>
                        <Form.Check.Input type="checkbox" value="option" id={`checkAll-${entityType}`} />
                        <Form.Check.Label htmlFor={`checkAll-${entityType}`}></Form.Check.Label>
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
        ];

        const dynamicColumns = columns.map((column) => ({
            header: column.label,
            accessorKey: column.key,
            enableColumnFilter: false,
            enableSorting: column.sortable !== false,
            cell: (cell: any) => {
                const row = cell.row.original;
                const value = row?.[column.key];
                return formatValue(value, column.type || "text");
            },
        }));

        return [...baseColumns, ...dynamicColumns];
    }, [columns, entityType]);

    return (
        <EntityCrudList
            entityType={entityType}
            entityName={entityName}
            title={title}
            pageTitle={pageTitle}
            pageParentTitle={pageParentTitle}
            addButtonLabel={addButtonLabel || `Add ${entityName}`}
            searchPlaceholder={searchPlaceholder || `Search ${entityName.toLowerCase()}...`}
            columns={listColumns}
            formFields={formFields}
            attributeSelect={attributeSelect}
            allowedPayloadFields={allowedPayloadFields}
            defaultOrderBy={defaultOrderBy}
            defaultOrder={defaultOrder}
            defaultPageSize={defaultPageSize}
            views={["table", "grid"]}
            defaultView="table"
            floatingToolbar
        />
    );
};

export default SimpleEntityCrudPage;
