import React from 'react';

import { Col, Row } from 'antd';

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
          Consulta eCAC
        </h3>
      </Col>
    </Row>
  );
}

export default Head;
