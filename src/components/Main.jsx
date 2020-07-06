import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';

import { Container, Row, Col } from 'react-grid-system';

import { Colors, Spinner } from '@blueprintjs/core';

import Header from './Header';
import Footer from './Footer';
import SideMenu from './SideMenu';
import ConsultaPage from './ConsultaPage';
import PessoasPage from './PessoasPage';

function App() {
  const QUERY = gql`
      subscription {
      backendIsReady
    }
  `;

  const { data, loading } = useSubscription(QUERY);

  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (data) {
      const { backendIsReady } = data;
      setWaiting(!backendIsReady || loading);
    }
  }, [data, loading]);

  return (
    <Container
      fluid
      style={{
        height: '100%',
        backgroundColor: Colors.DARK_GRAY4,
      }}
      className="bp3-dark"
    >
      <Row style={{ height: 50 }}>
        <Col style={{ padding: 0 }}>
          <Header />
        </Col>
      </Row>
      <Row style={{ height: 521, display: waiting ? 'inherit' : 'none', paddingTop: 30 }}>
        <Col>
          <Spinner size={Spinner.SIZE_LARGE} />
        </Col>
      </Row>
      <Row style={{ height: 521, display: waiting ? 'none' : 'flex' }}>
        <Col xs={2} style={{ padding: 0, marginRight: 15 }}>
          <SideMenu />
        </Col>
        <Col style={{ padding: 0, margin: 20 }}>
          <Switch>
            <Route exact path="/pessoas" component={PessoasPage} />
            <Route path="/" component={ConsultaPage} />
          </Switch>
        </Col>
      </Row>
      <Row style={{ height: 50 }}>
        <Col style={{ padding: 0 }}>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
