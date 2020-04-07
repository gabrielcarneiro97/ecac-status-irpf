import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

function anos() {
  const atual = (new Date()).getFullYear();
  const anosArr = [];
  for (let ano = 2014; ano <= atual; ano += 1) anosArr.push(ano);

  return anosArr;
}

function SelectAno(props) {
  const [ano, setAno] = useState('2020');

  const handleChange = (a) => {
    const { onChange } = props;
    setAno(a);
    onChange(a);
  };

  return (
    <Select defaultValue={ano} onChange={handleChange} style={{ minWidth: '90px' }}>
      {anos().map((a) => <Option key={`select-ano-${a}`} value={a}>{a}</Option>)}
    </Select>
  );
}

SelectAno.propTypes = {
  onChange: PropTypes.func,
};

SelectAno.defaultProps = {
  onChange: () => undefined,
};

export default SelectAno;
