import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import moment from 'moment';

import { HTMLTable, Classes } from '@blueprintjs/core';

function PessoaCardTable(props) {
  const { cpf } = props;

  const GET_CONSULTAS = gql`
    query consultas($cpf: String!) {
      consultas(cpf: $cpf) {
        id, dataHora, status, ano
      }
    }
  `;

  const [consultas, setConsultas] = useState([]);

  const { loading, data } = useQuery(GET_CONSULTAS, {
    variables: { cpf },
  });

  useEffect(() => {
    if (data) {
      setConsultas(data.consultas || []);
    }
  }, [data]);

  return (
    <HTMLTable striped style={{ width: '100%' }} className={loading ? Classes.SKELETON : ''}>
      <thead>
        <tr>
          <th>Ano</th>
          <th>Status</th>
          <th>Data da Consulta</th>
        </tr>
      </thead>
      <tbody>
        {consultas.map((consulta) => (
          <tr key={consulta.id}>
            <td>{consulta.ano}</td>
            <td>{consulta.status}</td>
            <td>{moment(consulta.dataHora).format('DD/MM/YYYY HH:mm')}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}

PessoaCardTable.propTypes = {
  cpf: PropTypes.string.isRequired,
};

export default PessoaCardTable;
