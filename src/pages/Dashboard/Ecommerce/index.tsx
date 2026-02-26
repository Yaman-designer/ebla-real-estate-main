import React from 'react'
import Numeric from './numericChart';
import {PartnerChart, ResidentialChart} from './charts';
import {SystemUpdates } from './widgets';

import {Container, Row, Col} from "react-bootstrap";


const Dashboard = () => {

    document.title = "Dashboard | Newdeal Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                {/*<BreadCrumb title="Ecommerce" pageTitle="Dashboards" />*/}
                <Container fluid>
                    <Row>
                        <Col xl={2} md={4} sm={6}>
                            <Row>
                                <Col xl={6} md={6}> <Numeric
                                    reportURL={'Report/action/runList?id=693c5e69b9e00e28e&where%5B0%5D%5Btype%5D=in&where%5B0%5D%5Battribute%5D=category&where%5B0%5D%5Bvalue%5D%5B%5D=Residential&offset=0&maxSize=20'}
                                    name={'Οικιστικά ακίνητα'}
                                    icon={'ph-house-line'}/>
                                </Col>
                                <Col xl={6} md={6}> <Numeric
                                    reportURL={'Report/action/runList?id=693c5e69b9e00e28e&where%5B0%5D%5Btype%5D=in&where%5B0%5D%5Battribute%5D=category&where%5B0%5D%5Bvalue%5D%5B%5D=Commercial&offset=0&maxSize=20'}
                                    name={'Επαγγελματικοί χώροι'}
                                    icon={'ph-globe-hemisphere-west'}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={6} md={6}> <Numeric
                                    reportURL={'Report/action/runList?id=693c5e69b9e00e28e&where%5B0%5D%5Btype%5D=in&where%5B0%5D%5Battribute%5D=category&where%5B0%5D%5Bvalue%5D%5B%5D=Land&offset=0&maxSize=20'}
                                    name={'Οικόπεδα'}
                                    icon={'ph-globe-hemisphere-west'}/>
                                </Col>
                                <Col xl={6} md={6}> <Numeric
                                    reportURL={'Report/action/runList?id=690f318391079ee85&offset=0&maxSize=20'}
                                    name={'Τα ακίνητα μου'}
                                    icon={'ph-folder-user'}/>

                                </Col>
                            </Row>
                        </Col>
                        <Col xl={10} md={8} sm={6}>
                            <Col>
                                <ResidentialChart></ResidentialChart>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={3} md={4}>
                            <SystemUpdates></SystemUpdates>
                        </Col>
                        <Col xl={9} md={8}>
                            <PartnerChart></PartnerChart>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Dashboard;
