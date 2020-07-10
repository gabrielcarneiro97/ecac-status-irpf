import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import gql from 'graphql-tag';

import XLSX from 'xlsx';
import moment from 'moment';

import { Button } from '@blueprintjs/core';
import { objsToXlsx } from '../services/xlsx.service';

export default function RelatorioTodasConsultas() {
  const QUERY = gql`
    query {
      pessoas {
        cpf, nome, consultas { ano, status, dataHora }
      }
    }
  `;

  const [pegarDados, { called, loading, data }] = useLazyQuery(QUERY);

  useEffect(() => {
    if (called && !loading && data) {
      const { pessoas } = data;
      const res = pessoas.map((pessoa) => pessoa.consultas.map(
        (consulta) => ({
          cpf: pessoa.cpf,
          nome: pessoa.nome,
          ...consulta,
          dataHora: moment(consulta.dataHora).format('DD/MM/YYYY HH:mm'),
        }),
      )).flat();

      const wb = objsToXlsx(res, 'todasConsultas.xlsx');

      XLSX.writeFile(wb, 'todasConsultas.xlsx');
    }
  }, [called, loading]);

  return (
    <Button
      onClick={pegarDados}
      disabled={loading && called}
    >
      Todas as Consultas
    </Button>
  );
}
