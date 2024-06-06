export function formatPrice(x) {
  return Intl.NumberFormat('pl-PL', {style: 'currency', currency: 'PLN'}).format(x);
}

export function displayProps(props) {
  return Object.values(props || {}).map(v => v.replace(/:#[0-9a-zA-Z]{3,6}/, '')).join(' / ');
}