/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import {
  Col,
  Row,
  Icon,
} from 'antd';

const { shell } = window.require('electron');

const openGit = () => shell.openExternal('https://github.com/gabrielcarneiro97/ecac-status-irpf');

function Foot() {
  return (
    <Row
      type="flex"
      justify="end"
      align="middle"
      style={{
        fontSize: '10px',
      }}
    >
      <Col>
        Created by Gabriel Carneiro. Open Source Project.&nbsp;
        <a
          href="#"
          onClick={openGit}
        >
          Fork Me on GitHub&nbsp;
          <Icon type="github" />
        </a>
        .
      </Col>
    </Row>
  );
}

export default Foot;
