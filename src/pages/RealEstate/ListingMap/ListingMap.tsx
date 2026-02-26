import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Dropdown, Modal, InputGroup, Spinner } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import BreadCrumb from "Common/BreadCrumb";
import { EcommerceMap } from "pages/Ecommerce/EcommerceMap";
import { DeleteModal } from "Common/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteRealestateListMap as onDeleteRealestateListMap, addRealEstateListMap as onAddRealEstateListMap, updateRealEstateListMap as onUpdateRealEstateListMap, getRealestateListMap as onGetRealestateListMap } from "slices/thunk";
import PaginationFile from "Common/PaginationFile";
import { ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import Dropzone from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";

const ListingMap = () => {
    document.title = "Listing Map | Steex - Admin & Dashboard Template";

    const dispatch = useDispatch<any>();

    const selectListMap = createSelector(
        (state: any) => state.RealEstate,
        (realEstate) => ({
            listmap: realEstate.listmap,
            totalRealEstateListMap: realEstate.totalRealEstateListMap,
            loading: realEstate.loading
        })
    );

    const { listmap, totalRealEstateListMap, loading } = useSelector(selectListMap);

    const [show, setShow] = useState(false);
    const [editProperty, setEditProperty] = useState(false);
    const [deleteProperty, setDeleteProperty] = useState(false);
    const [property, setProperty] = useState<any>();
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [selectfeils, setSelectfeils] = useState<any>([]);
    const perPageData = 5;
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize from URL or default
    const [minCost, setMinCost] = useState(Number(searchParams.get("minPrice")) || 0);
    const [maxCost, setMaxCost] = useState(Number(searchParams.get("maxPrice")) || 0);
    const [propertyType, setPropertyType] = useState(searchParams.get("type") || "all");

    const [bedroom, setBedroom] = useState(searchParams.get("bedroom") || "all");
    const [searchText, setSearchText] = useState(searchParams.get("search") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
    const [orderBy, setOrderBy] = useState<string>("createdAt");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const pagination: boolean = true;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchText.trim());
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchText]);

    useEffect(() => {
        const whereGroup = [];

        if (propertyType && propertyType !== 'all') {
            whereGroup.push({ type: 'equals', attribute: 'type', value: propertyType });
        }

        if (bedroom && bedroom !== 'all') {
            whereGroup.push({ type: 'equals', attribute: 'bedroomCount', value: parseInt(bedroom) });
        }

        if (minCost && maxCost) {
            whereGroup.push({ type: 'between', attribute: 'priceConverted', value: [minCost, maxCost] });
        } else if (minCost) {
            whereGroup.push({ type: 'greaterThan', attribute: 'priceConverted', value: minCost });
        } else if (maxCost) {
            whereGroup.push({ type: 'lessThan', attribute: 'priceConverted', value: maxCost });
        }

        dispatch(onGetRealestateListMap({
            page: currentPage,
            size: perPageData,
            whereGroup,
            textFilter: debouncedSearch || undefined,
            orderBy,
            order,
        }));
    }, [dispatch, currentPage, propertyType, bedroom, minCost, maxCost, debouncedSearch, orderBy, order]);

    const onUpdatePrice = (value: any) => {
        setMinCost(Number(value[0]));
        setMaxCost(Number(value[1]));
    };

    const onCommitPrice = (min: number, max: number) => {
        // State is already updated by onUpdatePrice, this is just to sync URL if needed
        // But we can let the useEffect handle it via setSearchParams?
        // Actually, better to sync URL here to trigger the filter.
        updateUrlParams({ minPrice: min > 0 ? min : null, maxPrice: max > 0 ? max : null });
    };

    const updateUrlParams = (params: any) => {
        const newParams = new URLSearchParams(searchParams);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== 'all') {
                newParams.set(key, params[key]);
            } else {
                newParams.delete(key);
            }
        });

        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setMinCost(0);
        setMaxCost(0);
        setPropertyType("all");
        setBedroom("all");
        setSearchText("");
        setSearchParams({});
    };

    //Add Property modal
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEditProperty(false);
        setProperty(null);
        setSelectfeils(null);
    };
    //Edit Property modal
    const handleShowEditProperty = (item: any) => {
        setEditProperty(true);
        handleShow();
        setProperty({
            id: item.id,
            img: item.img,
            type: item.type,
            title: item.title,
            bedroom: item.bedroom,
            bathroom: item.bathroom,
            area: item.area,
            price: item.price,
            location: item.location
        });
        setSelectfeils([item.img])
    };

    // delet Property modal
    const handleCloseDelete = () => setDeleteProperty(false);
    const handleShowDeleteProperty = (id: any) => {
        setDeleteProperty(true);
        setProperty(id)
    };
    const deleteModalFunction = () => {
        if (property) {
            dispatch(onDeleteRealestateListMap(property))
        }
        setDeleteProperty(false)
    }

    const handleClick = (e: any) => {
        setCurrentPage(Number(e.target.id));
    };

    const pageNumbers: any = [];
    if (totalRealEstateListMap) {
        for (let i = 1; i <= Math.ceil(totalRealEstateListMap / perPageData); i++) {
            pageNumbers.push(i);
        }
    }

    const handleprevPage = () => {
        let prevPage = currentPage - 1;
        setCurrentPage(prevPage);
    };
    const handlenextPage = () => {
        let nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    const handleAcceptfiles = (files: any) => {
        const newImages = files?.map((file: any) => {
            return Object.assign(file, {
                priview: URL.createObjectURL(file),
            })
        })
        setSelectfeils([...selectfeils, ...newImages]);
    }
    const formik: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            id: (property && property.id) || '',
            img: (property && property.img) || '',
            type: (property && property.type) || '',
            title: (property && property.title) || '',
            bedroom: (property && property.bedroom) || '',
            bathroom: (property && property.bathroom) || '',
            area: (property && property.area) || '',
            price: (property && property.price) || '',
            location: (property && property.location) || ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please Enter Your Property Title"),
            type: Yup.string().required("Please Enter Your Property Type"),
            bedroom: Yup.number().required("Please Enter Your Bedroom Number"),
            bathroom: Yup.number().required("Please Enter Your bathroom Size"),
            area: Yup.number().required("Please Enter Your sqft"),
            price: Yup.number().required("Please Enter Your Price"),
            location: Yup.string().required("Please Enter Your location"),
            img: Yup.mixed().required("Please Enter Your Image"),
        }),
        onSubmit: (values: any) => {
            if (editProperty) {
                const updateProperty = {
                    id: values.id,
                    img: values.img,
                    type: values.type,
                    title: values.title,
                    bedroom: values.bedroom,
                    bathroom: values.bathroom,
                    area: values.area,
                    price: values.price,
                    location: values.location
                }
                dispatch(onUpdateRealEstateListMap(updateProperty));
                formik.resetForm();
            } else {
                const newProperty = {
                    id: (Math.floor(Math.random() * (30 - 20)) + 20),
                    img: values['img'],
                    type: values['type'],
                    title: values['title'],
                    bedroom: values['bedroom'],
                    bathroom: values['bathroom'],
                    area: values['area'],
                    price: values['price'],
                    location: values['location']
                }
                dispatch(onAddRealEstateListMap(newProperty))
                formik.resetForm();
            }
            if (values === null) {
                handleShow()
            } else {
                handleClose()
            }
        }
    });

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Listing Map" pageTitle="Real Estate" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <Card.Body>
                                    <Row className="g-3">
                                        <Col sm={6} className="col-xl-3">
                                            <div className="search-box">
                                                <Form.Control
                                                    type="text"
                                                    className="search"
                                                    placeholder="Search products, price etc..."
                                                    value={searchText}
                                                    onChange={(e) => {
                                                        setSearchText(e.target.value);
                                                        // Optional: debounce this if needed, or just update URL on blur/enter
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            updateUrlParams({ search: searchText });
                                                        }
                                                    }}
                                                    onBlur={() => updateUrlParams({ search: searchText })}
                                                />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </Col>
                                        <Col sm={6} className="col-xl">
                                            <Form.Select
                                                className="form-control"
                                                id="idType"
                                                value={propertyType}
                                                onChange={(e) => {
                                                    setPropertyType(e.target.value);
                                                    updateUrlParams({ type: e.target.value });
                                                }}
                                            >
                                                <option value="all">Select All Type</option>
                                                <option value="apartment">apartment</option>
                                                <option value="detached">detached</option>
                                                <option value="plot">plot</option>
                                                <option value="maisonette">maisonette</option>
                                                <option value="store">store</option>
                                                <option value="studio">studio</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={6} className="col-xl">
                                            <Form.Select
                                                className="form-control"
                                                id="idBedroom"
                                                value={bedroom}
                                                onChange={(e) => {
                                                    setBedroom(e.target.value);
                                                    updateUrlParams({ bedroom: e.target.value });
                                                }}
                                            >
                                                <option value="all">Select All</option>
                                                <option value="1">1 Bedroom</option>
                                                <option value="2">2 Bedroom</option>
                                                <option value="3">3 Bedroom</option>
                                                <option value="4">4 Bedroom</option>
                                                <option value="5">5 Bedroom</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={6} className="col-xl">
                                            <Dropdown>
                                                <Dropdown.Toggle as="div" className="form-control d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }}>
                                                    {minCost > 0 || maxCost > 0 ? `$${minCost} - $${maxCost}` : "Select Price"} <i className="mdi mdi-chevron-down"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="p-3 w-100">
                                                    <div className="mb-3">
                                                        <Nouislider
                                                            range={{ min: 0, max: 25000000 }}
                                                            start={[minCost, maxCost]}
                                                            step={10000}
                                                            connect
                                                            onSlide={onUpdatePrice}
                                                            onSet={(values: any) => onCommitPrice(Number(values[0]), Number(values[1]))}
                                                        />
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <Form.Control
                                                            type="number"
                                                            value={minCost}
                                                            onChange={(e) => setMinCost(Number(e.target.value))}
                                                            onBlur={() => onCommitPrice(minCost, maxCost)}
                                                        />
                                                        <span className="align-self-center">to</span>
                                                        <Form.Control
                                                            type="number"
                                                            value={maxCost}
                                                            onChange={(e) => setMaxCost(Number(e.target.value))}
                                                            onBlur={() => onCommitPrice(minCost, maxCost)}
                                                        />
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                        <Col sm={6} className="col-xl">
                                            <Form.Select
                                                className="form-control"
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

                                        <Col sm={6} className="col-xl">
                                            {/* Date Filter Commented out as per request */}
                                            {/* <div>
                                                <Flatpickr
                                                    className="form-control"
                                                    id="demo-datepicker"
                                                    placeholder="Select date"
                                                    options={{
                                                        mode: "range",
                                                        dateFormat: 'd M, Y',
                                                    }}
                                                />
                                            </div> */}
                                            <Button variant="danger" className="w-100" onClick={clearFilters}>
                                                <i className="mdi mdi-close-circle me-1 align-middle"></i> Clear Filters
                                            </Button>
                                        </Col>

                                        <Col sm={6} className="col-xl">
                                            <Button variant="primary" className="w-100" onClick={handleShow}>Add Property</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Card>
                        <Card.Body className="p-0">
                            <Row className="g-0">
                                <Col xl={5} className="position-relative">
                                    {loading && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 10 }}>
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    )}
                                    <Card.Header>
                                        <div className="d-flex align-items-center flex-wrap gap-2 text-muted">
                                            <b>{totalRealEstateListMap}</b> items
                                            {propertyType !== 'all' && (
                                                <>
                                                    <span>in</span>
                                                    <Badge bg="danger-subtle" text="danger">{propertyType}</Badge>
                                                </>
                                            )}
                                            {(minCost > 0 || maxCost > 0) && (
                                                <>
                                                    <div className="vr"></div>
                                                    <span className="badge border text-reset">
                                                        {minCost > 0 ? `$${minCost}` : '$0'} - {maxCost > 0 ? `$${maxCost}` : 'No Limit'}
                                                    </span>
                                                </>
                                            )}
                                            {bedroom !== 'all' && (
                                                <>
                                                    <div className="vr"></div>
                                                    <span className="badge border text-reset">{bedroom} Bedroom</span>
                                                </>
                                            )}
                                        </div>
                                    </Card.Header>

                                    {
                                        (listmap || [])?.map((item: any) => {
                                            return (
                                                <Card.Body className="border-bottom" key={item.id}>
                                                    <Row className="gy-3">
                                                        <Col lg={5}>
                                                            <div className="position-relative" key={`${item.id}-${currentPage}`}>
                                                                {(item.mainImageId || item.imagesIds?.[0]) ? (
                                                                    <React.Fragment>
                                                                        <img
                                                                            src={item.mainImageId ? `${process.env.REACT_APP_ESPOCRM_URL}/?entryPoint=WebAsset&id=${item.mainImageId}&size=medium` : `${process.env.REACT_APP_ESPOCRM_URL}/?entryPoint=WebAsset&id=${item.imagesIds[0]}&size=medium`}
                                                                            alt={item.mainImageName || item.title || "Property Image"}
                                                                            className="img-fluid rounded mx-auto"
                                                                            style={{ width: 259, height: 159, objectFit: "cover", display: "block" }}
                                                                            onError={(e: any) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                                const output = e.currentTarget.nextElementSibling;
                                                                                if (output) output.style.display = 'flex';
                                                                            }}
                                                                        />
                                                                        <div className="bg-light rounded w-100 align-items-center justify-content-center" style={{ width: 259, height: 159, display: "none" }}>
                                                                            <i className="bi bi-image fs-1 text-muted"></i>
                                                                        </div>
                                                                    </React.Fragment>
                                                                ) : (
                                                                    <div className="bg-light rounded w-100 d-flex align-items-center justify-content-center" style={{ width: 259, height: 159 }}>
                                                                        <i className="bi bi-image fs-1 text-muted"></i>
                                                                    </div>
                                                                )}
                                                                <div className="position-absolute bottom-0 start-0 m-2">
                                                                    {
                                                                        item.type === "apartment" ?
                                                                            <Badge bg="white" className="text-danger fs-xxs"><i className="bi bi-house-door align-baseline me-1"></i> {item.type}</Badge>
                                                                            :
                                                                            item.type === "store" ?
                                                                                <Badge bg="white" className="text-success fs-xxs"><i className="bi bi-house-door align-baseline me-1"></i> {item.type}</Badge>
                                                                                :
                                                                                <Badge bg="white" className="text-info fs-xxs"><i className="bi bi-house-door align-baseline me-1"></i> {item.type || 'Property'}</Badge>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col lg={7}>
                                                            <div className="d-flex flex-column h-100">
                                                                <div>
                                                                    <Dropdown className="float-end">
                                                                        <Dropdown.Toggle bsPrefix="btn-light btn btn-icon btn-sm" type="button">
                                                                            <i className="bi bi-three-dots-vertical"></i>
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu className="dropdown-menu-end">
                                                                            <Dropdown.Item href="#" onClick={() => handleShowEditProperty(item)}><i className="bi bi-pencil-square me-1 align-baseline"></i> Edit</Dropdown.Item>
                                                                            <Dropdown.Item href="#" onClick={() => handleShowDeleteProperty(item.id)}><i className="bi bi-trash3 me-1 align-baseline"></i> Delete</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                    <h6 className="fs-lg text-capitalize text-truncate"><Link to="/properties" className="text-reset">{item.title || item.name}</Link></h6>
                                                                    <p className="text-muted"><i className="bi bi-geo-alt align-baseline me-1"></i> {item.addressCity || item.locationName || 'Unknown'}</p>
                                                                </div>
                                                                <ul className="d-flex align-items-center gap-2 flex-wrap list-unstyled">
                                                                    <li>
                                                                        <p className="text-muted mb-0"><i className="bi bi-house align-baseline text-primary me-1"></i> {item.bedroomCount || 0} Bedroom</p>
                                                                    </li>
                                                                    <li>
                                                                        <p className="text-muted mb-0"><i className="ph ph-bathtub align-middle text-primary me-1"></i> {item.bathroomCount || 0} Bathroom</p>
                                                                    </li>
                                                                    <li>
                                                                        <p className="text-muted mb-0"><i className="bi bi-columns align-baseline text-primary me-1"></i> {item.square || 0} sqft</p>
                                                                    </li>
                                                                </ul>
                                                                <div className="border-top border-dashed mt-auto pt-3 d-flex align-items-center justify-content-between gap-3">
                                                                    <h5 className="mb-0"> ${item.price || 0}</h5>
                                                                    <Link to="/properties" className="link-effect">Read More <i className="bi bi-chevron-right align-baseline ms-1"></i></Link>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            )
                                        })
                                    }
                                    <Card.Body>
                                        <PaginationFile
                                            className="mt-0"
                                            currentpages={listmap}
                                            pagination={pagination}
                                            perPageData={perPageData}
                                            currentPage={currentPage}
                                            pageNumbers={pageNumbers}
                                            handlenextPage={handlenextPage}
                                            handleClick={handleClick}
                                            handleprevPage={handleprevPage}
                                            estateList={listmap}
                                            totalCount={totalRealEstateListMap}
                                        />
                                    </Card.Body>

                                </Col>
                                <Col xl={7}>
                                    <div id="leaflet-map-group-control" className="leaflet-map leaflet-gray" style={{ minHeight: "100%", position: "relative" }} >
                                        <EcommerceMap
                                            key={`map-${currentPage}-${listmap?.length}`}
                                            style={{ minHeight: "100%", position: "relative" }}
                                            data={listmap}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5" id="exampleModalLabel">{editProperty ? "Edit Property" : "Add Property"}</Modal.Title>
                </Modal.Header>
                <Form className="tablelist-form" autoComplete="off" onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <div className="mb-3">
                            <Form.Label htmlFor="product-title-input">Product title</Form.Label>
                            <Dropzone
                                onDrop={(acceptfiles: any) => {
                                    handleAcceptfiles(acceptfiles);
                                    formik.setFieldValue("img", acceptfiles[0]);
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

                            <ul className="list-unstyled mb-0" id="dropzone-preview">
                                {
                                    (selectfeils || [])?.map((file: any, index: number) => {
                                        return (
                                            <li className="mt-2 dz-image-preview" key="">
                                                <div className="border rounded">
                                                    <div className="d-flex flex-wrap gap-2 p-2">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar-sm bg-light rounded p-2">
                                                                <img data-dz-thumbnail="" className="img-fluid rounded d-block" src={file.priview} alt={file.name} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="pt-1">
                                                                <h5 className="fs-md mb-1" data-dz-name>{file.path}</h5>
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
                            {formik.errors.img && formik.touched.img ? (
                                <Form.Control.Feedback type="invalid" className="d-block">{formik.errors.img}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <Form.Label htmlFor="Property-title-input" >Property title<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                id="Property-title-input"
                                name="title"
                                placeholder=" Enter Property title"
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
                            <Form.Label htmlFor="Property-type-input">Property Type<span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                className="form-control"
                                id="Property-type-input"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.type}
                            >
                                <option>Select Property Type</option>
                                <option>apartment</option>
                                <option>detached</option>
                                <option>plot</option>
                                <option>maisonette</option>
                                <option>store</option>
                                <option>studio</option>
                            </Form.Select>
                            {formik.errors.type && formik.touched.type ? (
                                <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
                            ) : null}
                        </div>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="bedroom-input">Bedroom<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bedroom-input"
                                        name="bedroom"
                                        placeholder="Enter Bedroom"
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
                                    <Form.Label htmlFor="bathroom-input">Bathroom<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="bathroom-input"
                                        name="bathroom"
                                        placeholder="Enter Bathroom"
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
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="sqft-input">SQFT<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        id="sqft-input"
                                        name="area"
                                        placeholder="Enter sqft"
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
                                    <Form.Label htmlFor="Property-price-input">Price<span className="text-danger">*</span></Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="Property-price-input"
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
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div className="mb-3">
                                    <Form.Label htmlFor="addressLine">Sort Address<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        id="addressLine"
                                        name="location"
                                        rows={3}
                                        placeholder="Enter sort address"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={!!formik.errors.location}
                                    />
                                    {formik.errors.location && formik.touched.location ? (
                                        <Form.Control.Feedback type="invalid">{formik.errors.location}</Form.Control.Feedback>
                                    ) : null}
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="hstack gap-2 justify-content-end">
                            <Button className="btn btn-ghost-danger" onClick={handleClose}>
                                <i className="bi bi-x-lg align-baseline me-1"></i> Close
                            </Button>
                            <Button variant="primary" id="add-btn" type="submit"> {editProperty ? "Edit Property" : "Add Property"} </Button>
                        </div>
                    </Modal.Footer>
                </Form>

            </Modal>

            <DeleteModal show={deleteProperty} handleClose={handleCloseDelete} deleteModalFunction={deleteModalFunction} />
            <ToastContainer />
        </React.Fragment >
    );
};

export default ListingMap;
