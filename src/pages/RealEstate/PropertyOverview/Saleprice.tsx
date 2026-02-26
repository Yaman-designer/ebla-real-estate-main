import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { RealEstateProperty } from 'helpers/espocrm/types';

interface SalepriceProps {
  property: RealEstateProperty | null;
}

const Saleprice = ({ property }: SalepriceProps) => {
  if (!property) return null;

  return (
    <React.Fragment>
      <Col lg={12} className="col-lg-12">
        <Card className="card-primary text-center">
          <Card.Body>
            <h4 className="text-reset fw-normal">{property.priceCurrency} {property.price}</h4>
            <p className="text-white-75 fs-md mb-0">Sale Price</p>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Saleprice;
