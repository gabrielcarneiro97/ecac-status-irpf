import React, { Component } from 'react';
import { HotTable } from '@handsontable/react';

class MainDataTable extends Component {
  colHeaders = ['Nome', 'CPF', 'Código de Acesso', 'Senha'];

  constructor(props) {
    super(props);

    this.state = {
      data: [['Gabriel', '', '', '']],
    };
  }

  render() {
    const { data } = this.state;
    return (
      <HotTable
        data={data}
        colHeaders={this.colHeaders}
        rowHeaders
        width="700"
        height="300"
        minRows="100"
        stretchH="all"
      />
    );
  }
}

export default MainDataTable;
