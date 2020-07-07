/* eslint-disable import/prefer-default-export */

export function sanitizar(str) {
  return str.toString().replace(/\./g, '').replace(/\.-/g, '');
}
