import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import moment from 'moment';
import { Layout } from 'antd';

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

function Main() {
  return <div>Main</div>;
}

function ConfigMain() {
  return <div>ConfigMain</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header>Header</Header>
        <Layout style={{ height: '488px' }}>
          <Sider>Sider</Sider>
          <Content>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/config" component={ConfigMain} />
            </Switch>
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
