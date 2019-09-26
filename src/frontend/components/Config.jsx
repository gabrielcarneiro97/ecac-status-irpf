import React from 'react';
import {
  Row,
  Col,
  Divider,
} from 'antd';

import CheckRFBStatus from './CheckRFBStatus';

function Config() {
  return (
    <>
      <Row>
        <Col>
          <Divider orientation="left">Teste de Conexão Receita Federal</Divider>
        </Col>
        <Col>
          <CheckRFBStatus />
        </Col>
      </Row>
    </>
  );
}

export default Config;
