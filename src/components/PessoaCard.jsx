import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-grid-system';
import {
  Card, H5, Button, Pre, Collapse, Intent, Icon, Colors,
} from '@blueprintjs/core';

import './PessoaCard.css';

import PessoaCardTable from './PessoaCardTable';

function PessoaCard(props) {
  const { nome, cpf } = props;

  const [showTable, setShowTable] = useState(false);

  const [arrowClass, setArrowClass] = useState('');

  const handleClick = () => {
    setShowTable(!showTable);

    if (arrowClass === '' || arrowClass === 'arrow-down') {
      setArrowClass('arrow-up');
    } else {
      setArrowClass('arrow-down');
    }
  };

  return (
    <Card style={{
      backgroundColor: Colors.DARK_GRAY5,
      padding: 3,
      marginBottom: 9,
      marginTop: 1,
    }}
    >
      <Container fluid>
        <Row align="center">
          <Col xs={11}>
            <H5 style={{ marginBottom: 0 }}>
              {nome}
            </H5>
          </Col>
          <Col>
            <Button onClick={handleClick} minimal intent={Intent.PRIMARY}>
              <Icon icon="caret-down" className={arrowClass} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Collapse isOpen={showTable}>
              <Pre>
                <PessoaCardTable cpf={cpf} />
              </Pre>
            </Collapse>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

PessoaCard.propTypes = {
  nome: PropTypes.string.isRequired,
  cpf: PropTypes.string.isRequired,
};


export default PessoaCard;
