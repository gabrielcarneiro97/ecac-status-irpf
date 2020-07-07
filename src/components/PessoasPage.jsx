import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import './PessoaCard.css';
import { InputGroup, Spinner } from '@blueprintjs/core';
import PessoaCard from './PessoaCard';

function PessoasPage() {
  const [filterInput, setFilterInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const QUERY_PESSOAS = gql`
    query {
      pessoas {
        cpf, nome
      }
    }
  `;

  const { loading, data } = useQuery(QUERY_PESSOAS);

  useEffect(() => {
    if (filterInput === '') {
      setFilteredData(data || []);
    }
    if (data) {
      setFilteredData(
        data.pessoas.filter((el) => el.nome.toUpperCase().includes(filterInput.toUpperCase())),
      );
    }
  }, [filterInput]);

  useEffect(() => {
    if (!loading && data) setFilteredData(data.pessoas);
  }, [loading, data]);

  return (
    <Container fluid style={{ overflow: 'auto', maxHeight: 500, minHeight: 300 }}>
      <Row style={{ marginBottom: 20, marginTop: 2 }}>
        <Col>
          <InputGroup
            id="pesquisar-input"
            placeholder="Pesquisar"
            value={filterInput}
            disabled={loading}
            onChange={(e) => setFilterInput(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ display: loading ? 'inherit' : 'none' }}>
            <Spinner size={Spinner.SIZE_LARGE} />
          </div>
          {filteredData.map((pessoa) => (
            <PessoaCard key={pessoa.cpf} nome={pessoa.nome} cpf={pessoa.cpf} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default PessoasPage;
