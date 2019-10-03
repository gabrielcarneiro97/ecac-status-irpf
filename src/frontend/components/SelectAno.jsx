import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

function setAnos() {
  const atual = (new Date()).getFullYear();
  const anos = [];
  for (let ano = 2014; ano <= atual; ano += 1) anos.push(ano);

  return anos;
}

class SelectAno extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ano: '2019',
    };
  }

  handleChange = (ano) => {
    const { onChange } = this.props;
    this.setState({ ano }, () => onChange(ano));
  }

  render() {
    const { ano } = this.state;

    const anos = setAnos();
    const opts = anos.map((a) => <Option key={`select-ano-${a}`} value={a}>{a}</Option>);

    return (
      <Select defaultValue={ano} onChange={this.handleChange} style={{ minWidth: '90px' }}>
        {opts}
      </Select>
    );
  }
}

SelectAno.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SelectAno;
