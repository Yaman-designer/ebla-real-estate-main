import React from 'react';
import { Container, Card, Badge } from 'react-bootstrap';
import BreadCrumb from 'Common/BreadCrumb';
import UniversalList from 'Common/UniversalList';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

const UniversalListDemo = () => {
    document.title = "Universal List Demo | Ebla Real Estate";

    // Column Config for Table View
    const columnHelper = createColumnHelper<any>();

    // We can't type strictly without the real entity type, so using any
    const columns = [
        columnHelper.accessor('propertyCode', {
            header: () => 'Property Code',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('type', {
            header: () => 'Type',
            cell: info => <Badge bg="info">{info.getValue()}</Badge>,
        }),
        columnHelper.accessor('status', {
            header: () => 'Status',
            cell: info => <span className={`badge bg-${info.getValue() === 'Active' ? 'success' : 'warning'}`}>{info.getValue()}</span>,
        }),
        columnHelper.accessor('createdAt', {
            header: () => 'Date',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
    ];

    // Grid Item Component to handle Image Error State
    const PropertyGridItem = ({ item }: { item: any }) => {
        const [imgError, setImgError] = React.useState(false);

        // Construct Image URL - Using WebAsset entry point
        const imageUrl = item.mainImageId
            ? `${process.env.REACT_APP_ESPOCRM_URL || ''}/?entryPoint=WebAsset&id=${item.mainImageId}`
            : null;

        return (
            <div className="card h-100">
                {/* Image or Placeholder */}
                <div className="card-img-top bg-light text-center" style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imageUrl && !imgError ? (
                        <img
                            src={imageUrl}
                            alt={item.type}
                            className="img-fluid"
                            style={{ maxHeight: '100%', width: 'auto' }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <i className="ri-building-line ri-3x text-secondary"></i>
                    )}
                </div>
                <div className="card-body">
                    <h5 className="card-title text-truncate">{item.type} - {item.status}</h5>
                    <p className="card-text text-muted mb-1">
                        <i className="ph-map-pin me-1"></i> {item.addressCity || 'N/A'}
                    </p>
                    <p className="card-text">
                        Code: <strong>{item.propertyCode}</strong> <br />
                        Price: <strong>€{item.price}</strong>
                    </p>
                    <Link to="#" className="btn btn-primary btn-sm w-100">View Details</Link>
                </div>
            </div>
        );
    };

    // Grid Item Render
    const renderGridItem = (item: any) => <PropertyGridItem item={item} />;

    // Map Marker Render
    const renderMapMarker = (item: any) => {
        return (
            <div>
                <h6>{item.type}</h6>
                <p>Status: {item.status}</p>
                <b>{item.propertyCode}</b>
            </div>
        );
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Universal List Demo" pageTitle="Components" />

                <Card>
                    <div className="card-body">
                        <UniversalList
                            title="Real Estate Properties"
                            entityName="Property"
                            entityType="RealEstateProperty"
                            columns={columns}
                            gridItemRender={renderGridItem}
                            mapMarkerRender={renderMapMarker}
                            views={['table', 'grid', 'map']}
                            defaultView="table"
                            onAddClick={() => console.log('Add Clicked')}
                            onFilterClick={() => console.log('Filter Clicked')}
                            actions={[
                                {
                                    icon: 'ph-eye',
                                    variant: 'primary',
                                    label: 'View',
                                    onClick: (item) => console.log('View', item)
                                },
                                {
                                    icon: 'ph-pencil',
                                    variant: 'secondary',
                                    label: 'Edit',
                                    onClick: (item) => console.log('Edit', item)
                                },
                                {
                                    icon: 'ph-trash',
                                    variant: 'danger',
                                    label: 'Delete',
                                    onClick: (item) => console.log('Delete', item)
                                }
                            ]}
                            latField="addressLatitude"
                            lngField="addressLongitude"
                            mainImageField="mainImageId"
                            attributeSelect="name,createdAt,assignedUserId,assignedUserName,status,type,type,propertyCode,requestType,price,bedroomCount,square,floorKey,addressCity,addressLatitude,addressLongitude,mainImageId"
                        />
                    </div>
                </Card>
            </Container>
        </div>
    );
};

export default UniversalListDemo;
