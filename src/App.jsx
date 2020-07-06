import React from 'react';
import { HashRouter } from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';

import moment from 'moment';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';

import 'moment/locale/pt-br';

import Main from './components/Main';

import client from './services/gql.service';

moment.locale('pt-br');

function App() {
  return (
    <ApolloProvider client={client}>
      <HashRouter>
        <Main />
      </HashRouter>
    </ApolloProvider>
  );
}

export default App;
