import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { HTMLTable, Classes } from '@blueprintjs/core';

const moc = [
  {
    id: 1,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Falha no Acesso',
  },
  {
    id: 2,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Processada',
  },
  {
    id: 3,
    ano: '2020',
    dataHora: +new Date(),
    status: 'Malha Fina',
  },
];

function PessoaCardTable(props) {
  const { cpf } = props;

  const [tbody, setTbody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(cpf);
    setTimeout(() => {
      const data = moc;
      setLoading(false);
      setTbody(
        <tbody>
          {data.map((consulta) => (
            <tr key={consulta.id}>
              <td>{consulta.ano}</td>
              <td>{consulta.status}</td>
              <td>{moment(consulta.dataHora).format('DD/MM/YYYY HH:mm')}</td>
            </tr>
          ))}
        </tbody>,
      );
    }, 1000);
  }, []);

  return (
    <HTMLTable striped style={{ width: '100%' }} className={loading ? Classes.SKELETON : ''}>
      <thead>
        <tr>
          <th>Ano</th>
          <th>Status</th>
          <th>Data da Consulta</th>
        </tr>
      </thead>
      {tbody}
    </HTMLTable>
  );
}


PessoaCardTable.propTypes = {
  cpf: PropTypes.string.isRequired,
};

export default PessoaCardTable;
