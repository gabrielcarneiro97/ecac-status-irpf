/* eslint-disable import/prefer-default-export */

export function sanitizar(str) {
  return str.replace(/\./g, '').replace(/\.-/g, '');
}
