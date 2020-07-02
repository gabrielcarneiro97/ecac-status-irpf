import React from 'react';
import { Row, Col } from 'react-grid-system';

import { MenuDivider } from '@blueprintjs/core';

function PageDivider() {
  return (
    <Row style={{ marginTop: 25, marginBottom: 25 }}>
      <Col>
        <MenuDivider />
      </Col>
    </Row>
  );
}

export default PageDivider;
