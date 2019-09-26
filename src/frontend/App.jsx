import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import moment from 'moment';
import { Layout } from 'antd';

import Main from './components/Main';
import Config from './components/Config';
import SideMenu from './components/SideMenu';
import Foot from './components/Foot';
import Head from './components/Head';

import 'handsontable/dist/handsontable.full.css';
import './App.css';

import 'moment/locale/pt-br';
import 'antd/dist/antd.css';

moment.locale('pt-br');

const {
  Header,
  Sider,
  Content,
  Footer,
} = Layout;

function App() {
  return (
    <HashRouter>
      <Layout>
        <Header><Head /></Header>
        <Layout style={{ minHeight: '500px' }}>
          <Sider>
            <SideMenu />
          </Sider>
          <Content style={{ padding: 24 }}>
            <Switch>
              <Route exact path="/config" component={Config} />
              <Route path="/" component={Main} />
            </Switch>
          </Content>
        </Layout>
        <Footer style={{ height: '48px' }}><Foot /></Footer>
      </Layout>
    </HashRouter>
  );
}

export default App;
