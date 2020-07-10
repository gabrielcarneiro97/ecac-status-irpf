import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import gql from 'graphql-tag';

import XLSX from 'xlsx';
import moment from 'moment';

import { Button } from '@blueprintjs/core';
import { objsToXlsx } from '../services/xlsx.service';

export default function RelatorioUltimaConsulta() {
  const QUERY = gql`
    query {
      pessoas {
        cpf, nome, ultimaConsulta { ano, status, dataHora }
      }
    }
  `;

  const [pegarDados, { called, loading, data }] = useLazyQuery(QUERY);

  useEffect(() => {
    if (called && !loading && data) {
      const { pessoas } = data;
      const res = pessoas.map((pessoa) => ({
        cpf: pessoa.cpf,
        nome: pessoa.nome,
        ...pessoa.ultimaConsulta,
        dataHora: moment(pessoa.ultimaConsulta.dataHora).format('DD/MM/YYYY HH:mm'),
      }));

      const wb = objsToXlsx(res, 'ultimaConsulta.xlsx');

      XLSX.writeFile(wb, 'ultimaConsulta.xlsx');
    }
  }, [called, loading]);

  return (
    <Button
      onClick={pegarDados}
      disabled={loading && called}
    >
      Últimas Consultas
    </Button>
  );
}
