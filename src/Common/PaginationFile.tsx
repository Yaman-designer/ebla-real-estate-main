import React from "react";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const PaginationFile = (props: any) => {
    const { currentpages, pagination, perPageData, currentPage, pageNumbers, handlenextPage, handleClick, handleprevPage, estateList, className, totalCount } = props;

    // Smart pagination logic to show limited page numbers
    const getVisiblePages = (page: number, total: number) => {
        if (total < 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        if (page < 5) {
            return [1, 2, 3, 4, 5, '...', total];
        }
        if (page > total - 4) {
            return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        }
        return [1, '...', page - 1, page, page + 1, '...', total];
    };

    const totalPages = pageNumbers?.length || 0;
    const visiblePages = getVisiblePages(currentPage, totalPages);

    const indexOfLast = currentPage * perPageData;
    const indexOfFirst = indexOfLast - perPageData; // 0-based index start for display
    // Showing 1-8 of 100
    const count = totalCount || 0;
    const showingFrom = count === 0 ? 0 : (currentPage - 1) * perPageData + 1;
    const showingTo = Math.min(currentPage * perPageData, count);


    return (
        <React.Fragment>
            {!currentpages?.length && <div id="noresult">
                <div className="text-center py-4">
                    <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-light text-primary rounded-circle fs-4xl">
                            <i className="bi bi-search"></i>
                        </div>
                    </div>
                    <h5 className="mt-2">Sorry! No Result Found</h5>
                </div>
            </div>}
            {pagination && <Row className={`align-items-center ${className} justify-content-between text-center text-sm-start`} id="pagination-element" style={{ display: "flex" }}>
                <div className="col-sm">
                    <div className="text-muted">
                        Showing <span className="fw-semibold">{showingFrom}</span> - <span className="fw-semibold">{showingTo}</span> of <span className="fw-semibold">{count || estateList?.length}</span> Results
                    </div>
                </div>
                <div className="col-sm-auto  mt-3 mt-sm-0">
                    <div className="pagination-wrap hstack gap-2">

                        {currentPage <= 1 ? (<Link to="#" className="page-item disabled pagination-prev">Previous</Link>) :
                            (<Link to="#" className={currentPage <= 1 ? "page-item disabled pagination-prev" : "page-item pagination-prev"} onClick={() => handleprevPage()}>Previous</Link>)}

                        <ul className="pagination listjs-pagination mb-0">
                            {visiblePages.map((item: any, key: any) => (
                                <React.Fragment key={key}>
                                    <li className={`${currentPage === item ? "active " : ""} ${item === '...' ? "disabled" : ""}`}>
                                        <Link className="page" to="#" key={key} id={item} onClick={(e) => item !== '...' && handleClick(e)}>
                                            {item}
                                        </Link>
                                    </li>
                                </React.Fragment>
                            ))}
                        </ul>
                        <Link to="#" className={currentPage >= totalPages ? "page-item disabled pagination-next" : "page-item pagination-next"} onClick={() => handlenextPage()}>Next</Link>
                    </div>
                </div>
            </Row>}
        </React.Fragment>
    );
}

export default PaginationFile;