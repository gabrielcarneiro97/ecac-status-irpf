import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Container, Row, Col } from 'react-grid-system';

import { Colors } from '@blueprintjs/core';

import moment from 'moment';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';

import 'moment/locale/pt-br';

import Header from './components/Header';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';

moment.locale('pt-br');

const Main = () => <div>Main</div>;
const Pessoas = () => <div>Pessoas</div>;


function App() {
  return (
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
          <Col style={{ padding: 0 }}>
            <Switch>
              <Route exact path="/pessoas" component={Pessoas} />
              <Route path="/" component={Main} />
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
  );
}


export default App;
