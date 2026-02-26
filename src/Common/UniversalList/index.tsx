import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Col, Row, Button, ButtonGroup, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { espoClient } from 'helpers/espocrm';
import { EspoListParams } from 'helpers/espocrm/types';
import ListView from './ListView';
import GridComp from './GridComp';
import MapView from './MapView';

// Action item interface for configurable table actions
export interface ActionItem {
    icon: string;           // e.g. "ph-eye", "ph-pencil", "ph-trash"
    variant: string;        // e.g. "primary", "secondary", "danger"
    label: string;          // tooltip text
    onClick: (item: any) => void;
}

interface UniversalListProps {
    entityType: string;
    columns: any[];
    title: string;
    entityName?: string;
    views?: ('table' | 'grid' | 'map')[];
    defaultView?: 'table' | 'grid' | 'map';
    attributeSelect?: string;
    // Actions
    actions?: ActionItem[];
    // Grid
    // Grid
    gridItemRender?: (item: any) => React.ReactNode;
    mainImageField?: string;
    // Map
    mapMarkerRender?: (item: any) => React.ReactNode;
    latField?: string;
    lngField?: string;
    // Search
    searchDebounceMs?: number;
    // Header Metrics
    headerMetrics?: {
        label: string;
        value: number;
    };
    // Action Buttons
    onAddClick?: () => void;
    onFilterClick?: () => void;
}

const UniversalList = ({
    entityType,
    columns,
    title,
    entityName = 'Entity',
    views = ['table'],
    defaultView = 'table',
    attributeSelect,
    actions,
    gridItemRender,
    mainImageField,
    mapMarkerRender,
    latField = 'lat',
    lngField = 'lng',
    searchDebounceMs = 500,
    headerMetrics,
    onAddClick,
    onFilterClick
}: UniversalListProps) => {

    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'map'>(defaultView);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);

    // Pagination & Sorting State
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sorting, setSorting] = useState<{ id: string, desc: boolean }[]>([]);

    // Debounced search
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Update view mode if props change and current mode is not available
    useEffect(() => {
        if (!views.includes(viewMode)) {
            setViewMode(views[0]);
        }
    }, [views, viewMode]);

    // Handle debounced search
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            setSearchKeyword(value);
            setPageIndex(0);
        }, searchDebounceMs);
    };

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const offset = pageIndex * pageSize;
            const order = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'desc';
            const orderBy = sorting.length > 0 ? sorting[0].id : 'createdAt';

            const params: EspoListParams = {
                maxSize: pageSize,
                offset: offset,
                orderBy: orderBy,
                order: order as 'asc' | 'desc',
            };

            if (attributeSelect) {
                params.select = attributeSelect;
            }

            if (searchKeyword) {
                params.textFilter = searchKeyword;
            }

            const response = await espoClient.getList(entityType, params);

            if (response && response.list) {
                setData(response.list);
                setTotalCount(response.total);
            } else {
                setData([]);
                setTotalCount(0);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // Don't clear data on error so previous results stay visible
        } finally {
            setLoading(false);
        }
    }, [entityType, pageIndex, pageSize, sorting, searchKeyword, attributeSelect]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers
    const handlePageChange = (index: number) => setPageIndex(index);
    const handlePageSizeChange = (size: number) => setPageSize(size);
    const handleSortChange = (sort: { id: string, desc: boolean }[]) => setSorting(sort);

    const renderView = () => {
        switch (viewMode) {
            case 'grid':
                return (
                    <GridComp
                        data={data}
                        loading={loading}
                        renderItem={gridItemRender}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        onPageChange={handlePageChange}
                    />
                );
            case 'map':
                return (
                    <MapView
                        data={data}
                        loading={loading}
                        renderMarker={mapMarkerRender}
                        latField={latField}
                        lngField={lngField}
                    />
                );
            case 'table':
            default:
                return (
                    <ListView
                        data={data}
                        columns={columns}
                        loading={loading}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        sorting={sorting}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onSortChange={handleSortChange}
                        actions={actions}
                    />
                );
        }
    };

    return (
        <React.Fragment>
            <Row className="align-items-center g-2 mb-3">
                <Col lg={3} className="me-auto">
                    {headerMetrics ? (
                        <h6 className="card-title mb-0">{headerMetrics.label} <span className="badge bg-primary ms-1 align-baseline">{headerMetrics.value}</span></h6>
                    ) : (
                        <h5 className="card-title mb-0">{title}</h5>
                    )}
                </Col>
                <Col lg={2}>
                    <div className="search-box">
                        <Form.Control
                            type="text"
                            className="search"
                            placeholder={`Search ${entityName}...`}
                            value={searchInput}
                            onChange={handleSearchInput}
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </Col>
                <div className="col-lg-auto">
                    <div className="hstack flex-wrap gap-2">
                        {onAddClick && (
                            <Button variant="secondary" onClick={onAddClick}>
                                <i className="bi bi-plus-circle align-baseline me-1"></i> Add {entityName}
                            </Button>
                        )}
                        <div className="d-flex gap-1">
                            {onFilterClick && (
                                <Button variant="info" onClick={onFilterClick}>
                                    <i className="bi bi-funnel align-baseline me-1"></i> Filter
                                </Button>
                            )}
                            {views.length > 1 && (
                                <ButtonGroup>
                                    {views.includes('grid') && (
                                        <Link
                                            to="#"
                                            className={`btn btn-subtle-primary btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                                            onClick={(e) => { e.preventDefault(); setViewMode('grid'); }}
                                        >
                                            <i className="bi bi-grid"></i>
                                        </Link>
                                    )}
                                    {views.includes('table') && (
                                        <Link
                                            to="#"
                                            className={`btn btn-subtle-primary btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                                            onClick={(e) => { e.preventDefault(); setViewMode('table'); }}
                                        >
                                            <i className="bi bi-list-task"></i>
                                        </Link>
                                    )}
                                    {views.includes('map') && (
                                        <Link
                                            to="#"
                                            className={`btn btn-subtle-primary btn-icon ${viewMode === 'map' ? 'active' : ''}`}
                                            onClick={(e) => { e.preventDefault(); setViewMode('map'); }}
                                        >
                                            <i className="ri-map-pin-line"></i>
                                        </Link>
                                    )}
                                </ButtonGroup>
                            )}
                        </div>
                    </div>
                </div>
            </Row>

            {/* View container with min-height to prevent jumping */}
            <div style={{ minHeight: '400px', position: 'relative' }}>
                {/* Loading overlay - keeps previous content visible */}
                {loading && data.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.6)',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.375rem',
                    }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {renderView()}
            </div>
        </React.Fragment>
    );
};

export default UniversalList;
