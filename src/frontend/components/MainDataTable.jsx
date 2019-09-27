import React, { Component } from 'react';
import { HotTable } from '@handsontable/react';

import {
  Button,
  Row,
  Col,
  Progress,
  Checkbox,
  Alert,
  Divider,
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
      savePDF: false,
      appConfig: {},
    };

    this.hotTableComponent = React.createRef();
  }

  componentDidMount() {
    this.getData();
    this.getConfig();
  }

  setStateAsync = (newState) => new Promise((resolve) => this.setState(newState, resolve));

  getConfig = async () => {
    ipcRenderer.send('getConfig');
    return new Promise((resolve) => {
      ipcRenderer.once('configReturn', async (e, { config }) => {
        await this.setStateAsync({ appConfig: config });
        resolve(config);
      });
    });
  }

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
      this.setState({ data: tableData });
      ipcRenderer.once('saveEnd', () => {
        resolve();
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
    const { savePDF } = this.state;
    await this.saveChanges();
    await this.setStateAsync({ consultaDisabled: true, progress: 0 });
    await this.getData();
    await this.removeStatus();

    ipcRenderer.on('pessoaEnd', (e, { data }) => this.changeStatus(data));

    ipcRenderer.send('startCheck', { savePDF });
    ipcRenderer.once('checkEnd', async () => {
      ipcRenderer.removeAllListeners('pessoaEnd');

      await this.getData();
      await this.setStateAsync({ consultaDisabled: false });
    });
  }

  handleCheckBox = () => {
    this.setState((prevState) => ({
      savePDF: !prevState.savePDF,
      data: this.getTableData(),
    }));
  }

  render() {
    const {
      data,
      consultaDisabled,
      progress,
      dataLength,
      savePDF,
      appConfig,
    } = this.state;

    console.log(data);

    const percent = dataLength === 0 ? 0
      : (progress / dataLength) * 100;

    return (
      <>
        <Row type="flex" justify="center" align="middle" gutter={8}>
          <Col>
            <Divider orientation="left">
              Consultar Declarações
            </Divider>
          </Col>
        </Row>
        <Row type="flex" justify="end" align="middle" gutter={8}>
          <Col>
            {
              savePDF
              && (
              <Alert
                message={(
                  <span style={{ fontSize: '12px' }}>
                    Extratos sendo salvos em:&nbsp;
                    {appConfig.folder}
                  </span>
                )}
                type="info"
                showIcon
              />
              )
            }
          </Col>
          <Col>
            <Checkbox
              onChange={this.handleCheckBox}
              checked={savePDF}
              disabled={consultaDisabled}
            >
              Salvar Extratos
            </Checkbox>
          </Col>
          <Col>
            <Button type="primary" onClick={this.check} disabled={consultaDisabled}>
              Consultar RFB
            </Button>
          </Col>
          <Col>
            <div>
              <Progress percent={parseFloat(percent.toFixed(1))} type="circle" width={40} status="active" />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }} type="flex" justify="center" align="middle">
          <Col>
            <HotTable
              data={data.length === 0 ? [['', '', '', '', '']] : data}
              ref={this.hotTableComponent}
              colHeaders={this.colHeaders}
              rowHeaders
              width="850"
              height="340"
              minRows="20"
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
