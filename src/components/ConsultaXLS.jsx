import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
  Button, H3, Intent, Checkbox,
} from '@blueprintjs/core';

import XLSX from 'xlsx';

import ImporatarXLS from './ImportarXLS';
import { planilhaModelo } from '../services/xlsx.service';

import AppToaster from '../services/toaster';

function ConsultaXLS() {
  const [planilhaData, setPlanilhaData] = useState([]);
  const [pdf, setPdf] = useState(false);

  useEffect(() => {
    console.log(planilhaData);
  }, [planilhaData]);

  const CONSULTA_QUERY = gql`
  query consultaMultipla($consultas: [ConsultaInput!]!, $pdf: Boolean) {
    consultaMultipla(consultas: $consultas, pdf: $pdf)
  }
`;

  const [consultar, { data }] = useLazyQuery(CONSULTA_QUERY);

  useEffect(() => {
    if (data?.consultaUnica === true) {
      AppToaster.show({
        message: 'Consulta iniciada',
        intent: Intent.SUCCESS,
      });
    }
  }, [data]);

  const handleClick = () => {
    consultar({
      variables: {
        consultas: planilhaData.map(({ ano, ...pessoa }) => ({ pessoa, ano: ano.toString() })),
        pdf,
      },
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <H3>Consulta por Arquivo</H3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => {
            const wb = planilhaModelo();
            XLSX.writeFile(wb, 'importacao.xlsx');
          }}
          >
            Baixar Arquivo Modelo
          </Button>
        </Col>
        <Col>
          <ImporatarXLS onData={setPlanilhaData} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Checkbox
            label="Salvar Extrato"
            id="check-pdf"
            checked={pdf}
            onChange={() => setPdf(!pdf)}
          />
        </Col>
        <Col>
          <Button
            onClick={handleClick}
            disabled={planilhaData.length === 0}
          >
            Consultar
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ConsultaXLS;
