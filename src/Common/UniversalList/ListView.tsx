import React, { Fragment } from 'react';
import { Table, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { ActionItem } from './index';

interface ListViewProps {
    data: any[];
    columns: any[];
    loading: boolean;
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    sorting: any[];
    onPageChange: (index: number) => void;
    onPageSizeChange: (size: number) => void;
    onSortChange: (sorting: any[]) => void;
    actions?: ActionItem[];
}

const ListView = ({
    data,
    columns,
    loading,
    pageIndex,
    pageSize,
    totalCount,
    sorting,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    actions,
}: ListViewProps) => {

    // Build final columns: user columns + optional action column
    const finalColumns = React.useMemo(() => {
        if (!actions || actions.length === 0) return columns;

        const actionCol = {
            header: 'Action',
            id: '_actions',
            enableColumnFilter: false,
            enableSorting: false,
            cell: (cell: any) => {
                const item = cell.row.original;
                return (
                    <ul className="d-flex gap-2 list-unstyled mb-0">
                        {actions.map((action, idx) => (
                            <li key={idx}>
                                <Link
                                    to="#"
                                    className={`btn btn-subtle-${action.variant} btn-icon btn-sm`}
                                    title={action.label}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        action.onClick(item);
                                    }}
                                >
                                    <i className={action.icon}></i>
                                </Link>
                            </li>
                        ))}
                    </ul>
                );
            },
        };

        return [...columns, actionCol];
    }, [columns, actions]);

    const table = useReactTable({
        columns: finalColumns,
        data,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            sorting,
        },
        pageCount: Math.ceil(totalCount / pageSize),
        manualPagination: true,
        manualSorting: true,
        onPaginationChange: (updater: any) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize });
                onPageChange(newState.pageIndex);
                if (newState.pageSize !== pageSize) {
                    onPageSizeChange(newState.pageSize);
                }
            } else {
                onPageChange(updater.pageIndex);
                if (updater.pageSize !== pageSize) {
                    onPageSizeChange(updater.pageSize);
                }
            }
        },
        onSortingChange: (updater: any) => {
            if (typeof updater === 'function') {
                onSortChange(updater(sorting));
            } else {
                onSortChange(updater);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const { getHeaderGroups, getRowModel } = table;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex + 1 < totalPages;

    return (
        <Fragment>
            <div className="table-responsive table-card position-relative">
                {loading && data.length > 0 && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ background: "rgba(255,255,255,0.6)", zIndex: 2 }}
                    >
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <Table className="table-centered align-middle table-custom-effect table-nowrap mb-0" hover>
                    <thead className="table-light text-muted">
                        {getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={header.column.getCanSort() ? 'cursor-pointer select-none d-flex align-items-center justify-content-between gap-2' : 'd-flex align-items-center'}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <span className="fw-semibold">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                {header.column.getCanSort() ? (
                                                    <span className="text-muted fs-xs">
                                                        {{
                                                            asc: <i className="bi bi-caret-up-fill"></i>,
                                                            desc: <i className="bi bi-caret-down-fill"></i>,
                                                        }[header.column.getIsSorted() as string] ?? <i className="bi bi-arrow-down-up"></i>}
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={finalColumns.length} className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        {!loading && data.length === 0 && (
                            <tr>
                                <td colSpan={finalColumns.length} className="noresult">
                                    <div className="text-center py-4">
                                        <div className="avatar-md mx-auto mb-4">
                                            <div className="avatar-title bg-light text-primary rounded-circle fs-4xl">
                                                <i className="bi bi-search"></i>
                                            </div>
                                        </div>
                                        <h5 className="mt-2">Sorry! No Result Found</h5>
                                        <p className="text-muted mb-0">We did not find any records for your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Row className="align-items-center mt-4 pt-3">
                <div className="col-sm-auto">
                    <div className="text-muted">
                        Showing <span className="fw-semibold">{data.length > 0 ? (pageIndex * pageSize) + 1 : 0}</span> to <span className="fw-semibold">{Math.min((pageIndex + 1) * pageSize, totalCount)}</span> of <span className="fw-semibold">{totalCount}</span> Results
                    </div>
                </div>
                <div className="col-sm">
                    <div className="pagination-wrap hstack gap-2 justify-content-end">
                        <ul className="pagination listjs-pagination mb-0">
                            <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                                <Link
                                    to="#"
                                    className="page-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (canPreviousPage) {
                                            onPageChange(pageIndex - 1);
                                        }
                                    }}
                                >
                                    Previous
                                </Link>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">{pageIndex + 1} / {totalPages}</span>
                            </li>
                            <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                                <Link
                                    to="#"
                                    className="page-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (canNextPage) {
                                            onPageChange(pageIndex + 1);
                                        }
                                    }}
                                >
                                    Next
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Row>
        </Fragment>
    );
};

export default ListView;
