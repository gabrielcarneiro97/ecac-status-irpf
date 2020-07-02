import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import ConsultaIndividualForm from './ConsultaIndividualForm';
import PageDivider from './PageDivider';

function ConsultaPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <ConsultaIndividualForm />
        </Col>
      </Row>
      <PageDivider />
    </Container>
  );
}

export default ConsultaPage;
