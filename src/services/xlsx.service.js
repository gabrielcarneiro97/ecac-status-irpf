import XLSX from 'xlsx';

import { sanitizar } from './ajustes.service';

export function objsToXlsx(objs) {
  const sheet = XLSX.utils.json_to_sheet(objs);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, 'importacao.xlsx');

  return wb;
}

export async function xlsxToObjs(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  return new Promise((resolve) => {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetNames = workbook.SheetNames;

      const res = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

      resolve(res.map((el) => ({
        ...el,
        cpf: String(sanitizar(el.cpf)).padStart(11, '0'),
        codigoAcesso: String(sanitizar(el.codigoAcesso)).padStart(12, '0'),
      })));
    };
  });
}
