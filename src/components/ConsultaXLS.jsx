import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
  Button, H3, Intent, Checkbox, H4, Classes,
} from '@blueprintjs/core';

import XLSX from 'xlsx';

import ImporatarXLS from './ImportarXLS';
import { planilhaModelo } from '../services/xlsx.service';

import AppToaster from '../services/toaster';

function ConsultaXLS() {
  const [planilhaData, setPlanilhaData] = useState([]);
  const [pdf, setPdf] = useState(false);

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
          <H4>
            Instruções de Uso:
          </H4>
          <ol className={Classes.LIST}>
            <li>Baixe a planilha modelo clicando no botão abaixo.</li>
            <li>
              Preencha a planilha de acordo com as colunas indicadas.
              ATENÇÃO: NÃO APAGAR A PRIMEIRA LINHA!
            </li>
            <li>
              Selecione o arquivo e clique no botão &quot;Consultar&quot;.
            </li>
          </ol>
        </Col>
      </Row>

      <Row style={{ marginBottom: 20 }}>
        <Col>
          <Button onClick={() => {
            const wb = planilhaModelo();
            XLSX.writeFile(wb, 'importacao.xlsx');
          }}
          >
            Baixar Arquivo Modelo
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={7}>
          <ImporatarXLS onData={setPlanilhaData} />
        </Col>
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
