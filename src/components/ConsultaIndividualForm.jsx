import React, { useState, useEffect } from 'react';
import {
  FormGroup, InputGroup, Intent, Button, HTMLSelect, H3,
} from '@blueprintjs/core';
import { Container, Row, Col } from 'react-grid-system';
import { validate } from 'gerador-validador-cpf';
import gql from 'graphql-tag';

import { useLazyQuery } from '@apollo/react-hooks';

import AppToaster from '../services/toaster';

function sanitizar(str) {
  return str.replace(/\./g, '').replace(/\.-/g, '');
}

function ConsultaIndividualForm() {
  const [cpf, setCpf] = useState('');
  const [cpfIntent, setCpfIntent] = useState(Intent.NONE);
  const [cpfIsValid, setCpfIsValid] = useState(false);

  useEffect(() => {
    if (!validate(cpf) && cpf !== '') {
      setCpfIntent(Intent.DANGER);
      setCpfIsValid(false);
    } else {
      setCpfIntent(Intent.NONE);
      setCpfIsValid(true);
    }

    if (cpf === '') setCpfIsValid(false);
  }, [cpf]);

  const [nome, setNome] = useState('');
  const [nomeIsValid, setNomeIsValid] = useState(false);

  useEffect(() => {
    if (nome !== '') setNomeIsValid(true);
    else setNomeIsValid(false);
  }, [nome]);

  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [codigoAcessoIsValid, setCodigoAcessoIsValid] = useState(false);

  useEffect(() => {
    if (codigoAcesso !== '') setCodigoAcessoIsValid(true);
    else setCodigoAcessoIsValid(false);
  }, [codigoAcesso]);

  const [senha, setSenha] = useState('');
  const [senhaIsValid, setSenhaIsValid] = useState(false);

  useEffect(() => {
    if (senha !== '') setSenhaIsValid(true);
    else setSenhaIsValid(false);
  }, [senha]);

  const [ano, setAno] = useState('2020');

  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    setLiberado(cpfIsValid && nomeIsValid && codigoAcessoIsValid && senhaIsValid);
  }, [cpfIsValid, nomeIsValid, codigoAcessoIsValid, senhaIsValid]);

  const handleInputChange = (setter) => (e) => setter(e.target?.value || e.currentTarget.value);

  const [pessoa, setPessoa] = useState(null);

  const CONSULTA_QUERY = gql`
    query consultaUnica($pessoa: PessoaInput!, $ano: String!) {
      consultaUnica(pessoa: $pessoa, ano: $ano)
    }
  `;

  const [consultar, { loading, data }] = useLazyQuery(CONSULTA_QUERY);

  useEffect(() => {
    if (pessoa) consultar({ variables: { pessoa, ano } });
  }, [pessoa]);

  useEffect(() => {
    if (data?.consultaUnica === false) {
      AppToaster.show({
        message: 'Já existe uma consulta em execução, tente novamente mais tarde.',
      });
    }

    if (data?.consultaUnica === true) {
      AppToaster.show({
        message: 'Consulta iniciada.',
      });
    }
  }, [loading, data]);

  const consultaIndividual = () => {
    setPessoa({
      nome,
      cpf: sanitizar(cpf),
      codigoAcesso: sanitizar(codigoAcesso),
      senha,
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <H3>Consulta Individual</H3>
        </Col>
      </Row>
      <Row gutterWidth={8}>
        <Col>
          <FormGroup
            label="Nome"
            labelFor="nome-input"
          >
            <InputGroup
              id="nome-input"
              placeholder="Nome"
              value={nome}
              onChange={handleInputChange(setNome)}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup
            label="CPF"
            labelFor="cpf-input"
          >
            <InputGroup
              id="cpf-input"
              placeholder="CPF"
              value={cpf}
              onChange={handleInputChange(setCpf)}
              intent={cpfIntent}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup
            label="Código de Acesso"
            labelFor="codigo-input"
          >
            <InputGroup
              id="codigo-input"
              placeholder="Código de Acesso"
              value={codigoAcesso}
              onChange={handleInputChange(setCodigoAcesso)}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup
            label="Senha"
            labelFor="senha-input"
          >
            <InputGroup
              id="senha-input"
              placeholder="Senha"
              value={senha}
              onChange={handleInputChange(setSenha)}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup
            label="Ano"
            labelFor="ano-select"
          >
            <HTMLSelect
              value={ano}
              options={['2017', '2018', '2019', '2020']}
              onChange={handleInputChange(setAno)}
              id="ano-select"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button disabled={!liberado} onClick={consultaIndividual}>
            Consultar
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ConsultaIndividualForm;
