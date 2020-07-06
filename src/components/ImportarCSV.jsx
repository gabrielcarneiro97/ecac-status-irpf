import React, { useState } from 'react';
import { FileInput } from '@blueprintjs/core';
import { xlsxToObjs } from '../services/xlsx.service';

function ImporatarCSV() {
  const [text, setText] = useState('Selecione um arquivo');

  const inputChange = async (e) => {
    const { files } = e.target;

    if (files.length === 0) return setText('Selecione um arquivo');

    const arquivo = e.target.files[0];

    console.log(await xlsxToObjs(arquivo));

    return setText(arquivo.name);
  };

  return (
    <FileInput
      text={text}
      onInputChange={inputChange}
      inputProps={{
        accept: '.xls, .xlsx',
      }}
    />
  );
}

export default ImporatarCSV;
