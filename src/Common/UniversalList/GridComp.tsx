import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface GridViewProps {
    data: any[];
    loading: boolean;
    renderItem?: (item: any) => React.ReactNode;
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (index: number) => void;
}

const GridComp = ({
    data,
    loading,
    renderItem,
    pageIndex,
    pageSize,
    totalCount,
    onPageChange
}: GridViewProps) => {

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex + 1 < totalPages;

    return (
        <Fragment>
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <Row className="g-3">
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <Col key={index} xl={3} sm={6}>
                                {renderItem ? renderItem(item) : (
                                    <div className="card bg-white">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.name || item.title || "No Title"}</h5>
                                            <p className="card-text">
                                                No renderItem prop provided.
                                                Please provide a renderItem function to display entity details.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Col>
                        ))
                    ) : (
                        <Col xs={12}>
                            <div className="text-center py-5">
                                <p>No results found.</p>
                            </div>
                        </Col>
                    )}
                </Row>
            )}

            {!loading && totalCount > 0 && (
                <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                    <div className="col-sm">
                        <div className="text-muted">
                            Showing <span className="fw-semibold">{data.length > 0 ? (pageIndex * pageSize) + 1 : 0}</span> to <span className="fw-semibold">{Math.min((pageIndex + 1) * pageSize, totalCount)}</span> of <span className="fw-semibold">{totalCount}</span> Results
                        </div>
                    </div>
                    <div className="col-sm-auto">
                        <ul className="pagination pagination-separated pagination-sm justify-content-center justify-content-sm-start mb-0">
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
                </Row>
            )}
        </Fragment>
    );
};

export default GridComp;
