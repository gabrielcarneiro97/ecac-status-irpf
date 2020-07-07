import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import ConsultaIndividualForm from './ConsultaIndividualForm';
import PageDivider from './PageDivider';
import ConsultaXLS from './ConsultaXLS';
import ConsultaStatus from './ConsultaStatus';

function ConsultaPage() {
  return (
    <>
      <ConsultaStatus />
      <Container fluid>
        <Row>
          <Col>
            <ConsultaIndividualForm />
          </Col>
        </Row>
        <PageDivider />
        <Row>
          <Col>
            <ConsultaXLS />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ConsultaPage;
