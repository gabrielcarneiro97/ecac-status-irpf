import React, { Component } from 'react';
import {
  Button,
  Alert,
  Card,
} from 'antd';

const { ipcRenderer } = window.require('electron');

class CheckRFBStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      disableButton: true,
    };
  }

  componentDidMount() {
    this.check();
  }

  check = async () => new Promise((resolve) => {
    ipcRenderer.send('accessTime');
    this.setState({ time: 0 });
    ipcRenderer.once('timeReturn', (e, { time }) => {
      this.setState({ time, disableButton: false }, resolve);
    });
  });

  handleClick = () => {
    this.setState({ disableButton: true }, async () => {
      await this.check();
      this.setState({ disableButton: false });
    });
  }

  render() {
    const { time, disableButton } = this.state;

    let message = '';
    let type = '';

    if (time === 0) {
      message = 'Testando Conexão...';
      type = 'info';
    } else if (time <= 2000) {
      message = 'Conexão Ótima!';
      type = 'success';
    } else if (time <= 5000) {
      message = 'Conexão Ok';
      type = 'success';
    } else if (time <= 10000) {
      message = 'Conexão um Pouco Lenta';
      type = 'warning';
    } else {
      message = 'Conexão Muito Lenta!';
      type = 'error';
    }
    return (
      <Card
        size="small"
        title="Conexão RFB"
        extra={(
          <Button disabled={disableButton} onClick={this.handleClick} type="link">
            Testar
          </Button>
        )}
        style={{ width: 300 }}
      >
        <Alert message={message} type={type} showIcon />
      </Card>
    );
  }
}

export default CheckRFBStatus;
