import React from 'react';
import { Container, Row, Col } from 'react-grid-system';

import './PessoaCard.css';
import PessoaCard from './PessoaCard';

function PessoasPage() {
  return (
    <Container fluid style={{ overflow: 'auto', maxHeight: 500 }}>
      <Row>
        <Col>
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
          <PessoaCard nome="Gabriel Carneiro de Castro" cpf="09392070608" />
        </Col>
      </Row>
    </Container>
  );
}

export default PessoasPage;
