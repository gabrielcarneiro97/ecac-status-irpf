import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FileInput } from '@blueprintjs/core';
import { xlsxToObjs } from '../services/xlsx.service';

function ImportarXLS(props) {
  const { onData } = props;

  const [text, setText] = useState('Selecione um arquivo');

  const inputChange = async (e) => {
    const { files } = e.target;

    if (files.length === 0) return setText('Selecione um arquivo');

    const arquivo = e.target.files[0];

    setText(arquivo.name);

    return onData(await xlsxToObjs(arquivo));
  };

  return (
    <FileInput
      text={text}
      onInputChange={inputChange}
      inputProps={{
        accept: ['.xls', '.xlsx'].join(','),
      }}
    />
  );
}

ImportarXLS.propTypes = {
  onData: PropTypes.func,
};

ImportarXLS.defaultProps = {
  onData: () => null,
};

export default ImportarXLS;
