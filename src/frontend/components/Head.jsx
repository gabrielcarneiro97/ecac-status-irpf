import React from 'react';

import { Col, Row } from 'antd';

const { version } = require('../../../package.json');

function Head() {
  return (
    <Row
      type="flex"
      justify="start"
      align="middle"
    >
      <Col>
        <h3
          style={{
            color: 'white',
          }}
        >
          Consulta eCAC&nbsp;
          {version}
        </h3>
      </Col>
    </Row>
  );
}

export default Head;
