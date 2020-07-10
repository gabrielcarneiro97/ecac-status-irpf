import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import RealatorioTodasConsultas from './RelatorioTodasConsultas';
import RelatorioUltimaConsulta from './RelatorioUltimaConsulta';

function RelatoriosPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <RealatorioTodasConsultas />
        </Col>
      </Row>
      <Row>
        <Col>
          <RelatorioUltimaConsulta />
        </Col>
      </Row>
    </Container>
  );
}

export default RelatoriosPage;
