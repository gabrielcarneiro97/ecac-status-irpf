import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import './PessoaCard.css';
import { InputGroup } from '@blueprintjs/core';
import PessoaCard from './PessoaCard';

const moc = [
  {
    nome: 'Gabriel Carneiro de Castro',
    cpf: '09392070608',
  },
  {
    nome: 'Andrea Arantes Carneiro de Castro',
    cpf: '63922355668',
  },
];

function PessoasPage() {
  const [filterInput, setFilterInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const data = moc;

    if (filterInput === '') {
      return setFilteredData(data);
    }

    return setFilteredData(
      data.filter((el) => el.nome.toUpperCase().includes(filterInput.toUpperCase())),
    );
  }, [filterInput]);

  return (
    <Container fluid style={{ overflow: 'auto', maxHeight: 500 }}>
      <Row style={{ marginBottom: 20, marginTop: 2 }}>
        <Col>
          <InputGroup
            id="pesquisar-input"
            placeholder="Pesquisar"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          {filteredData.map((pessoa) => (
            <PessoaCard key={pessoa.cpf} nome={pessoa.nome} cpf={pessoa.cpf} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default PessoasPage;
