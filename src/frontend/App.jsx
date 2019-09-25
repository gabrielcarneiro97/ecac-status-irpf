import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import moment from 'moment';
import { Layout } from 'antd';

import SideMenu from './components/SideMenu';
import Main from './components/Main';

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

function ConfigMain() {
  return <div>ConfigMain</div>;
}

function App() {
  return (
    <HashRouter>
      <Layout>
        <Header>Header</Header>
        <Layout style={{ height: '488px' }}>
          <Sider>
            <SideMenu />
          </Sider>
          <Content style={{ padding: 24 }}>
            <Switch>
              <Route exact path="/config" component={ConfigMain} />
              <Route path="/" component={Main} />
            </Switch>
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    </HashRouter>
  );
}

export default App;
