import React, { useEffect } from 'react';
import Breadcrumb from 'Common/BreadCrumb';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import Overview from './Overview';
import Saleprice from './Saleprice';
import AgentDetails from './AgentDetails';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRealEstateProperty } from 'slices/realestate/thunk';
import { createSelector } from 'reselect';

const PropertyOverview = () => {

  document.title = "Property OverView | Steex - Admin & Dashboard Template";
  const { id } = useParams();
  const dispatch = useDispatch<any>();

  const selectRealEstate = createSelector(
    (state: any) => state.RealEstate,
    (realEstate) => ({
      realEstateProperty: realEstate.realEstateProperty,
      loading: realEstate.loading
    })
  );

  const { realEstateProperty, loading } = useSelector(selectRealEstate);

  useEffect(() => {
    if (id) {
      dispatch(getRealEstateProperty(id));
    }
  }, [dispatch, id]);

  if (loading || !realEstateProperty) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid >
          <Breadcrumb title="Property Overview" pageTitle="Real Estate" />
          <Row>
            <Col xl={9} lg={8}>
              <Overview property={realEstateProperty} />
            </Col>
            <Col xl={3} lg={4}>
              <Row>
                <Saleprice property={realEstateProperty} />
                <AgentDetails property={realEstateProperty} />
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PropertyOverview
