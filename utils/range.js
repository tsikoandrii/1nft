const RANGE = 'Form Data';

module.exports = (value) => {
  return value ? `${RANGE}!${value}` : RANGE
}
