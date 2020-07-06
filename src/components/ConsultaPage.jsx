import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import ConsultaIndividualForm from './ConsultaIndividualForm';
import PageDivider from './PageDivider';
import ConsultaCSV from './ConsultaCSV';

function ConsultaPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <ConsultaIndividualForm />
        </Col>
      </Row>
      <PageDivider />
      <Row>
        <Col>
          <ConsultaCSV />
        </Col>
      </Row>
    </Container>
  );
}

export default ConsultaPage;
