import React, { Component } from 'react';
import { HotTable } from '@handsontable/react';

import {
  Button,
  Row,
  Col,
  Progress,
} from 'antd';

const { ipcRenderer } = window.require('electron');

class MainDataTable extends Component {
  colHeaders = ['Nome', 'CPF', 'Código de Acesso', 'Senha', 'Status'];

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      dataLength: 0,
      progress: 0,
      consultaDisabled: false,
    };

    this.hotTableComponent = React.createRef();
  }

  componentDidMount() {
    this.getData();
  }

  setStateAsync = (newState) => new Promise((resolve) => this.setState(newState, resolve));

  getData = async () => {
    ipcRenderer.send('readData');
    return new Promise((resolve) => {
      ipcRenderer.once('dbData', (e, { data, dataLength }) => {
        this.setState({ data, dataLength }, resolve);
      });
    });
  }

  getTableData = () => {
    const { hotInstance } = this.hotTableComponent.current;
    const tableData = hotInstance.getData();
    return tableData;
  }

  changeStatus = async (pessoa) => {
    const tableData = this.getTableData();
    const row = tableData.findIndex((lin) => lin[1] === pessoa.cpf);
    tableData[row][4] = pessoa.decStatus;

    return this.setStateAsync((prevState) => ({
      data: tableData,
      progress: prevState.progress + 1,
    }));
  }

  saveChanges = async () => {
    const tableData = this.getTableData();
    ipcRenderer.send('saveData', { data: tableData });
    return new Promise((resolve) => {
      ipcRenderer.once('saveEnd', () => {
        this.setState({ data: tableData }, () => {
          resolve();
        });
      });
    });
  }

  removeStatus = async () => {
    const tableData = this.getTableData();
    const newData = tableData.map((row) => [row[0], row[1], row[2], row[3], null]);
    return new Promise((resolve) => {
      this.setState({ data: newData }, () => resolve());
    });
  }

  check = async () => {
    await this.setStateAsync({ consultaDisabled: true, progress: 0 });
    console.log('aqui');
    await this.saveChanges();
    console.log('aqui');
    await this.getData();
    console.log('aqui');
    await this.removeStatus();
    console.log('aqui');

    ipcRenderer.on('pessoaEnd', (e, { data }) => this.changeStatus(data));

    ipcRenderer.send('startCheck');
    ipcRenderer.once('checkEnd', async () => {
      ipcRenderer.removeAllListeners('pessoaEnd');

      await this.getData();
      await this.setStateAsync({ consultaDisabled: false });
    });
  }

  render() {
    const {
      data,
      consultaDisabled,
      progress,
      dataLength,
    } = this.state;

    const percent = dataLength === 0 ? 0
      : (progress / dataLength) * 100;

    return (
      <>
        <Row type="flex" justify="end" align="middle" gutter={8}>
          <Col>
            <Button type="primary" onClick={this.check} disabled={consultaDisabled}>
              Consultar RFB
            </Button>
          </Col>
          <Col>
            <div>
              <Progress percent={percent} type="circle" width={40} status="active" />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col>
            <HotTable
              data={data.length === 0 ? [['', '', '', '', '']] : data}
              ref={this.hotTableComponent}
              colHeaders={this.colHeaders}
              rowHeaders
              width="750"
              height="300"
              minRows="5"
              stretchH="all"
              allowInsertRow
              allowRemoveRow
              licenseKey="non-commercial-and-evaluation"
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default MainDataTable;
