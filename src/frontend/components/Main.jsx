import React from 'react';

import MainDataTable from './MainDataTable';

function Main() {
  const data = [
    ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
    ['2016', 10, 11, 12, 13],
    ['2017', 20, 11, 14, 13],
    ['2018', 30, 15, 12, 13],
  ];

  return (
    <MainDataTable />
  );
}

export default Main;
