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

const IMMIGRATION_PACKAGE_PRICES = {
  '35$': 35,
  '40$': 40,
  '50$': 50,
  '65$': 65,
  '300$': 300,
};

const EMIGRATION_PACKAGE_PRICES = {
  '50$': 50,
  '65$': 65,
  '300$': 300,
};

const PICKUP_VEHICLE_PRICES = {
  1: 20,
  2: 25,
  3: 50,
};

export const getBookingSubtotalInfo = (bookingData) => {
  let immSubtotal = 0;
  if (bookingData?.immigration) {
    const pickupService = Number(bookingData.immigration.pickup_service);
    const pickupPrice = PICKUP_VEHICLE_PRICES[pickupService] || 0;
    const fastTrackPrice = isTruthyFlag(bookingData.immigration.use_immigration_fast_track) ? 15 : 0;
    const tarmacPrice = isTruthyFlag(bookingData.immigration.tarmac_pickup) ? 60 : 0;
    const packagePrice = getPriceFromMap(
      bookingData.immigration.immigration_package,
      IMMIGRATION_PACKAGE_PRICES
    );
    immSubtotal = pickupPrice + fastTrackPrice + tarmacPrice + packagePrice;
  }

  const emigrPackagePrice = getPriceFromMap(
    bookingData?.emigration?.emigration_package,
    EMIGRATION_PACKAGE_PRICES
  );

  const baseSubtotal = immSubtotal + emigrPackagePrice;

  const departureFlight = bookingData?.emigration?.departure_flight_number;
  const isVietJet =
    typeof departureFlight === 'string' && departureFlight.toUpperCase().includes('VJ');
  const extraFee = isVietJet ? 15 : 0;

  return {
    baseSubtotal,
    emigrationPackagePrice: emigrPackagePrice,
    immigrationSubtotal: immSubtotal,
    extraFee,
    isVietJet,
  };
};

