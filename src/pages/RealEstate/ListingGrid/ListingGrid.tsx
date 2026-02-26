import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Badge, Card, Button, Modal, Form, InputGroup, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import GridFilters from "./GridFilters";
import GridProperty from "./gridProperty";
import BreadCrumb from "Common/BreadCrumb";
import Dropzone from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getRealEstateGridList as onGetRealEstateGridList, addRealEstateGridList as onAddRealEstateGridList } from "slices/realestate/thunk";
import { ToastContainer } from "react-toastify";
import { createSelector } from "reselect";

const ListingGrid = () => {
    document.title = "Listing Grid | Steex - Admin & Dashboard Template";

    const selectRealEstateGridList = createSelector(
        (state: any) => state.RealEstate,
        (realEstate) => ({
            realestateGridList: realEstate.realEstateGridList,
            totalRealEstateGridList: realEstate.totalRealEstateGridList,
            loading: realEstate.loading
        })
    );

    const { realestateGridList, totalRealEstateGridList, loading } = useSelector(selectRealEstateGridList);

    const dispatch = useDispatch<any>();
    const [listGrid, setListGrid] = useState<any>([]);
    const [showfilter, setShowfilter] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const perPageData = 8;
    const [searchText, setSearchText] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [orderBy, setOrderBy] = useState<string>("createdAt");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const location = useLocation();

    const [addProperty, setAddProperty] = useState<boolean>(false);

    // Add Property modal
    const handleShowProperty = () => setAddProperty(true);
    const handleCloseProperty = () => setAddProperty(false);

    // Initial filters from URL
    const getInitialFilters = () => {
        const searchParams = new URLSearchParams(location.search);
        const bedrooms = searchParams.getAll("bedroom");
        const bathrooms = searchParams.getAll("bathroom");
        const propertyTypes = searchParams.getAll("type");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        return { bedrooms, bathrooms, propertyTypes, minPrice, maxPrice };
    };

    const handlefileter = () => setShowfilter(!showfilter);
    const [selectfeils, setSelectfeils] = useState<any>([]);
    const [filters, setFilters] = useState<any>(getInitialFilters());

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchText.trim());
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchText]);

    useEffect(() => {
        const whereGroup: any[] = [];

        if (filters.bedrooms && filters.bedrooms.length > 0) {
            if (filters.bedrooms.length === 1) {
                whereGroup.push({ type: 'equals', attribute: 'bedroomCount', value: parseInt(filters.bedrooms[0]) });
            } else {
                whereGroup.push({ type: 'in', attribute: 'bedroomCount', value: filters.bedrooms.map((b: string) => parseInt(b)) });
            }
        }

        if (filters.bathrooms && filters.bathrooms.length > 0) {
            if (filters.bathrooms.length === 1) {
                whereGroup.push({ type: 'equals', attribute: 'bathroomCount', value: parseInt(filters.bathrooms[0]) });
            } else {
                whereGroup.push({ type: 'in', attribute: 'bathroomCount', value: filters.bathrooms.map((b: string) => parseInt(b)) });
            }
        }

        if (filters.propertyTypes && filters.propertyTypes.length > 0) {
            if (filters.propertyTypes.length === 1) {
                whereGroup.push({ type: 'equals', attribute: 'type', value: filters.propertyTypes[0] });
            } else {
                whereGroup.push({ type: 'in', attribute: 'type', value: filters.propertyTypes });
            }
        }

        // Price Filter Logic
        const minFn = filters.minPrice ? parseInt(filters.minPrice) : 0;
        const maxFn = filters.maxPrice ? parseInt(filters.maxPrice) : 0;

        if (minFn > 0 && maxFn > 0) {
            // Both exist -> between
            whereGroup.push({ type: 'between', attribute: 'priceConverted', value: [minFn, maxFn] });
        } else if (minFn > 0) {
            // From only -> greaterThan
            whereGroup.push({ type: 'greaterThan', attribute: 'priceConverted', value: minFn });
        } else if (maxFn > 0) {
            // To only -> lessThan
            whereGroup.push({ type: 'lessThan', attribute: 'priceConverted', value: maxFn });
        }

        dispatch(onGetRealEstateGridList({
            page: currentPage,
            size: perPageData,
            whereGroup,
            textFilter: debouncedSearch || undefined,
            orderBy,
            order,
        }));
    }, [dispatch, currentPage, filters, debouncedSearch, orderBy, order]);

    useEffect(() => {
        setListGrid(realestateGridList)
    }, [realestateGridList]);


    const handleAcceptfiles = (files: any) => {
        const newImages = files?.map((file: any) => {
            return Object.assign(file, {
                priview: URL.createObjectURL(file),
            })
        })
        setSelectfeils([...selectfeils, ...newImages]);
    }

    const formik: any = useFormik({
        initialValues: {
            title: '',
            type: '',
            bedroom: '',
            bathroom: '',
            area: '',
            price: '',
            location: '',
            // addressline: '',
            rating: '',
            img: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter Your  Title"),
            type: Yup.string().required("Please Enter Your  Type"),
            bedroom: Yup.string().required("Please Enter Your bedroom List"),
            bathroom: Yup.string().required("Please Enter Your bathroom List"),
            area: Yup.string().required("Please Enter Your area List"),
            price: Yup.number().required("Please Enter Your Price"),
            location: Yup.string().required("Please Enter Your location"),
            // addressline: Yup.string().required("Please Enter Your Address"),
            rating: Yup.string().required("Please Enter Your rat"),
            img: Yup.mixed().required("Please Enter Your Image"),
        }),
        onSubmit: (values: any) => {
            const newListGrid = {
                id: (Math.floor(Math.random() * (30 - 20)) + 20),
                title: values["title"],
                img: values["img"],
                type: values["type"],
                bedroom: values["bedroom"],
                bathroom: values["bathroom"],
                area: values["area"],
                price: values["price"],
                location: values["location"],
                // addressline: values["addressline"],
                rating: values["rating"]
            }
            dispatch(onAddRealEstateGridList(newListGrid))
            formik.resetForm();
            if (values === null) {
                handleShowProperty();
            } else {
                handleCloseProperty();
            }
        }
    });


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Listing Grid" pageTitle="Real Estate" />
                    <Row>
                        <GridFilters
                            showfilter={showfilter}
                            handlefileter={handlefileter}
                            onFilterChange={handleFilterChange}
                            setListGrid={setListGrid} // Deprecated but accepted by prop interface
                        />
                        <div className="col-lg position-relative">
                            {loading && (
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 10 }}>
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            )}
                            <Card>
                                <Card.Body>
                                    <Row className="align-items-center gy-3">
                                        <Col lg={3}>
                                            <Card.Title as="h6" className="mb-0">Property{" "}
                                                <Badge bg="secondary-subtle" text="secondary" className="align-baseline ms-1">{totalRealEstateGridList}</Badge>
                                            </Card.Title>
                                        </Col>
                                        <Col xl={3} lg={4} sm={6} className="ms-auto">
                                            <div className="search-box">
                                                <Form.Control
                                                    type="text"
                                                    className="search"
                                                    placeholder="Search properties..."
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </Col>
                                        <Col xl={2} lg={3} sm={6}>
                                            <Form.Select
                                                value={`${orderBy}:${order}`}
                                                onChange={(e) => {
                                                    const [nextOrderBy, nextOrder] = e.target.value.split(":");
                                                    setOrderBy(nextOrderBy);
                                                    setOrder((nextOrder as "asc" | "desc") || "desc");
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value="createdAt:desc">Newest</option>
                                                <option value="createdAt:asc">Oldest</option>
                                                <option value="price:asc">Price Low to High</option>
                                                <option value="price:desc">Price High to Low</option>
                                            </Form.Select>
                                        </Col>
                                        <div className="col-sm-auto d-flex gap-1">
                                            <Button variant="secondary" onClick={handleShowProperty}><i className="bi bi-house align-baseline me-1"></i> Add Property</Button>
                                            <Button variant="primary" className="myButton" onClick={handlefileter}><i className="bi bi-funnel align-baseline me-1"></i> Filter</Button>
                                        </div>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <GridProperty
                                data={listGrid}
                                totalCount={totalRealEstateGridList}
                                currentPage={currentPage}
                                perPageData={perPageData}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </Row>
                </Container>
            </div>

            <Modal show={addProperty} onHide={handleCloseProperty} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title as="h5" id="addPropertyModalLabel">Add Property list</Modal.Title>
                </Modal.Header>
                <Form onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <div className="mb-3">
                            <Form.Label>Property Images<span className="text-danger">*</span></Form.Label>
                            <Dropzone
                                onDrop={(acceptfiles: any) => {
                                    handleAcceptfiles(acceptfiles);
                                    formik.setFieldValue("img", acceptfiles[0])
                                }}
                            >
                                {({ getRootProps }: any) => (
                                    <div className="dropzone property-dropzone border border-1 border-dashed text-center dz-clickable" style={{ minHeight: "100px" }}>
                                        <div
                                            className="dz-message needsclick"
                                            {...getRootProps()}
                                        >
                                            <div className="mb-3">
                                                <i className="bi bi-cloud-download fs-1" />
                                            </div>
                                            <h5>Drop files here or click to upload.</h5>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>
                            {formik.errors.img && formik.touched.img ? (
                                <Form.Control.Feedback type="invalid" className="d-block">{formik.errors.img}</Form.Control.Feedback>
                            ) : null}

                            <ul className="list-unstyled mb-0" id="dropzone-preview">
                                {
                                    (selectfeils || [])?.map((file: any, index: number) => {
                                        return (
                                            <li className="mt-2 dz-image-preview" key="">
                                                <div className="border rounded">
                                                    <div className="d-flex flex-wrap gap-2 p-2">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-sm bg-light rounded p-2">
                                                                <img data-dz-thumbnail="" className="img-fluid rounded d-block" src={file?.priview} alt={file?.name || ''} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="pt-1">
                                                                <h5 className="fs-md mb-1" data-dz-name>{file?.path || ''}</h5>
                                                                <p className="fs-sm text-muted mb-0" data-dz-size=""><strong>{file?.size?.toString()?.charAt(0)}</strong> KB</p>
                                                                <strong className="error text-danger" data-dz-errormessage></strong>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0 ms-3">
                                                            <Button variant="danger" size="sm" onClick={() => {
                                                                const newImages = [...selectfeils];
                                                                newImages.splice(index, 1);
                                                                setSelectfeils(newImages);
                                                            }}>Delete</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="mb-3">
                            <Form.Label htmlFor="property-title-input">Property title<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter Property title"
                                value={formik.values.title || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.title}
                            />
                            {formik.errors.title && formik.touched.title ? (
                                <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <Form.Label htmlFor="property-type-input">Property Type<span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                className="form-select"
                                id="property-type-input"
                                name="type"
                                value={formik.values.type || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.type}
                            >
                                <option value="">Select Property Type</option>
                                <option value="Villa">Villa</option>
                                <option value="Residency">Residency</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Others">Other</option>
                            </Form.Select>
                            {formik.errors.type && formik.touched.type ? (
                                <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <Row>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="bedroom-input">bedroom<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bedroom"
                                        name="bedroom"
                                        placeholder="Enter bedroom"
                                        value={formik.values.bedroom || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.bedroom}
                                    />
                                    {formik.errors.bedroom && formik.touched.bedroom ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.bedroom}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="bathroom-input">bathroom<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bathroom"
                                        name="bathroom"
                                        placeholder="Enter bathroom"
                                        value={formik.values.bathroom || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.bathroom}
                                    />
                                    {formik.errors.bathroom && formik.touched.bathroom ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.bathroom}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="area-input">SQFT<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="area"
                                        name="area"
                                        placeholder="Enter area"
                                        value={formik.values.area || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.area}
                                    />
                                    {formik.errors.area && formik.touched.area ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.area}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="property-price-input">Price<span className="text-danger">*</span></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="price"
                                            name="price"
                                            placeholder="Enter price"
                                            value={formik.values.price || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            isInvalid={!!formik.errors.price}
                                        />
                                        {formik.errors.price && formik.touched.price ? (
                                            <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
                                        ) : null}
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="property-location-input">location<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="property-location-input"
                                        name="location"
                                        placeholder="Enter location "
                                        value={formik.values.location || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.location}
                                    />
                                    {formik.errors.location && formik.touched.location ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.location}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="property-rating-input">Rating<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="property-rating-input"
                                        name="rating"
                                        placeholder="Enter Rating"
                                        value={formik.values.rating || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.rating}
                                    />
                                    {formik.errors.rating && formik.touched.rating ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.rating}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                            {/* <Col lg={12}>
                            <div className="mb-3">
                                <Form.Label htmlFor="addressLine-input">Sort Address<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    id="addressline"
                                    name="addressline"
                                    rows={3}
                                    placeholder="Enter sort address"
                                    value={formik.values.addressline || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={!!formik.errors.addressline}
                                />
                                {formik.errors.addressline && formik.touched.addressline ? (
                                    <Form.Control.Feedback type="invalid">{formik.errors.addressline}</Form.Control.Feedback>
                                ) : null}
                            </div>
                        </Col> */}
                        </Row>


                    </Modal.Body>
                    <Modal.Footer>
                        <div className="hstack gap-2 justify-content-end">
                            <Button className="btn btn-ghost-danger" onClick={handleCloseProperty}> <i className="bi bi-x-lg align-baseline me-1"></i> Close </Button>
                            <Button variant="primary" type="submit" id="add-btn"> Add Property </Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal >
            <ToastContainer />
        </React.Fragment>
    );
};

export default ListingGrid;
