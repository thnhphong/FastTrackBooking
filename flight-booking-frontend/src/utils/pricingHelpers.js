export const isTruthyFlag = (value) => {
  return value === true || value === 'true' || value === 1 || value === '1';
};

export const getPriceFromMap = (value, priceMap) => {
  if (value === undefined || value === null) {
    return 0;
  }

  const rawValue = String(value).trim();
  if (rawValue === '') {
    return 0;
  }

  if (priceMap[rawValue] !== undefined) {
    return priceMap[rawValue];
  }

  const withDollar = rawValue.endsWith('$') ? rawValue : `${rawValue}$`;
  if (priceMap[withDollar] !== undefined) {
    return priceMap[withDollar];
  }

  return 0;
};

