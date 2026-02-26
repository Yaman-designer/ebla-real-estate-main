import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { Badge, Button, ButtonGroup, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import ListView from "Common/UniversalList/ListView";
import GridComp from "Common/UniversalList/GridComp";
import type { ActionItem } from "Common/UniversalList";
import { DeleteModal } from "Common/DeleteModal";
import { espoClient } from "helpers/espocrm";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";

type FieldType = "text" | "textarea" | "number" | "email" | "select" | "date" | "checkbox";

interface SelectOption {
    label: string;
    value: string;
}

export interface CrudFieldConfig {
    name: string;
    label: string;
    type?: FieldType;
    required?: boolean;
    placeholder?: string;
    options?: SelectOption[];
    rows?: number;
}

interface EntityCrudListProps {
    entityType: string;
    entityName: string;
    title: string;
    pageTitle: string;
    pageParentTitle: string;
    addButtonLabel?: string;
    searchPlaceholder?: string;
    columns: any[];
    formFields: CrudFieldConfig[];
    attributeSelect?: string;
    defaultOrderBy?: string;
    defaultOrder?: "asc" | "desc";
    defaultPageSize?: number;
    maxPageSize?: number;
    allowedPayloadFields?: string[];
    mapRowToFormValues?: (row: any) => Record<string, unknown>;
    mapFormValuesToPayload?: (values: Record<string, unknown>, currentRow: any | null) => Record<string, unknown>;
    sortFieldMap?: Record<string, string>;
    views?: ("table" | "grid")[];
    defaultView?: "table" | "grid";
    gridItemRender?: (row: any, actions: ActionItem[]) => React.ReactNode;
    floatingToolbar?: boolean;
    floatingToolbarTop?: number | string;
}

const humanizeKey = (key: string): string =>
    key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

const formatGridValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return String(value);
    if (typeof value === "string") {
        const parsedDate = Date.parse(value);
        if (!Number.isNaN(parsedDate) && (value.includes("T") || value.includes("-"))) {
            return new Date(parsedDate).toLocaleString();
        }
        return value;
    }
    return String(value);
};

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object") {
        const maybeError = error as { response?: { data?: unknown }; message?: string };
        if (typeof maybeError.response?.data === "string") return maybeError.response.data;
        if (typeof maybeError.message === "string") return maybeError.message;
    }
    return "Something went wrong";
};

const buildInitialValues = (
    formFields: CrudFieldConfig[],
    currentRow: any | null,
    mapRowToFormValues?: (row: any) => Record<string, unknown>
) => {
    const mapped = currentRow && mapRowToFormValues ? mapRowToFormValues(currentRow) : {};
    return formFields.reduce((acc, field) => {
        const rowValue = currentRow ? currentRow[field.name] : undefined;
        const mappedValue = mapped[field.name];

        if (field.type === "checkbox") {
            acc[field.name] = Boolean(mappedValue ?? rowValue ?? false);
        } else {
            acc[field.name] = (mappedValue ?? rowValue ?? "") as string | number;
        }
        return acc;
    }, {} as Record<string, unknown>);
};

const buildValidationSchema = (formFields: CrudFieldConfig[]) => {
    const schemaShape: Record<string, Yup.AnySchema> = {};

    formFields.forEach((field) => {
        if (field.type === "checkbox") {
            schemaShape[field.name] = field.required
                ? Yup.boolean().oneOf([true], `${field.label} is required`)
                : Yup.boolean();
            return;
        }

        if (field.type === "number") {
            schemaShape[field.name] = field.required
                ? Yup.number().typeError(`${field.label} must be a number`).required(`${field.label} is required`)
                : Yup.number()
                    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
                    .nullable();
            return;
        }

        if (field.type === "email") {
            schemaShape[field.name] = field.required
                ? Yup.string().email("Invalid email").required(`${field.label} is required`)
                : Yup.string().email("Invalid email");
            return;
        }

        schemaShape[field.name] = field.required
            ? Yup.string().trim().required(`${field.label} is required`)
            : Yup.string();
    });

    return Yup.object(schemaShape);
};

const sanitizePayload = (
    values: Record<string, unknown>,
    formFields: CrudFieldConfig[],
    allowedPayloadFields?: string[]
) => {
    const allowedSet = allowedPayloadFields ? new Set(allowedPayloadFields) : null;
    const payload: Record<string, unknown> = {};

    formFields.forEach((field) => {
        if (allowedSet && !allowedSet.has(field.name)) return;

        const rawValue = values[field.name];

        if (field.type === "checkbox") {
            payload[field.name] = Boolean(rawValue);
            return;
        }

        if (field.type === "number") {
            if (rawValue === "" || rawValue === null || rawValue === undefined) return;
            const num = Number(rawValue);
            if (!Number.isNaN(num)) payload[field.name] = num;
            return;
        }

        if (typeof rawValue === "string") {
            const trimmed = rawValue.trim();
            if (trimmed === "") return;
            payload[field.name] = trimmed;
            return;
        }

        if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
            payload[field.name] = rawValue;
        }
    });

    return payload;
};

const EntityCrudList = ({
    entityType,
    entityName,
    title,
    pageTitle,
    pageParentTitle,
    addButtonLabel,
    searchPlaceholder,
    columns,
    formFields,
    attributeSelect,
    defaultOrderBy = "createdAt",
    defaultOrder = "desc",
    defaultPageSize = 10,
    maxPageSize = 200,
    allowedPayloadFields,
    mapRowToFormValues,
    mapFormValuesToPayload,
    sortFieldMap,
    views = ["table"],
    defaultView = "table",
    gridItemRender,
    floatingToolbar = false,
    floatingToolbarTop = "calc(var(--tb-header-height, 70px) + 0.75rem)",
}: EntityCrudListProps) => {
    const [rows, setRows] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(Math.min(defaultPageSize, maxPageSize));
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [fetchError, setFetchError] = useState("");
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [viewMode, setViewMode] = useState<"table" | "grid">(defaultView);

    const [showModal, setShowModal] = useState(false);
    const [currentRow, setCurrentRow] = useState<any | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteRow, setDeleteRow] = useState<any | null>(null);

    useEffect(() => {
        if (!views.includes(viewMode)) {
            setViewMode(views[0] || "table");
        }
    }, [views, viewMode]);

    const initialValues = useMemo(
        () => buildInitialValues(formFields, currentRow, mapRowToFormValues),
        [formFields, currentRow, mapRowToFormValues]
    );

    const validationSchema = useMemo(() => buildValidationSchema(formFields), [formFields]);

    const fetchRows = useCallback(async () => {
        setLoading(true);
        setFetchError("");
        try {
            const sortId = sorting.length > 0 ? sorting[0].id : defaultOrderBy;
            const mappedSortId = sortFieldMap?.[sortId] || sortId;
            const order = sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : defaultOrder;
            const safePageSize = Math.min(pageSize, maxPageSize);

            const response = await espoClient.getList<any>(entityType, {
                maxSize: safePageSize,
                offset: pageIndex * safePageSize,
                orderBy: mappedSortId,
                order,
                attributeSelect,
                textFilter: searchKeyword || undefined,
            });
            setRows(response?.list || []);
            setTotalCount(response?.total || 0);
        } catch (error) {
            const message = getErrorMessage(error);
            setFetchError(message);
            toast.warn(`Failed to load ${entityName.toLowerCase()}s: ${message}`);
            setRows([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [
        entityType,
        defaultOrderBy,
        defaultOrder,
        attributeSelect,
        entityName,
        pageIndex,
        pageSize,
        searchKeyword,
        sorting,
        maxPageSize,
        sortFieldMap,
    ]);

    useEffect(() => {
        fetchRows();
    }, [fetchRows]);

    useEffect(() => {
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        searchDebounceRef.current = setTimeout(() => {
            setPageIndex(0);
            setSearchKeyword(search.trim());
        }, 400);

        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
        };
    }, [search]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
            helpers.setSubmitting(true);
            try {
                const basePayload = sanitizePayload(values as Record<string, unknown>, formFields, allowedPayloadFields);
                const payload = mapFormValuesToPayload ? mapFormValuesToPayload(basePayload, currentRow) : basePayload;

                if (currentRow?.id) {
                    await espoClient.updateEntity(entityType, currentRow.id, payload);
                    toast.success(`${entityName} updated successfully`);
                } else {
                    await espoClient.createEntity(entityType, payload);
                    toast.success(`${entityName} created successfully`);
                }

                helpers.resetForm();
                setShowModal(false);
                setCurrentRow(null);
                await fetchRows();
            } catch (error) {
                toast.error(`Save failed: ${getErrorMessage(error)}`);
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    const handleAdd = useCallback(() => {
        setCurrentRow(null);
        setShowModal(true);
    }, []);

    const handleEdit = useCallback((row: any) => {
        setCurrentRow(row);
        setShowModal(true);
    }, []);

    const handleDeleteOpen = useCallback((row: any) => {
        setDeleteRow(row);
        setShowDelete(true);
    }, []);

    const handleDelete = async () => {
        if (!deleteRow?.id) {
            setShowDelete(false);
            return;
        }

        try {
            await espoClient.deleteEntity(entityType, deleteRow.id);
            toast.success(`${entityName} deleted successfully`);
            await fetchRows();
        } catch (error) {
            toast.error(`Delete failed: ${getErrorMessage(error)}`);
        } finally {
            setShowDelete(false);
            setDeleteRow(null);
        }
    };

    const actions: ActionItem[] = useMemo(() => [
        {
            icon: "ph-pencil",
            variant: "secondary",
            label: "Edit",
            onClick: handleEdit,
        },
        {
            icon: "ph-trash",
            variant: "danger",
            label: "Delete",
            onClick: handleDeleteOpen,
        },
    ], [handleDeleteOpen, handleEdit]);

    const defaultGridItemRender = useCallback(
        (row: any) => {
            const titleValue = row?.name || row?.title || `${entityName} ${row?.id ? `#${row.id}` : ""}`.trim();
            const metadataEntries = Object.entries(row || {})
                .filter(([key, value]) => {
                    if (["id", "name", "title", "deleted", "createdAt", "modifiedAt"].includes(key)) return false;
                    if (value === null || value === undefined || value === "") return false;
                    if (typeof value === "object") return false;
                    return true;
                })
                .slice(0, 3);

            return (
                <Card className="h-100 shadow-sm border-0 bg-white">
                    <Card.Body>
                        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                            <div>
                                <h6 className="mb-1 text-truncate">{titleValue}</h6>
                                <p className="text-muted mb-0 small">#{row?.id || "-"}</p>
                            </div>
                            {row?.status ? (
                                <Badge bg="secondary-subtle" text="secondary" className="text-uppercase">
                                    {String(row.status)}
                                </Badge>
                            ) : null}
                        </div>

                        <div className="vstack gap-2 mb-3">
                            {metadataEntries.length > 0 ? metadataEntries.map(([key, value]) => (
                                <div key={key} className="d-flex justify-content-between gap-2">
                                    <span className="text-muted small">{humanizeKey(key)}</span>
                                    <span className="small text-truncate">{formatGridValue(value)}</span>
                                </div>
                            )) : (
                                <div className="text-muted small">No additional details.</div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                {row?.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
                            </small>
                            <div className="d-flex gap-2">
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
                        </div>
                    </Card.Body>
                </Card>
            );
        },
        [actions, entityName]
    );

    const renderGridItem = useCallback(
        (row: any) => (gridItemRender ? gridItemRender(row, actions) : defaultGridItemRender(row)),
        [gridItemRender, actions, defaultGridItemRender]
    );
    const shouldUseFloatingToolbar = floatingToolbar && viewMode === "grid";

    const toolbarContent = (
        <Row className="align-items-center g-2">
            {!shouldUseFloatingToolbar ? (
                <Col lg={3} className="me-auto">
                    <Card.Title as="h6" className="mb-0">
                        {title} <Badge bg="primary" className="ms-1 align-baseline">{totalCount}</Badge>
                    </Card.Title>
                </Col>
            ) : null}
            <Col xl={shouldUseFloatingToolbar ? 4 : 3} lg={shouldUseFloatingToolbar ? 5 : 4} sm={shouldUseFloatingToolbar ? 8 : 6} className={shouldUseFloatingToolbar ? "me-auto" : ""}>
                <div className="search-box">
                    <Form.Control
                        type="text"
                        className="search"
                        placeholder={searchPlaceholder || `Search ${entityName.toLowerCase()}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="ri-search-line search-icon"></i>
                </div>
            </Col>
            {views.length > 1 ? (
                <Col className="col-sm-auto">
                    <ButtonGroup>
                        {views.includes("grid") ? (
                            <Button
                                variant="subtle-primary"
                                className={`btn-icon ${viewMode === "grid" ? "active" : ""}`}
                                onClick={() => setViewMode("grid")}
                                title="Grid view"
                            >
                                <i className="bi bi-grid"></i>
                            </Button>
                        ) : null}
                        {views.includes("table") ? (
                            <Button
                                variant="subtle-primary"
                                className={`btn-icon ${viewMode === "table" ? "active" : ""}`}
                                onClick={() => setViewMode("table")}
                                title="List view"
                            >
                                <i className="bi bi-list-task"></i>
                            </Button>
                        ) : null}
                    </ButtonGroup>
                </Col>
            ) : null}
            <Col className="col-sm-auto">
                <Button variant="secondary" onClick={handleAdd}>
                    <i className="bi bi-plus-circle align-baseline me-1"></i>
                    {addButtonLabel || `Add ${entityName}`}
                </Button>
            </Col>
        </Row>
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={pageTitle} pageTitle={pageParentTitle} />
                    <Row>
                        <Col lg={12}>
                            {shouldUseFloatingToolbar ? (
                                <Card
                                    className="border-0 shadow-sm mb-3 position-sticky"
                                    style={{
                                        top: typeof floatingToolbarTop === "number" ? `${floatingToolbarTop}px` : floatingToolbarTop,
                                        zIndex: 5,
                                    }}
                                >
                                    <Card.Body className="py-3">
                                        {toolbarContent}
                                    </Card.Body>
                                </Card>
                            ) : null}
                            {shouldUseFloatingToolbar ? (
                                <div className="pt-1">
                                    {fetchError ? (
                                        <div className="alert alert-warning mb-3" role="alert">
                                            {fetchError}
                                        </div>
                                    ) : null}
                                    <GridComp
                                        data={rows}
                                        loading={loading}
                                        renderItem={renderGridItem}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                        totalCount={totalCount}
                                        onPageChange={setPageIndex}
                                    />
                                </div>
                            ) : (
                                <Card>
                                    <Card.Header>
                                        {toolbarContent}
                                    </Card.Header>
                                    <Card.Body className="mt-3">
                                        {fetchError ? (
                                            <div className="alert alert-warning mb-3" role="alert">
                                                {fetchError}
                                            </div>
                                        ) : null}

                                        {viewMode === "grid" ? (
                                            <div className="bg-light rounded-3 p-3">
                                                <GridComp
                                                    data={rows}
                                                    loading={loading}
                                                    renderItem={renderGridItem}
                                                    pageIndex={pageIndex}
                                                    pageSize={pageSize}
                                                    totalCount={totalCount}
                                                    onPageChange={setPageIndex}
                                                />
                                            </div>
                                        ) : (
                                            <ListView
                                                data={rows}
                                                columns={columns}
                                                loading={loading}
                                                pageIndex={pageIndex}
                                                pageSize={pageSize}
                                                totalCount={totalCount}
                                                sorting={sorting}
                                                onPageChange={setPageIndex}
                                                onPageSizeChange={(size) => {
                                                    setPageSize(Math.min(size, maxPageSize));
                                                    setPageIndex(0);
                                                }}
                                                onSortChange={(newSorting) => {
                                                    setSorting(newSorting);
                                                    setPageIndex(0);
                                                }}
                                                actions={actions}
                                            />
                                        )}
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal show={showModal} onHide={() => { setShowModal(false); setCurrentRow(null); }}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{currentRow ? `Edit ${entityName}` : `Add ${entityName}`}</Modal.Title>
                </Modal.Header>
                <Form autoComplete="off" onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <Row>
                            {formFields.map((field) => {
                                const error = formik.touched[field.name as never] && formik.errors[field.name as never];
                                const fieldType = field.type || "text";

                                return (
                                    <Col lg={12} key={field.name}>
                                        <div className="mb-3">
                                            {fieldType !== "checkbox" && (
                                                <Form.Label htmlFor={field.name}>
                                                    {field.label}
                                                    {field.required ? <span className="text-danger">*</span> : null}
                                                </Form.Label>
                                            )}

                                            {fieldType === "textarea" && (
                                                <Form.Control
                                                    as="textarea"
                                                    rows={field.rows || 3}
                                                    id={field.name}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    value={(formik.values[field.name as never] as string) || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={!!error}
                                                />
                                            )}

                                            {fieldType === "select" && (
                                                <Form.Select
                                                    id={field.name}
                                                    name={field.name}
                                                    value={(formik.values[field.name as never] as string) || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={!!error}
                                                >
                                                    <option value="">Select {field.label}</option>
                                                    {(field.options || []).map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            )}

                                            {fieldType === "checkbox" && (
                                                <Form.Check
                                                    id={field.name}
                                                    name={field.name}
                                                    type="checkbox"
                                                    label={field.label}
                                                    checked={Boolean(formik.values[field.name as never])}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={!!error}
                                                />
                                            )}

                                            {!["textarea", "select", "checkbox"].includes(fieldType) && (
                                                <Form.Control
                                                    type={fieldType}
                                                    id={field.name}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    value={(formik.values[field.name as never] as string | number) ?? ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    isInvalid={!!error}
                                                />
                                            )}

                                            {error ? (
                                                <Form.Control.Feedback type="invalid" className="d-block">
                                                    {String(error)}
                                                </Form.Control.Feedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="hstack gap-2 justify-content-end">
                            <Button
                                className="btn btn-ghost-danger"
                                onClick={() => {
                                    setShowModal(false);
                                    setCurrentRow(null);
                                }}
                            >
                                <i className="bi bi-x-lg align-baseline me-1"></i> Close
                            </Button>
                            <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? "Saving..." : (currentRow ? `Update ${entityName}` : `Create ${entityName}`)}
                            </Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>

            <DeleteModal show={showDelete} handleClose={() => setShowDelete(false)} deleteModalFunction={handleDelete} />
            <ToastContainer />
        </React.Fragment>
    );
};

export default EntityCrudList;
