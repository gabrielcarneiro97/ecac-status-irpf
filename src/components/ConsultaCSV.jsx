import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import { Button } from '@blueprintjs/core';

import XLSX from 'xlsx';

import ImporatarCSV from './ImportarCSV';

function ConsultaCSV() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Button onClick={() => {
            const wb = XLSX.utils.book_new();
            const sheet = XLSX.utils.aoa_to_sheet([['nome', 'cpf', 'codigoAcesso', 'senha', 'ano']]);
            XLSX.utils.book_append_sheet(wb, sheet, 'Plan1');
            XLSX.writeFile(wb, 'importacao.xlsx');
          }}
          >
            Baixar arquivo Modelo
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ImporatarCSV />
        </Col>
      </Row>
    </Container>
  );
}

export default ConsultaCSV;
