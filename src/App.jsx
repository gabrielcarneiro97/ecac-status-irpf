import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Container, Row, Col } from 'react-grid-system';

import { Colors } from '@blueprintjs/core';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import { ApolloProvider } from '@apollo/react-hooks';

import moment from 'moment';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';

import 'moment/locale/pt-br';

import Header from './components/Header';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import ConsultaPage from './components/ConsultaPage';
import PessoasPage from './components/PessoasPage';

moment.locale('pt-br');

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <HashRouter>
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
          <Row style={{ height: 521 }}>
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
      </HashRouter>
    </ApolloProvider>
  );
}

export default App;
