import React, { useState, useMemo, useEffect } from "react";
import { Badge, Card, Col, Row, Dropdown, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import PaginationFile from "Common/PaginationFile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { deleteProperty, updateProperty, getWebAssetUrl } from "../../../helpers/espocrm/propertyService";
import { toast } from "react-toastify";
import { RealEstateProperty } from "../../../helpers/espocrm/types";

interface GridPropertyProps {
    data: RealEstateProperty[];
    onRefresh?: () => void;
}

const GridProperty = ({ data, onRefresh }: GridPropertyProps) => {
    const [showDelete, setShowDelete] = useState(false);
    const [realestategrid, setRealestategrid] = useState<any>(null);
    const [editProperty, setEditProperty] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination
    const pagination: boolean = true;
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [currentpages, setCurrentpages] = useState<any>([]);
    const perPageData = 8;
    const handleClick = (e: any) => {
        setCurrentPage(Number(e.target.id));
    };
    const indexOfLast = currentPage * perPageData;
    const indexOfFirst = indexOfLast - perPageData;
    const currentdata = useMemo(() => data.slice(indexOfFirst, indexOfLast), [data, indexOfFirst, indexOfLast])
    useEffect(() => {
        setCurrentpages(currentdata)
    }, [currentPage, data, currentdata])

    const pageNumbers: any = [];
    for (let i = 1; i <= Math.ceil(data.length / perPageData); i++) {
        pageNumbers.push(i);
    }
    const handleprevPage = () => {
        let prevPage = currentPage - 1;
        setCurrentPage(prevPage);
    };
    const handlenextPage = () => {
        let nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };
    useEffect(() => {
        if (pageNumbers.length && pageNumbers.length < currentPage) {
            setCurrentPage(pageNumbers.length)
        }
    }, [currentPage, pageNumbers.length]);

    // Edit Property State
    const handleEditClose = () => { setEditProperty(false); setRealestategrid(null); formik.resetForm(); };
    const handleShowEditProperty = (item: any) => {
        setRealestategrid({
            id: item?.id,
            title: item?.propertyCode || item?.name,
            type: item?.type,
            bedroom: item?.bedroomCount,
            bathroom: item?.bathroomCount,
            area: item?.square,
            price: item?.price,
            location: item?.addressCity || item?.locationName,
            rating: item?.rating
        });
        setEditProperty(true);
    };

    // Delete Property State
    const handleDeleteShow = (ele: any) => { setRealestategrid(ele); setShowDelete(true); };
    const handleDeleteClose = () => { setShowDelete(false); setRealestategrid(null); };

    // API: Delete
    const handleDelete = async () => {
        if (realestategrid?.id) {
            try {
                await deleteProperty(realestategrid.id);
                toast.success("Property deleted successfully");
                setShowDelete(false);
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error("Delete failed", error);
                toast.error("Failed to delete property");
            }
        }
    };

    // Toggle Star (UI only for now)
    const handleStarToogle = (ele: any) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };

    // Formik for Edit
    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: (realestategrid && realestategrid.id) || '',
            title: (realestategrid && realestategrid.title) || '',
            type: (realestategrid && realestategrid.type) || '',
            bedroom: (realestategrid && realestategrid.bedroom) || '',
            bathroom: (realestategrid && realestategrid.bathroom) || '',
            area: (realestategrid && realestategrid.area) || '',
            price: (realestategrid && realestategrid.price) || '',
            location: (realestategrid && realestategrid.location) || '',
            rating: (realestategrid && realestategrid.rating) || ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter Title"),
            type: Yup.string().required("Please Enter Type"),
            bedroom: Yup.number().required("Please Enter Bedroom count"),
            bathroom: Yup.number().required("Please Enter Bathroom count"),
            area: Yup.number().required("Please Enter Area"),
            price: Yup.number().required("Please Enter Price"),
            location: Yup.string().required("Please Enter Location"),
            rating: Yup.string().nullable(),
        }),
        onSubmit: async (values: any) => {
            setIsSubmitting(true);
            try {
                const updateData: Partial<RealEstateProperty> = {
                    name: values.title, // Standard Name field
                    type: values.type,
                    bedroomCount: values.bedroom,
                    bathroomCount: values.bathroom,
                    square: values.area,
                    price: values.price,
                    addressCity: values.location,
                    // rating: values.rating // Removed as per strict compliance
                };

                await updateProperty(values.id, updateData);
                toast.success("Property updated successfully");
                handleEditClose();
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error("Update failed", error);
                toast.error("Failed to update property");
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    return (
        <React.Fragment>
            <div className="col-lg">
                <Row id='property-list'>
                    {(!currentdata || currentdata.length === 0) ? (
                        <Col>
                            <div className="text-center mt-5">
                                <p className="text-muted">No properties found.</p>
                            </div>
                        </Col>
                    ) :
                        (currentdata || [])?.map((item: any) => {
                            return (
                                <Col xxl={3} lg={4} md={6} key={item.id}>
                                    <Card className="real-estate-grid-widgets card-animate">
                                        <Card.Body className="p-2">
                                            {item.mainImageId ? (
                                                <img
                                                    src={getWebAssetUrl(item.mainImageId)}
                                                    alt={item.mainImageName || "Property Image"}
                                                    className="rounded w-100 object-fit-cover"
                                                    style={{ height: "180px" }}
                                                    onError={(e: any) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : (
                                                <div className="bg-light rounded w-100 d-flex align-items-center justify-content-center" style={{ height: "180px" }}>
                                                    <i className="bi bi-image fs-1 text-muted"></i>
                                                </div>
                                            )}
                                            <div className="bg-light rounded w-100 align-items-center justify-content-center" style={{ height: "180px", display: "none" }}>
                                                <i className="bi bi-image fs-1 text-muted"></i>
                                            </div>
                                            <Button type="button" variant="subtle-warning" size="sm" className="custom-toggle btn-icon active" onClick={(e: any) => handleStarToogle(e.target)}>
                                                <span className="icon-on"><i className="bi bi-star"></i></span>
                                                <span className="icon-off"><i className="bi bi-star-fill"></i></span>
                                            </Button>
                                            <Dropdown className="dropdown-real-estate" drop="start">
                                                <Dropdown.Toggle bsPrefix="btn-light btn-icon btn-sm" >
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="dropdown-menu-end">
                                                    <Dropdown.Item href="#" className="edit-list" onClick={() => handleShowEditProperty(item)}> <i className="bi bi-pencil-square me-1 align-baseline"></i> Edit</Dropdown.Item>
                                                    <Dropdown.Item href="#" className="remove-list" onClick={() => handleDeleteShow(item)}> <i className="bi bi-trash3 me-1 align-baseline"></i> Delete</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Card.Body>
                                        <Card.Body className="p-3">
                                            <p className="text-muted float-end mb-0">
                                                <i className="bi bi-star text-warning align-baseline me-1"></i> {item.rating || 'N/A'}
                                            </p>
                                            {
                                                /* Use status or type for badge */
                                                <Badge bg="info-subtle" text="info" className="fs-xxs mb-3"> <i className="bi bi-house-door align-baseline me-1"></i>{item.status || item.type || 'Property'}</Badge>
                                            }
                                            <Link to="/properties">
                                                <h6 className="fs-lg text-capitalize text-truncate">{item.propertyCode || item.titlte || item.name || 'Untitled'}</h6>
                                            </Link>
                                            <p className="text-muted">
                                                <i className="bi bi-geo-alt align-baseline me-1"></i>{item.addressCity || item.locationName || 'N/A'}
                                            </p>
                                            <ul className="d-flex align-items-center gap-2 flex-wrap list-unstyled">
                                                <li>
                                                    <p className="text-muted mb-0">
                                                        <i className="bi bi-house align-baseline text-primary me-1"></i>{item.bedroomCount || 0} Bedroom
                                                    </p>
                                                </li>
                                                <li>
                                                    <p className="text-muted mb-0">
                                                        <i className="ph ph-bathtub align-middle text-primary me-1"></i>{item.bathroomCount || 0} Bathroom</p>
                                                </li>
                                                <li>
                                                    <p className="text-muted mb-0">
                                                        <i className="bi bi-columns align-baseline text-primary me-1"></i> {item.square || 0} sqft</p>
                                                </li>
                                            </ul>
                                            <div className="border-top border-dashed mt-3 pt-3 d-flex align-items-center justify-content-between gap-3">
                                                <h5 className="mb-0">${item.price || 0}</h5>
                                                <Link to="/properties" className="link-effect">Read More
                                                    <i className="bi bi-chevron-right align-baseline ms-1"></i>
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
                <PaginationFile
                    className="mb-4"
                    currentpages={currentpages}
                    pagination={pagination}
                    perPageData={perPageData}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlenextPage={handlenextPage}
                    handleClick={handleClick}
                    handleprevPage={handleprevPage}
                    estateList={data} />
            </div>

            {/* Edit Property Modal */}
            <Modal show={editProperty} onHide={handleEditClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <Form.Label htmlFor="property-title-input">Property Title</Form.Label>
                            <Form.Control
                                type="text"
                                id="property-title-input"
                                name="title"
                                placeholder="Enter property title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.title}
                            />
                            {formik.errors.title && formik.touched.title ? (
                                <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <Form.Label htmlFor="property-type-input">Type</Form.Label>
                            <Form.Control
                                type="text"
                                id="property-type-input"
                                name="type"
                                placeholder="Enter property type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.type}
                            />
                            {formik.errors.type && formik.touched.type ? (
                                <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="bedroom-input">Bedroom</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bedroom-input"
                                        name="bedroom"
                                        placeholder="Enter bedroom"
                                        value={formik.values.bedroom}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.bedroom}
                                    />
                                    {formik.errors.bedroom && formik.touched.bedroom ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.bedroom}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="bathroom-input">Bathroom</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bathroom-input"
                                        name="bathroom"
                                        placeholder="Enter bathroom"
                                        value={formik.values.bathroom}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.bathroom}
                                    />
                                    {formik.errors.bathroom && formik.touched.bathroom ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.bathroom}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="area-input">Area (sqft)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="area-input"
                                        name="area"
                                        placeholder="Enter area"
                                        value={formik.values.area}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.area}
                                    />
                                    {formik.errors.area && formik.touched.area ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.area}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="price-input">Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="price-input"
                                        name="price"
                                        placeholder="Enter price"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.price}
                                    />
                                    {formik.errors.price && formik.touched.price ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-3">
                            <Form.Label htmlFor="location-input">Location</Form.Label>
                            <Form.Control
                                type="text"
                                id="location-input"
                                name="location"
                                placeholder="Enter location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.location}
                            />
                            {formik.errors.location && formik.touched.location ? (
                                <Form.Control.Feedback type="invalid">{formik.errors.location}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleEditClose}>Close</Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDelete} onHide={handleDeleteClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">Are you sure you want to delete this property?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleDeleteClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

export default GridProperty;
