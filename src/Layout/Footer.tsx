import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
    const settings = localStorage.getItem("espoSettings") ? JSON.parse(localStorage.getItem("espoSettings")!) : {};
    const appName = settings.applicationName || "Newdeal";

    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            {new Date().getFullYear()} © {appName}.
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end d-none d-sm-block">
                                Powered by EblaSoft
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    )
}

export default Footer;