import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import ProcessIndicator from '../components/ProcessIndicator';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { formatDate } from '../utils/formHelpers';
import BottomSection from '../components/BottomSection';
import { getPriceFromMap, isTruthyFlag } from '../utils/pricingHelpers';
import { useTranslation } from 'react-i18next';

const BookingStep3 = ({ bookingData, onPrevStep }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useScrollToTop();


  const getGenderLabel = (value) => {
    if (value === 'male') return t('booking.step2.sex_label_male');
    if (value === 'female') return t('booking.step2.sex_label_female');
    return value || '';
  };

  const translateEnum = (namespace, value) => {
    if (value === undefined || value === null || value === '') return '';
    const key = String(value);
    const translated = t(`${namespace}.${key}`, { defaultValue: '' });
    return translated || key;
  };

  const nationalityTranslationKeys = {
    JPN: 'booking.step2.nationality_label_japan',
    JAPAN: 'booking.step2.nationality_label_japan',
    VNM: 'booking.step2.nationality_label_vietnam',
    VIETNAM: 'booking.step2.nationality_label_vietnam',
    OTHERS: 'booking.step2.nationality_label_others',
    OTHER: 'booking.step2.nationality_label_others',
  };

  const getNationalityLabel = (value) => {
    if (!value) return '';
    const normalized = String(value).toUpperCase();
    const translationKey = nationalityTranslationKeys[normalized];
    if (translationKey) {
      return t(translationKey);
    }
    return value;
  };

  const getContactMethodLabel = (value) => translateEnum('booking.step2.contact_options', value);
  const getSurveyChannelLabel = (value) => translateEnum('booking.step2.survey_channels', value);
  const getAddOnLabel = (value) => translateEnum('booking.step3.add_ons', value);
  const getImmigrationPackageLabel = (value) => translateEnum('booking.step1.immigration_packages', value);
  const getEmigrationPackageLabel = (value) => translateEnum('booking.step1.emigration_packages', value);
  const getPickupVehicleLabel = (value) => translateEnum('booking.step1.pickup_vehicles', value);
  const getSeatingPreferenceLabel = (value) => translateEnum('booking.step1.seating_preferences', value);
  const getAirportLabel = (value) => translateEnum('booking.step1.airports', value);
  const getPaymentMethodLabel = (value) => {
    if (value === undefined || value === null || value === '') return '';
    const translated = t(`booking.payment_method_label_${value}`, { defaultValue: '' });
    return translated || String(value);
  };

  const presenceLabels = {
    yes: t('booking.step3.presence_value_yes', { defaultValue: 'Included' }),
    no: t('booking.step3.presence_value_no', { defaultValue: 'Not included' }),
  };

  const getPresenceLabel = (isIncluded) => (isIncluded ? presenceLabels.yes : presenceLabels.no);

  // ────────────────────────────────────────────────
  // Central price calculation – used for UI + API
  // ────────────────────────────────────────────────
  const calculateFinalPrices = () => {
    // Always recompute base subtotal from current bookingData choices
    // (ignore bookingData.sub_price – it's likely stale)
    let baseSubtotal = 0;

    if (bookingData?.immigration) {
      if (bookingData.immigration.pickup_service && bookingData.immigration.pickup_service !== 0) {
        const vehiclePrices = { 1: 20, 2: 25, 3: 50 };
        baseSubtotal += vehiclePrices[bookingData.immigration.pickup_service] || 0;
      }
      if (isTruthyFlag(bookingData.immigration.use_immigration_fast_track)) baseSubtotal += 15;
      if (isTruthyFlag(bookingData.immigration.tarmac_pickup)) baseSubtotal += 60;

      const immPackagePrices = { '35$': 35, '40$': 40, '50$': 50, '300$': 300 };
      baseSubtotal += getPriceFromMap(bookingData.immigration.immigration_package, immPackagePrices);
    }

    if (bookingData?.emigration) {
      const emiPackagePrices = { '50$': 50, '65$': 65, '300$': 300 };
      baseSubtotal += getPriceFromMap(bookingData.emigration.emigration_package, emiPackagePrices);
    }

    const isVietJet =
      bookingData?.emigration?.departure_flight_number?.toUpperCase().includes('VJ') || false;
    const extraFee = isVietJet ? 15 : 0;

    const subtotalWithExtra = baseSubtotal + extraFee;

    const discount = bookingData?.coupon_discount_amount
      ? Math.max(0, parseFloat(bookingData.coupon_discount_amount))
      : 0;

    const amountAfterDiscount = Math.max(0, subtotalWithExtra - discount);
    const vatAmount = amountAfterDiscount * 0.08;
    const grandTotal = amountAfterDiscount + vatAmount;

    return {
      subtotal: baseSubtotal,
      extraFee,
      subtotalWithExtra,
      discount,
      amountAfterDiscount,
      vat: vatAmount,
      grandTotal,
      isVietJet,
    };
  };

  const prices = calculateFinalPrices();


  const getCostBreakdown = () => {
    const breakdown = [];
    let subtotal = 0;

    if (bookingData?.immigration) {
      const pickupService = bookingData.immigration.pickup_service;
      const vehiclePrices = { 1: 20, 2: 25, 3: 50 };
      const pickupPrice = vehiclePrices[pickupService] || 0;
      const hasPickupService = pickupPrice > 0;
      breakdown.push({
        no: '1.1',
        content: t('booking.step1.pickup_vehicle_label'),
        presence: getPresenceLabel(hasPickupService),
        amount: `$${hasPickupService ? pickupPrice : 0}`,
      });
      if (hasPickupService) subtotal += pickupPrice;

      const fastTrackSelected = isTruthyFlag(bookingData.immigration.use_immigration_fast_track);
      breakdown.push({
        no: '1.2',
        content: t('booking.step1.use_immigration_fast_track_label'),
        presence: getPresenceLabel(fastTrackSelected),
        amount: `$${fastTrackSelected ? 15 : 0}`,
      });
      if (fastTrackSelected) subtotal += 15;

      const tarmacPickupSelected = isTruthyFlag(bookingData.immigration.tarmac_pickup);
      breakdown.push({
        no: '1.3',
        content: t('booking.step1.tarmac_pickup_label'),
        presence: getPresenceLabel(tarmacPickupSelected),
        amount: `$${tarmacPickupSelected ? 60 : 0}`,
      });
      if (tarmacPickupSelected) subtotal += 60;

      const packagePrices = { '35$': 35, '40$': 40, '50$': 50, '300$': 300 };
      const packagePrice = getPriceFromMap(bookingData.immigration.immigration_package, packagePrices);
      const hasPackage = packagePrice > 0;
      breakdown.push({
        no: '1.4',
        content: t('booking.step1.entry_fast_track_option_label'),
        presence: getPresenceLabel(hasPackage),
        amount: `$${packagePrice}`,
      });
      subtotal += packagePrice;
    }

    if (bookingData?.emigration) {
      const emigrationPrices = { '50$': 50, '65$': 65, '300$': 300 };
      const emigrationPrice = getPriceFromMap(bookingData.emigration.emigration_package, emigrationPrices);
      const hasEmigrationPackage = emigrationPrice > 0;
      breakdown.push({
        no: '2',
        content: t('booking.step1.departure_fast_track_option_label'),
        presence: getPresenceLabel(hasEmigrationPackage),
        amount: `$${emigrationPrice}`,
      });
      subtotal += emigrationPrice;
    }

    return { breakdown, subtotal };
  };


  // ────────────────────────────────────────────────
  // Prepare data for API – uses the same calculation
  // ────────────────────────────────────────────────
  const prepareApiData = () => {

    const apiData = {};

    if (bookingData?.immigration && bookingData?.emigration) {
      apiData.booking_type = 'both';
    } else if (bookingData?.immigration) {
      apiData.booking_type = 'arrival';
    } else if (bookingData?.emigration) {
      apiData.booking_type = 'departure';
    }

    apiData.first_name = bookingData?.first_name || bookingData?.passport?.first_name || '';
    apiData.last_name = bookingData?.last_name || bookingData?.passport?.last_name || '';
    apiData.date_of_birth = bookingData?.date_of_birth || bookingData?.passport?.birthday || '';
    apiData.passport_expiry_date = bookingData?.passport_expiry_date || bookingData?.passport?.expire_date || '';
    apiData.sex = bookingData?.sex !== undefined ? String(bookingData.sex) : (bookingData?.passport?.gender === 'male' ? '0' : bookingData?.passport?.gender === 'female' ? '1' : '');
    apiData.user_phone_number = bookingData?.user_phone_number || bookingData?.passport?.user_phone_number || '';
    apiData.nationality = bookingData?.nationality || bookingData?.passport?.nationality || '';
    apiData.contact_email_to = bookingData?.contact_email_to || bookingData?.passport?.email || '';
    apiData.contact_email_cc = bookingData?.contact_email_cc || bookingData?.passport?.email_cc || '';
    apiData.passport_number = bookingData?.passport_number || bookingData?.passport?.passport_num || '';
    apiData.arrival_class_documents = bookingData?.arrival_class_documents || '';
    apiData.arrival_checked_baggage_availability = bookingData?.arrival_checked_baggage_availability || '';
    apiData.departure_class_documents = bookingData?.departure_class_documents || '';
    apiData.departure_checked_baggage_availability = bookingData?.departure_checked_baggage_availability || '';
    apiData.optional_company_name = bookingData?.optional_company_name || bookingData?.passport?.company_name || '';
    apiData.referred_by_name = bookingData?.referred_by_name || bookingData?.passport?.referer_name || '';

    apiData.contact_method = bookingData?.contact_method !== undefined ? String(bookingData.contact_method) : '';
    apiData.survey_channel = bookingData?.survey_channel !== undefined ? String(bookingData.survey_channel) : '';

    if (Array.isArray(bookingData?.add_ons) && bookingData.add_ons.length > 0) {
      apiData.add_ons = bookingData.add_ons.map(String).join(',');
    }

    // ─── Immigration fields ───────────────────────────────
    if (bookingData?.immigration) {
      const arrivalAirportMap = { 0: 'SGN', 1: 'DAD', 2: 'HAN' };
      apiData.arrival_airport = arrivalAirportMap[bookingData.immigration.arrival_airport] || '';
      apiData.arrival_date = bookingData.immigration.arrival_date || '';
      apiData.arrival_flight_number = bookingData.immigration.arrival_flight_number || '';
      apiData.arrival_flight_reservation_code = bookingData.immigration.arrival_flight_reservation_code || '';
      apiData.arrival_phone_number = bookingData.immigration.arrival_phone_number || '';
      apiData.arrival_request = bookingData.immigration.arrival_request || '';
      apiData.entry_fast_track_option = String(
        bookingData.immigration.entry_fast_track_option ?? ''
      );
      apiData.tarmac_pickup = isTruthyFlag(bookingData.immigration.tarmac_pickup) ? 'true' : 'false';
      apiData.pickup_service = String(bookingData.immigration.pickup_service || '0');
      apiData.use_immigration_fast_track = isTruthyFlag(bookingData.immigration.use_immigration_fast_track) ? 'true' : 'false';
    }

    // ─── Emigration fields ───────────────────────────────
    if (bookingData?.emigration) {
      const departureAirportMap = { 0: 'SGN', 1: 'DAD', 2: 'HAN' };
      apiData.departure_airport_code = departureAirportMap[bookingData.emigration.departure_airport_code] || '';
      apiData.departure_date = bookingData.emigration.departure_date || '';
      apiData.departure_flight_number = bookingData.emigration.departure_flight_number || '';
      apiData.departure_flight_reservation_code = bookingData.emigration.departure_flight_reservation_code || '';
      apiData.departure_phone_number = bookingData.emigration.departure_phone_number || '';
      apiData.departure_request = bookingData.emigration.departure_request || '';
      apiData.departure_fast_track_option = String(
        bookingData.emigration.departure_fast_track_option ?? ''
      );
      apiData.departure_seating_preferences = String(
        bookingData.emigration.departure_seating_preferences ?? ''
      );
      apiData.departure_time = bookingData.emigration.departure_time || '';
      apiData.use_departure_fast_track = (bookingData.emigration.departure_fast_track_option === 1 || bookingData.emigration.departure_fast_track_option === '1') ? '1' : '0';
    }

    // ─── Pricing fields – now consistent with UI ──────────
    apiData.preliminary_calculation = prices.subtotal.toFixed(2);
    apiData.extra_fee_vietjet = prices.extraFee > 0 ? prices.extraFee.toFixed(2) : null;
    apiData.coupon = bookingData?.coupon || null;
    apiData.coupon_discount_amount = prices.discount > 0 ? prices.discount.toFixed(2) : null;
    apiData.has_coupon_discount = prices.discount > 0;
    apiData.amount_after_coupon = prices.amountAfterDiscount.toFixed(2);
    apiData.tax = prices.vat.toFixed(2);
    apiData.total = prices.grandTotal.toFixed(2);
    apiData.payment_method =
      bookingData?.payment_method !== undefined && bookingData?.payment_method !== null
        ? String(bookingData.payment_method)
        : null;

    // Clean up empty/null fields
    Object.keys(apiData).forEach((key) => {
      if (apiData[key] === '' || apiData[key] === null || apiData[key] === undefined) {
        delete apiData[key];
      }
    });

    // Sort keys (if backend prefers sorted JSON)
    const sortedApiData = {};
    Object.keys(apiData)
      .sort()
      .forEach((key) => {
        sortedApiData[key] = apiData[key];
      });

    return sortedApiData;
  };

  const handleBack = () => {
    if (onPrevStep) onPrevStep();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const submitData = prepareApiData();
      console.log('Submitting:', submitData);

      await createBooking(submitData);
      sessionStorage.setItem('bookingSuccess', 'true');

      // Navigate to /booking_success/ after successful submission
      navigate('/booking_success/');
    } catch (err) {
      setError(err.response?.data?.message || '予約の作成に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const costData = getCostBreakdown();
  const immigrationItems = bookingData?.immigration
    ? costData.breakdown.filter(item => item.no.startsWith('1.'))
    : [];
  const emigrationItems = bookingData?.emigration
    ? costData.breakdown.filter(item => item.no === '2')
    : [];
  //check if flight is VietJet Air(just for emigraiton)
  const isVietJet = (bookingData?.emigration?.departure_flight_number?.toUpperCase().includes('VJ')) || false;
  const extraFee = isVietJet ? 15 : 0;


  // Final calculations including extra fee
  const subtotal = bookingData?.sub_price || costData.subtotal;
  const adjustedSubtotal = subtotal + extraFee;

  const appliedDiscount = bookingData?.coupon_discount_amount
    ? parseFloat(bookingData.coupon_discount_amount)
    : 0;

  const amountAfterCoupon = Math.max(0, adjustedSubtotal - appliedDiscount);
  const vat = amountAfterCoupon * 0.08;
  const billedAmount = amountAfterCoupon + vat;
  // For display in table
  const totalExcludingTax = amountAfterCoupon;
  const couponDiscount = appliedDiscount;

  const costHeaderCellClass =
    'py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 border border-gray-200 text-left font-semibold text-black text-base max-[640px]:text-sm';
  const costCellBaseClass =
    'py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 border border-gray-200 text-black text-base max-[640px]:text-sm';
  const costCellRightClass = `${costCellBaseClass} text-right`;
  const costCellBoldRightClass = `${costCellRightClass} font-bold`;
  const costSectionHeaderClass =
    'py-2 px-4 max-[640px]:py-2 max-[640px]:px-2 border border-gray-200 font-bold text-black bg-gray-100 text-center';

  return (
    <div>
      <div className="min-h-screen bg-white border border-gray-200  shadow-sm rounded-lg">
        <div className="max-w-6xl mx-auto px-2 max-[640px]:px-1 py-4">
          <ProcessIndicator currentStep={3} />
          <hr className="border-b-[0.4px] border-gray-200 mt-3 mb-4 " />

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 ">
              {error}
            </div>
          )}

          {/* User Information Table - match reference UI layout */}
          <div className="mb-6 bg-white border-2 border-gray-300 overflow-hidden mt-10 max-[640px]:mt-4">
            <h2 className="text-xl max-[640px]:text-lg font-bold text-black text-center bg-gray-100 py-4 max-[640px]:py-2 px-6 max-[640px]:px-2 border-b border-gray-200">
              {t(`booking.step3.user_information_label`)}
            </h2>
            <div className="p-0">
              <table className="w-full border-collapse max-[640px]:text-sm">
                <tbody>
                  {/* Row 1: Last name & First name / Gender & DOB */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                      <span className="font-semibold">{t(`booking.step3.last_name_label`)}:</span>{' '}
                      {bookingData?.passport?.last_name}{' '}
                      <span className="font-semibold ml-4 max-[640px]:ml-2">{t(`booking.step3.first_name_label`)}:</span>{' '}
                      {bookingData?.passport?.first_name}
                    </td>
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                      <span className="font-semibold">{t(`booking.step3.gender_label`)}:</span>{' '}
                      {getGenderLabel(bookingData?.passport?.gender)}{' '}
                      <span className="font-semibold ml-6 max-[640px]:ml-2">{t(`booking.step3.date_of_birth_label`)}:</span>{' '}
                      {formatDate(bookingData?.passport?.birthday)}
                    </td>
                  </tr>

                  {/* Row 2: Phone number & Nationality */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                      <span className="font-semibold">{t(`booking.step3.user_phone_number_label`)}:</span>{' '}
                      {bookingData?.user_phone_number}
                    </td>
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                      <span className="font-semibold">{t(`booking.step3.nationality_label`)}:</span>{' '}
                      {getNationalityLabel(
                        bookingData?.nationality || bookingData?.passport?.nationality
                      )}
                    </td>
                  </tr>

                  {/* Row 3: Email / CC Email */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                      <span className="font-semibold">{t(`booking.step3.contact_email_to_label`)}:</span>{' '}
                      <span className="break-all">{bookingData?.passport?.email}</span>
                    </td>
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                      <span className="font-semibold">{t(`booking.step3.contact_email_cc_label`)}:</span>{' '}
                      <span className="break-all">{bookingData?.passport?.email_cc || ''}</span>
                    </td>
                  </tr>

                  {/* Row 4: Passport No / Passport Expiration */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                      <span className="font-semibold">{t(`booking.step3.passport_number_label`)}:</span>{' '}
                      {bookingData?.passport?.passport_num}
                    </td>
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                      <span className="font-semibold">{t(`booking.step3.passport_expiry_date_label`)}:</span>{' '}
                      {formatDate(bookingData?.passport?.expire_date)}
                    </td>
                  </tr>

                  {/* Row 5: Company name / Referrer */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                      <span className="font-semibold">{t(`booking.step3.company_name_label`)}:</span>{' '}
                      {bookingData?.passport?.company_name || 'Other'}
                    </td>
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                      <span className="font-semibold">{t(`booking.step3.referred_by_name_label`)}:</span>{' '}
                      {bookingData?.passport?.referer_name || ''}
                    </td>
                  </tr>

                  {/* Row 6: Contact / Survey channel */}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                      <span className="font-semibold">{t(`booking.step3.contact_method_label`)}:</span>{' '}
                      {getContactMethodLabel(bookingData?.contact_method)}
                    </td>
                    <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                      <span className="font-semibold">
                        {t(`booking.step3.survey_channel_label`)}:
                      </span>{' '}
                      {getSurveyChannelLabel(bookingData?.survey_channel)}
                    </td>
                  </tr>

                  {/* Row 7: Add-ons Section */}
                  {bookingData?.add_ons && bookingData.add_ons.length > 0 && (
                    <tr>
                      <td colSpan="2" className="py-2 px-4 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                        <span className="font-semibold">{t(`booking.step3.add_ons_label`)}</span>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {bookingData.add_ons.map((addOnValue) => (
                            <li key={addOnValue}>{getAddOnLabel(addOnValue)}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reservation Service tables - dynamic width: 100% if 1 table, 50% if 2 */}
          {(bookingData?.immigration || bookingData?.emigration) && (
            <>
              <h2 className="font-semibold text-black text-base mt-6">
                {t(`booking.step3.reservation_service_label`)}
              </h2>

              <hr className="border-b-3 border-[#CBCBCB] mt-3 mb-4" />
              <div className="p-0">
                <div className={`grid gap-6 max-[640px]:gap-4 ${bookingData?.immigration && bookingData?.emigration ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Fast Track Entry column */}
                  {bookingData?.immigration && (
                    <div className="border-2 border-gray-300 overflow-hidden">
                      <div className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-semibold text-black text-center border-b border-gray-200 bg-gray-100 max-[640px]:text-sm">
                        {t(`booking.step3.immigration_fast_track_label`)}
                      </div>
                      <table className="w-full border-collapse max-[640px]:text-sm">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.immigration_fast_track_label`)}:</strong> {getImmigrationPackageLabel(bookingData.immigration.entry_fast_track_option)}
                            </td>
                          </tr>
                          {bookingData.immigration.immigration_package !== '300$' && (
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                {/* fix オプション：15分以内に入国審査手続き完了: booking.step3.use_immigration_fast_track_option_1 with string "利用する (15$)"*/}
                                <strong>{t(`booking.step3.use_immigration_fast_track_label`)}:</strong>
                                {bookingData.immigration.use_immigration_fast_track === 'true'
                                  ? t(`booking.step1.use_immigration_fast_track_option_1`)
                                  : t(`booking.step1.use_immigration_fast_track_option_0`)}
                              </td>
                            </tr>
                          )}
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.airport_label`)}:</strong> {getAirportLabel(bookingData.immigration.arrival_airport)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.arrival_date_label`)}:</strong> {formatDate(bookingData.immigration.arrival_date)}
                            </td>
                          </tr>
                          {/* Other options – same table section as 入国ファストトラック */}
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm font-semibold text-center">
                              {t(`booking.step3.other_option_label`)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">

                              <strong>{t(`booking.step3.tarmac_pickup_label`)}:</strong>{' '}
                              {bookingData.immigration.tarmac_pickup === 'true'
                                ? t(`booking.step1.use_tarmac_pickup_option_1`)
                                : t(`booking.step1.use_tarmac_pickup_option_0`)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.pickup_vehicle_label`)}:</strong> {getPickupVehicleLabel(bookingData.immigration.pickup_service)}
                            </td>
                          </tr>
                          {bookingData.immigration.arrival_phone_number && (
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.arrival_phone_number_label`)}:</strong> {bookingData.immigration.arrival_phone_number}
                              </td>
                            </tr>
                          )}
                          {bookingData.immigration.arrival_request && (
                            <tr>
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.arrival_request_label`)}:</strong> {bookingData.immigration.arrival_request}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Departure Fast Track column */}
                  {bookingData?.emigration && (
                    <div className="border-2 border-gray-300 overflow-hidden">
                      <div className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-semibold text-black text-center border-b border-gray-200 bg-gray-100 max-[640px]:text-sm">
                        {t(`booking.step3.departure_fast_track_label`)}
                      </div>
                      <table className="w-full border-collapse max-[640px]:text-sm">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.departure_fast_track_label`)}:</strong> {getEmigrationPackageLabel(bookingData.emigration.departure_fast_track_option)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.flight_reservation_code_label`)}:</strong> {bookingData.emigration.departure_flight_reservation_code}
                            </td>
                          </tr>
                          {bookingData.emigration.airline_membership_num && (
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.airline_membership_num_label`)}:</strong> {bookingData.emigration.airline_membership_num}
                              </td>
                            </tr>
                          )}
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.flight_number_label`)}:</strong> {bookingData.emigration.departure_flight_number}
                            </td>
                          </tr>
                          {bookingData.emigration.seating_pref && (
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.seating_preference_label`)}:</strong> {getSeatingPreferenceLabel(bookingData.emigration.departure_seating_preferences)}
                              </td>
                            </tr>
                          )}
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.airport_label`)}:</strong> {getAirportLabel(bookingData.emigration.departure_airport_code)}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>{t(`booking.step3.departure_date_label`)}:</strong> {formatDate(bookingData.emigration.departure_date)}
                            </td>
                          </tr>
                          {bookingData.emigration.departure_time && (
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.departure_time_label`)}:</strong> {bookingData.emigration.departure_time}
                              </td>
                            </tr>
                          )}
                          {bookingData.emigration.departure_phone_number && (
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.departure_phone_number_label`)}:</strong> {bookingData.emigration.departure_phone_number}
                              </td>
                            </tr>
                          )}
                          {bookingData.emigration.departure_request && (
                            <tr>
                              <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                                <strong>{t(`booking.step3.departure_request_label`)}:</strong> {bookingData.emigration.departure_request}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Cost Table */}

          <h2 className="text-base font-semibold text-black mt-6">{t(`booking.step3.cost_label`)}</h2>
          <hr className="border-b-3 border-[#CBCBCB] mt-3 mb-4" />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse max-[640px]:text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className={costHeaderCellClass}>No.</th>
                  <th className={costHeaderCellClass}>{t(`booking.step3.content_label`)}</th>
                  <th className={costHeaderCellClass}>{t(`booking.step3.presence_label`)}</th>
                  <th className={costHeaderCellClass}>{t(`booking.step3.amount_label`)}</th>
                </tr>
              </thead>
              <tbody>
                {immigrationItems.length > 0 ? (
                  <>
                    <tr>
                      <td colSpan="4" className={costSectionHeaderClass}>
                        {t(`booking.step3.immigration_fast_track_label`)}:
                      </td>
                    </tr>
                    {immigrationItems.map((item, index) => (
                      <tr key={`immigration-${index}`} className="border-b border-gray-200">
                        <td className={costCellBaseClass}>{item.no}</td>
                        <td className={costCellBaseClass}>{item.content}</td>
                        <td className={costCellBaseClass}>{item.presence}</td>
                        <td className={costCellRightClass}>{item.amount}</td>
                      </tr>
                    ))}
                  </>
                ) : null}

                {emigrationItems.length > 0 ? (
                  emigrationItems.map((item, index) => (
                    <tr key={`emigration-${index}`} className="border-b border-gray-200">
                      <td className={costCellBaseClass}>{item.no}</td>
                      <td className={costCellBaseClass}>{item.content}</td>
                      <td className={costCellBaseClass}>{item.presence}</td>
                      <td className={costCellRightClass}>{item.amount}</td>
                    </tr>
                  ))
                ) : null}

                {/* Subtotal */}
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="3" className={costCellBoldRightClass}>
                    {t(`booking.step3.subtotal_label`)}
                  </td>
                  <td className={costCellRightClass}>${subtotal.toFixed(2)}</td>
                </tr>

                {/* Vietjet Extra Fee */}
                {extraFee > 0 && (
                  <tr>
                    <td colSpan="3" className={costCellBoldRightClass}>
                      {t(`booking.step3.vietjet_extra_fee_label`)}
                    </td>
                    <td className={costCellRightClass}>${extraFee.toFixed(2)}</td>
                  </tr>
                )}

                {/* Coupon */}
                <tr>
                  <td colSpan="3" className={costCellBoldRightClass}>
                    {t(`booking.step3.coupon_label`)}
                  </td>
                  <td className={`${costCellRightClass} text-green-600`}>
                    - ${couponDiscount.toFixed(2)}
                  </td>
                </tr>

                {/* Total excluding tax */}
                <tr>
                  <td colSpan="3" className={costCellBoldRightClass}>
                    {t(`booking.step3.total_excluding_tax_label`)}
                  </td>
                  <td className={costCellRightClass}>${totalExcludingTax.toFixed(2)}</td>
                </tr>

                {/* VAT */}
                <tr>
                  <td colSpan="3" className={costCellBoldRightClass}>
                    {t(`booking.step3.vat_label`)}
                  </td>
                  <td className={costCellRightClass}>${vat.toFixed(2)}</td>
                </tr>

                {/* Final Total */}
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="3" className={costCellBoldRightClass}>
                    {t(`booking.step3.billed_amount_label`)}
                  </td>
                  <td className={`${costCellRightClass} text-red-600 text-xl max-[640px]:text-base font-bold`}>
                    ${billedAmount.toFixed(2)}
                  </td>
                </tr>

                {/* Payment Method */}
                {bookingData?.payment_method !== undefined && bookingData?.payment_method !== null && (
                  <tr>
                    <td colSpan="3" className={costCellBoldRightClass}>
                      {t(`booking.step3.payment_method_label`)}
                    </td>
                    <td className={costCellRightClass}>{getPaymentMethodLabel(bookingData.payment_method)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-8 mt-6 mb-2 max-[640px]:gap-2 max-[640px]:px-4 max-[640px]:pb-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 max-[640px]:px-4 max-[640px]:py-2 text-gray-500 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t(`booking.step3.back_label`)}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 max-[640px]:px-4 max-[640px]:py-2 bg-[#01ae00] text-white rounded-full hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t(`booking.step3.reserving_label`) : t(`booking.step3.reserve_label`)}
          </button>
        </div>
      </div>
      <BottomSection />
    </div>

  );
};

export default BookingStep3;
