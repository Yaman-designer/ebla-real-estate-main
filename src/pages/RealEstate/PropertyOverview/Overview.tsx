import React from 'react';
import { Card, Image, Row, Col, Badge, Table } from 'react-bootstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { EcommerceMap } from 'pages/Ecommerce/EcommerceMap';
import { RealEstateProperty } from 'helpers/espocrm/types';
import { getWebAssetUrl } from 'helpers/espocrm/propertyService';

// Default images if none available
import overview1 from "../../../assets/images/real-estate/overview-01.jpg";

interface OverviewProps {
    property: RealEstateProperty | null;
}

const Overview = ({ property }: OverviewProps) => {

    if (!property) return null;

    let images = property.imagesIds && property.imagesIds.length > 0
        ? property.imagesIds
        : [];

    if (property.mainImageId && !images.includes(property.mainImageId)) {
        images = [property.mainImageId, ...images];
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Under Approval':
            case 'Inactive': return 'warning';
            case 'Not Approved': return 'danger';
            case 'Under negotiation':
            case 'Received payment': return 'info';
            case 'Rented':
            case 'Sold': return 'primary';
            case 'Under Investment': return 'secondary';
            default: return 'primary';
        }
    };

    const statusColor = getStatusColor(property.status || '');
    const typeLabel = property.type || 'Property';

    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    {images.length > 0 ? (
                        <Swiper
                            pagination={{ el: '.swiper-pagination', clickable: true }}
                            navigation={true}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            modules={[Pagination, Navigation, Autoplay]}
                            loop={true}
                            className="property-slider mb-3"
                        >
                            <div className="swiper-wrapper">
                                {images.map((imageId, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="position-relative ribbon-box">
                                            <div className={`ribbon ribbon-${statusColor} fw-medium rounded-end mt-2`}> {property.status || typeLabel}</div>
                                            <Image src={getWebAssetUrl(imageId)} alt="" className="img-fluid" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#f0f0f0' }} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </div>
                            <div className="swiper-pagination swiper-pagination-bullets"></div>
                        </Swiper>
                    ) : (
                        <div className="position-relative ribbon-box mb-3">
                            <div className={`ribbon ribbon-${statusColor} fw-medium rounded-end mt-2`}> {property.status || typeLabel}</div>
                            <Image src={overview1} alt="Default" className="img-fluid" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#f0f0f0' }} />
                        </div>
                    )}

                    <div className="pt-1">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="card-title mb-0">{property.name}</h6>
                        </div>

                        <div className="text-muted hstack gap-2 flex-wrap list-unstyled mb-3">
                            <div>
                                <i className="bi bi-geo-alt align-baseline me-1"></i> {property.addressStreet ? `${property.addressStreet}, ` : ''}{property.addressCity}, {property.addressCountry}
                            </div>
                            <div className="vr"></div>
                            <div>
                                <i className="bi bi-calendar-event align-baseline me-1"></i> Listed: {new Date(property.createdAt).toLocaleDateString()}
                            </div>
                            {property.modifiedAt && (
                                <>
                                    <div className="vr"></div>
                                    <div>
                                        <i className="bi bi-clock-history align-baseline me-1"></i> Updated: {new Date(property.modifiedAt).toLocaleDateString()}
                                    </div>
                                </>
                            )}
                        </div>

                        <h6 className="fs-md mb-2">Description</h6>
                        <p className="text-muted mb-4">{property.description || "No description available."}</p>
                    </div>

                    <div className="mb-4">
                        <h6 className="card-title mb-3">Key Details</h6>
                        <Row className="g-3">
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-success-subtle text-success fs-xl rounded-circle">
                                            <span className="fw-bold">$</span>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Price</p>
                                    <h6 className="mb-0">{property.priceCurrency} {property.price?.toLocaleString()}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-warning-subtle text-warning fs-xl rounded-circle">
                                            <i className="bi bi-house"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Bedrooms</p>
                                    <h6 className="mb-0">{property.bedroomCount || '-'}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-danger-subtle text-danger fs-xl rounded-circle">
                                            <i className="ph ph-bathtub"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Bathrooms</p>
                                    <h6 className="mb-0">{property.bathroomCount || '-'}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-secondary-subtle text-secondary fs-xl rounded-circle">
                                            <i className="bi bi-map"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Location</p>
                                    <h6 className="mb-0">{property.addressCity}, {property.addressCountry}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-primary-subtle text-primary fs-xl rounded-circle">
                                            <i className="bi bi-buildings"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Type</p>
                                    <h6 className="mb-0">{property.type}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-info-subtle text-info fs-xl rounded-circle">
                                            <i className="bi bi-calendar3"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Year Built</p>
                                    <h6 className="mb-0">{property.yearBuilt || '-'}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-warning-subtle text-warning fs-xl rounded-circle">
                                            <i className="bi bi-layers"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Floor</p>
                                    <h6 className="mb-0">{property.floor || '-'} / {property.floorCount || '-'}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-success-subtle text-success fs-xl rounded-circle">
                                            <i className="bi bi-qr-code"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Code</p>
                                    <h6 className="mb-0">{property.propertyCode || '-'}</h6>
                                </div>
                            </Col>
                            <Col xl={3} sm={6}>
                                <div className="p-3 border border-dashed rounded text-center">
                                    <div className="avatar-sm mx-auto mb-2">
                                        <div className="avatar-title bg-dark-subtle text-dark fs-xl rounded-circle">
                                            <i className="bi bi-person-badge"></i>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0">Agent</p>
                                    <h6 className="mb-0">{property.assignedUserName || '-'}</h6>
                                </div>
                            </Col>
                        </Row>
                    </div>

                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    <Card.Title as="h6" className="mb-0">Property Location</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div id="leaflet-map-group-control" className='leaflet-map leaflet-gray ' style={{ minHeight: '100%' }}>
                        <EcommerceMap style={{ height: 400 }} data={property} />
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}

export default Overview
