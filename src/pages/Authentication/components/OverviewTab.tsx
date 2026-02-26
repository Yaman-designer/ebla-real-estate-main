import React, { useEffect, useState } from "react";
import { Card, Col, Row, Nav, Tab } from "react-bootstrap";
import GridProperty from "./GridProperty";
import { Link } from "react-router-dom";
import { getAgentProperties, getWebAssetUrl } from "../../../helpers/espocrm/propertyService";
import { RealEstateProperty } from "../../../helpers/espocrm/types";

interface OverviewTabProps {
    agentId: string;
}

const OverviewTab = ({ agentId }: OverviewTabProps) => {
    const [properties, setProperties] = useState<RealEstateProperty[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProperties = () => {
        if (agentId) {
            setLoading(true);
            getAgentProperties(agentId)
                .then(response => {
                    setProperties(response.list);
                })
                .catch(err => {
                    console.error("Failed to fetch properties", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [agentId]);

    // Helper to extract numeric/string values safely if they exist, or default
    const getValue = (val: any) => val || 0;
    const getText = (val: any) => val || 'N/A';

    return (
        <React.Fragment>
            <Tab.Container defaultActiveKey="pills-home">
                <Row className="justify-content-between align-items-center mb-4">
                    <Col sx={4}>
                        <Card.Title as="h5" className="mb-0">Active Listing</Card.Title>
                    </Col>
                    <Col className="col-auto">
                        <Nav variant="pills" className="d-flex gap-2">
                            <Nav.Item>
                                <Nav.Link as="button" eventKey="pills-home" bsPrefix="btn btn-subtle-secondary btn-icon"><i className="bi bi-grid"></i></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as="button" eventKey="pills-profile" bsPrefix="btn btn-subtle-secondary btn-icon"><i className="bi bi-list-task"></i></Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Tab.Content>
                    <Tab.Pane eventKey="pills-home">
                        {loading ? <div>Loading...</div> : <GridProperty data={properties} onRefresh={fetchProperties} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="pills-profile">
                        <Row>
                            {
                                (properties || [])?.slice(0, 4)?.map((item: any) => {
                                    return (
                                        <Col lg={12} md={6} key={item.id}>
                                            <Card>
                                                <Card.Body>
                                                    <Row className="gy-3">
                                                        <Col xxl={2} lg={3}>
                                                            <div className="position-relative">
                                                                {item.mainImageId ? (
                                                                    <img
                                                                        src={getWebAssetUrl(item.mainImageId)}
                                                                        alt={item.mainImageName || "Property Image"}
                                                                        className="img-fluid rounded h-100 object-fit-cover"
                                                                        style={{ width: "100%", maxHeight: "100px" }}
                                                                    />
                                                                ) : (
                                                                    <div className="bg-light rounded h-100 d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                                                                        <i className="bi bi-image fs-1 text-muted"></i>
                                                                    </div>
                                                                )}
                                                                <div className="position-absolute bottom-0 start-0 m-2">
                                                                    <span className="badge bg-white text-danger fs-xxs"><i className="bi bi-house-door align-baseline me-1"></i> {item.status || item.type || 'Property'}</span>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col xxl={7} lg={6}>
                                                            <div className="d-flex flex-column h-100">
                                                                <div>
                                                                    <h6 className="fs-lg text-capitalize text-truncate"><a href="#!" className="text-reset">{item.name || item.title}</a></h6>
                                                                    <p className="text-muted"><i className="bi bi-geo-alt align-baseline me-1"></i> {getText(item.location)}</p>
                                                                </div>
                                                                <ul className="d-flex align-items-center gap-2 flex-wrap list-unstyled">
                                                                    <li>
                                                                        <p className="text-muted mb-0"><i className="bi bi-house align-baseline text-primary me-1"></i> {getValue(item.bedroom)} Bedroom</p>
                                                                    </li>
                                                                    <li>
                                                                        <p className="text-muted mb-0"><i className="ph ph-bathtub align-middle text-primary me-1"></i> {getValue(item.bathroom)} Bathroom</p>
                                                                    </li>
                                                                    <li>
                                                                        <p className="text-muted mb-0"><i className="bi bi-columns align-baseline text-primary me-1"></i> {getValue(item.area)} sqft</p>
                                                                    </li>
                                                                </ul>
                                                                <p className="text-muted mb-0">Agent: <b>{item.assignedUserName || 'Unknown'}</b></p>
                                                            </div>
                                                        </Col>
                                                        <Col lg={3}>
                                                            <div className="d-flex flex-lg-column justify-content-between justify-content-lg-start text-lg-end gap-3 h-100">
                                                                <h5 className="mb-0">${getValue(item.price)}</h5>
                                                                <div className="mt-auto">
                                                                    <a href="#!" className="link-effect">Read More <i className="bi bi-chevron-right align-baseline ms-1"></i></a>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        {/* {Pagination if needed} */}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </React.Fragment>
    );
}

export default OverviewTab;
