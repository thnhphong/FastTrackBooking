import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../services/bookingService';
import ProcessIndicator from '../../components/ProcessIndicator';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import {
  getImmigrationPackageLabel,
  getEmigrationPackageLabel,
  getPickupVehicleLabel,
  getSeatingPreferenceLabel,
  getAirportLabel,
  getContactLabel,
  getSurveyChannelLabel,
  getAddOnLabel,
  getPaymentMethodLabel,
  getCountryLabel,
} from '../../utils/labelGetters';
import { formatDate } from '../../utils/formHelpers';


const BookingStep3 = ({ bookingData, onPrevStep }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');



  useScrollToTop();

  const getGenderLabel = (value) => {
    return value === 'male' ? '男性' : value === 'female' ? '女性' : value;
  };

  // Calculate cost breakdown
  const getCostBreakdown = () => {
    const breakdown = [];
    let subtotal = 0;

    if (bookingData?.immigration) {
      // 1.1 Use of pick-up vehicle
      if (bookingData.immigration.pickup_service && bookingData.immigration.pickup_service !== 0) {
        const vehiclePrices = { 1: 20, 2: 25, 3: 50 };
        const price = vehiclePrices[bookingData.immigration.pickup_service] || 0;
        if (price > 0) {
          breakdown.push({ no: '1.1', content: '迎車利用', presence: 'あり', amount: `$${price}` });
          subtotal += price;
        }
      } else {
        breakdown.push({ no: '1.1', content: '迎車利用', presence: 'なし', amount: '$0' });
      }

      // 1.2 Guaranteed immigration clearance within 15 minutes (stored as string "true"/"false")
      if (bookingData.immigration.use_immigration_fast_track === 'true') {
        breakdown.push({ no: '1.2', content: '15分以内に入国審査手続き完了', presence: 'あり', amount: '$15' });
        subtotal += 15;
      } else {
        breakdown.push({ no: '1.2', content: '15分以内に入国審査手続き完了', presence: 'なし', amount: '$0' });
      }

      // 1.3 Pick-up at the plane's exit (stored as string "true"/"false")
      if (bookingData.immigration.tarmac_pickup === 'true') {
        breakdown.push({ no: '1.3', content: "飛行機の降り口でのお迎え", presence: 'あり', amount: '$60' });
        subtotal += 60;
      } else {
        breakdown.push({ no: '1.3', content: "飛行機の降り口でのお迎え", presence: 'なし', amount: '$0' });
      }

      // 1.4 Entry Fasttrack Package
      const packagePrices = { '35$': 35, '40$': 40, '50$': 50, '300$': 300 };
      const packagePrice = packagePrices[bookingData.immigration.immigration_package] || 0;
      breakdown.push({ no: '1.4', content: '入国ファストトラックパッケージ', presence: 'あり', amount: `$${packagePrice}` });
      subtotal += packagePrice;
    }

    // 2 Full support for departures with Fasttrack
    if (bookingData?.emigration) {
      const emigrationPrices = { '50$': 50, '65$': 65, '300$': 300 };
      const emigrationPrice = emigrationPrices[bookingData.emigration.emigration_package] || 0;
      breakdown.push({ no: '2', content: '出国Fasttrackフルサポート', presence: 'あり', amount: `$${emigrationPrice}` });
      subtotal += emigrationPrice;
    }

    return { breakdown, subtotal };
  };

  // Transform bookingData to API format matching ApiJson.txt
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
    apiData.optional_company_name = bookingData?.optional_company_name || bookingData?.passport?.company_name || '';
    apiData.referred_by_name = bookingData?.referred_by_name || bookingData?.passport?.referer_name || '';

    apiData.contact_method = bookingData?.contact_method !== undefined ? String(bookingData.contact_method) : '';
    apiData.survey_channel = bookingData?.survey_channel !== undefined ? String(bookingData.survey_channel) : '';

    if (Array.isArray(bookingData?.add_ons) && bookingData.add_ons.length > 0) {
      apiData.add_ons = bookingData.add_ons.map(String).join(',');
    } else {
      apiData.add_ons = '';
    }

    if (bookingData?.immigration) {
      const arrivalAirportMap = { 0: 'SGN', 1: 'DAD', 2: 'HAN' };
      apiData.arrival_airport = bookingData.immigration.arrival_airport !== undefined
        ? (arrivalAirportMap[bookingData.immigration.arrival_airport] || String(bookingData.immigration.arrival_airport))
        : '';
      apiData.arrival_date = bookingData.immigration.arrival_date || '';
      apiData.arrival_flight_number = bookingData.immigration.arrival_flight_number || '';
      apiData.arrival_flight_reservation_code = bookingData.immigration.arrival_flight_reservation_code || '';
      apiData.arrival_phone_number = bookingData.immigration.arrival_phone_number || '';
      apiData.arrival_request = bookingData.immigration.arrival_request || '';
      apiData.entry_fast_track_option = bookingData.immigration.entry_fast_track_option !== undefined ? String(bookingData.immigration.entry_fast_track_option) : '';

      const tarmacPickupValue = bookingData.immigration.tarmac_pickup;
      apiData.tarmac_pickup = (tarmacPickupValue === 'true' || tarmacPickupValue === true || tarmacPickupValue === 1 || tarmacPickupValue === '1') ? 'true' : 'false';
      apiData.pickup_service = bookingData.immigration.pickup_service !== undefined ? String(bookingData.immigration.pickup_service) : '0';

      const useImmigrationValue = bookingData.immigration.use_immigration_fast_track;
      apiData.use_immigration_fast_track = (useImmigrationValue === 'true' || useImmigrationValue === true || useImmigrationValue === 1 || useImmigrationValue === '1') ? 'true' : 'false';
    }

    if (bookingData?.emigration) {
      const departureAirportMap = { 0: 'SGN', 1: 'DAD', 2: 'HAN' };
      apiData.departure_airport_code = bookingData.emigration.departure_airport_code !== undefined
        ? (departureAirportMap[bookingData.emigration.departure_airport_code] || String(bookingData.emigration.departure_airport_code))
        : '';
      apiData.departure_date = bookingData.emigration.departure_date || '';
      apiData.departure_flight_number = bookingData.emigration.departure_flight_number || '';
      apiData.departure_flight_reservation_code = bookingData.emigration.departure_flight_reservation_code || '';
      apiData.departure_phone_number = bookingData.emigration.departure_phone_number || '';
      apiData.departure_request = bookingData.emigration.departure_request || '';
      apiData.departure_fast_track_option = bookingData.emigration.departure_fast_track_option !== undefined
        ? String(bookingData.emigration.departure_fast_track_option)
        : '';
      apiData.departure_seating_preferences = bookingData.emigration.departure_seating_preferences !== undefined ? String(bookingData.emigration.departure_seating_preferences) : '';
      apiData.departure_time = bookingData.emigration.departure_time || '';

      if (bookingData.emigration.departure_fast_track_option === 1 || bookingData.emigration.departure_fast_track_option === '1') {
        apiData.use_departure_fast_track = '1';
      } else {
        apiData.use_departure_fast_track = '0';
      }
    }

    // Payment and pricing - calculated with extra fee
    apiData.payment_method = bookingData?.payment_method !== undefined ? String(bookingData.payment_method) : '1';
    apiData.coupon = bookingData?.coupon || null;
    apiData.coupon_discount_amount = bookingData?.coupon_discount_amount || null;
    apiData.has_coupon_discount = bookingData?.has_coupon_discount || false;
    apiData.amount_after_coupon = bookingData?.amount_after_coupon || null;
    apiData.preliminary_calculation = bookingData?.preliminary_calculation || subtotal.toFixed(2);
    apiData.tax = bookingData?.tax || vat.toFixed(2);
    apiData.total = bookingData?.total || billedAmount.toFixed(2);

    // Clean up empty fields
    Object.keys(apiData).forEach(key => {
      if (apiData[key] === '' || apiData[key] === null || apiData[key] === undefined) {
        delete apiData[key];
      }
    });

    // Sort keys
    const sortedApiData = {};
    Object.keys(apiData).sort().forEach(key => {
      sortedApiData[key] = apiData[key];
    });

    return sortedApiData;
  };

  const handleBack = () => {
    if (onPrevStep) {
      onPrevStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const submitData = prepareApiData();
      console.log(submitData);
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
  const subtotal = parseFloat(bookingData?.sub_price || costData.subtotal || 0);
  const isVietjetDeparture = bookingData?.emigration?.departure_flight_number?.toUpperCase().startsWith('VJ');
  const extraFee = isVietjetDeparture ? 15 : 0;
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

  return (
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
            利用者の情報
          </h2>
          <div className="p-0">
            <table className="w-full border-collapse max-[640px]:text-sm">
              <tbody>
                {/* Row 1: Last name & First name / Gender & DOB */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-semibold">性:</span>{' '}
                    {bookingData?.passport?.last_name}{' '}
                    <span className="font-semibold ml-4 max-[640px]:ml-2">名:</span>{' '}
                    {bookingData?.passport?.first_name}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-semibold">性別:</span>{' '}
                    {getGenderLabel(bookingData?.passport?.gender)}{' '}
                    <span className="font-semibold ml-6 max-[640px]:ml-2">生年月日:</span>{' '}
                    {formatDate(bookingData?.passport?.birthday)}
                  </td>
                </tr>

                {/* Row 2: Phone number & Nationality */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-semibold">国コード 付電話番号:</span>{' '}
                    {bookingData?.user_phone_number}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-semibold">国籍:</span>{' '}
                    {getCountryLabel(
                      bookingData?.nationality || bookingData?.passport?.nationality
                    )}
                  </td>
                </tr>

                {/* Row 3: Email / CC Email */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-semibold">案内を受け取るためのメールアドレス:</span>{' '}
                    <span className="break-all">{bookingData?.passport?.email}</span>
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-semibold">CCを希望されるメールアドレス:</span>{' '}
                    <span className="break-all">{bookingData?.passport?.email_cc || ''}</span>
                  </td>
                </tr>

                {/* Row 4: Passport No / Passport Expiration */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-semibold">パスポート No.:</span>{' '}
                    {bookingData?.passport?.passport_num}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-semibold">パスポートの有効期限満了日:</span>{' '}
                    {formatDate(bookingData?.passport?.expire_date)}
                  </td>
                </tr>

                {/* Row 5: Company name / Referrer */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-semibold">会社名:</span>{' '}
                    {bookingData?.passport?.company_name || 'Other'}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-semibold">ご紹介の方のお名前:</span>{' '}
                    {bookingData?.passport?.referer_name || ''}
                  </td>
                </tr>

                {/* Row 6: Contact / Survey channel */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-semibold">Line OA追加:</span>{' '}
                    {getContactLabel(bookingData?.contact_method)}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-semibold">
                      本アンケートをどのチャンネルから知りましたか？:
                    </span>{' '}
                    {getSurveyChannelLabel(bookingData?.survey_channel)}
                  </td>
                </tr>

                {/* Row 7: Add-ons Section */}
                {bookingData?.add_ons && bookingData.add_ons.length > 0 && (
                  <tr>
                    <td colSpan="2" className="py-2 px-4 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                      <span className="font-semibold">以下のサービスについての無料相談をご希望しませんか。</span>
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
              ご予約サービス
            </h2>

            <hr className="border-b-3 border-[#CBCBCB] mt-3 mb-4" />
            <div className="p-0">
              <div className={`grid gap-6 max-[640px]:gap-4 ${bookingData?.immigration && bookingData?.emigration ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Fast Track Entry column */}
                {bookingData?.immigration && (
                  <div className="border-2 border-gray-300 overflow-hidden">
                    <div className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-semibold text-black text-center border-b border-gray-200 bg-gray-100 max-[640px]:text-sm">
                      入国ファストトラック
                    </div>
                    <table className="w-full border-collapse max-[640px]:text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>入国ファストトラック:</strong> {getImmigrationPackageLabel(bookingData.immigration.entry_fast_track_option)}
                          </td>
                        </tr>
                        {bookingData.immigration.immigration_package !== '300$' && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>オプション：15分以内に入国審査手続き完了ン:</strong> {bookingData.immigration.use_immigration_fast_track === 'true' ? '利用する (15$)' : '利用しない'}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>ご利用の対象空港:</strong> {getAirportLabel(bookingData.immigration.arrival_airport)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>到着日:</strong> {formatDate(bookingData.immigration.arrival_date)}
                          </td>
                        </tr>
                        {/* Other options – same table section as 入国ファストトラック */}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm font-semibold text-center">
                            他のオプション
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>飛行機の降り口でお迎え (60$):</strong> {bookingData.immigration.tarmac_pickup === 'true' ? 'ご利用する (60$)' : '利用しない'}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>迎車利用:</strong> {getPickupVehicleLabel(bookingData.immigration.pickup_service)}
                          </td>
                        </tr>
                        {bookingData.immigration.arrival_phone_number && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>お迎えのベトナム語を話せる方の電話番号（任意）:</strong> {bookingData.immigration.arrival_phone_number}
                            </td>
                          </tr>
                        )}
                        {bookingData.immigration.arrival_request && (
                          <tr>
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>迎えや見送りの他のご希望があればご記入くださいませ。</strong> {bookingData.immigration.arrival_request}
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
                      出国ファストトラック
                    </div>
                    <table className="w-full border-collapse max-[640px]:text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>出国ファストトラック:</strong> {getEmigrationPackageLabel(bookingData.emigration.departure_fast_track_option)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>フライトの予約番号や予約コード:</strong> {bookingData.emigration.departure_flight_reservation_code}
                          </td>
                        </tr>
                        {bookingData.emigration.airline_membership_num && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>運行航空の会員番号やマイレージ番号（あれば）:</strong> {bookingData.emigration.airline_membership_num}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>便・フライトNo.:</strong> {bookingData.emigration.departure_flight_number}
                          </td>
                        </tr>
                        {bookingData.emigration.seating_pref && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>席のご希望（出来るだけアレンジしますが、ご希望を応えない場合もあります）:</strong> {getSeatingPreferenceLabel(bookingData.emigration.departure_seating_preferences)}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>ご利用の対象空港:</strong> {getAirportLabel(bookingData.emigration.departure_airport_code)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>出発日:</strong> {formatDate(bookingData.emigration.departure_date)}
                          </td>
                        </tr>
                        {bookingData.emigration.departure_time && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>出発空港での待ち合わせご希望時間（出発の３時間前からご指定可）:</strong> {bookingData.emigration.departure_time}
                            </td>
                          </tr>
                        )}
                        {bookingData.emigration.departure_phone_number && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>お見送りのベトナム語を話せる方の電話番号（任意）:</strong> {bookingData.emigration.departure_phone_number}
                            </td>
                          </tr>
                        )}
                        {bookingData.emigration.departure_request && (
                          <tr>
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>他のご希望があればご記入くださいませ。</strong> {bookingData.emigration.departure_request}
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

        <h2 className="text-base font-semibold text-black mt-6">料金</h2>
        <hr className="border-b-3 border-[#CBCBCB] mt-3 mb-4" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse max-[640px]:text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-left font-semibold text-black text-base max-[640px]:text-sm">No.</th>
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-left font-semibold text-black text-base max-[640px]:text-sm">内容</th>
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-left font-semibold text-black text-base max-[640px]:text-sm">有無</th>
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">金額</th>
              </tr>
            </thead>
            <tbody>
              {/* Existing breakdown rows */}
              {bookingData?.immigration && costData.breakdown.filter(item => item.no.startsWith('1.')).length > 0 && (
                <>
                  <tr>
                    <td colSpan="4" className="py-2 px-4 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm bg-gray-100">
                      入国ファストトラック:
                    </td>
                  </tr>
                  {costData.breakdown
                    .filter(item => item.no.startsWith('1.'))
                    .map((item, index) => (
                      <tr key={`immigration-${index}`} className="border-b border-gray-200">
                        <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.no}</td>
                        <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.content}</td>
                        <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.presence}</td>
                        <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right text-black text-base max-[640px]:text-sm">{item.amount}</td>
                      </tr>
                    ))}
                </>
              )}

              {bookingData?.emigration && costData.breakdown.some(item => item.no === '2') && (
                costData.breakdown
                  .filter(item => item.no === '2')
                  .map((item, index) => (
                    <tr key={`emigration-${index}`} className="border-b border-gray-200">
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.no}</td>
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.content}</td>
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.presence}</td>
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right text-black text-base max-[640px]:text-sm">{item.amount}</td>
                    </tr>
                  ))
              )}

              {/* Subtotal */}
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                  小計
                </td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">
                  ${subtotal.toFixed(2)}
                </td>
              </tr>

              {/* Vietjet Extra Fee */}
              {extraFee > 0 && (
                <tr>
                  <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                    Vietjet Airの追加料金
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">
                    ${extraFee.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* Coupon */}
              <tr>
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                  クーポン
                </td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-green-600 text-base max-[640px]:text-sm">
                  - ${appliedDiscount.toFixed(2)}
                </td>
              </tr>

              {/* Total excluding tax */}
              <tr>
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                  合計（税抜き）
                </td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">
                  ${totalExcludingTax.toFixed(2)}
                </td>
              </tr>

              {/* VAT */}
              <tr>
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                  消費税 VAT(8%)
                </td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">
                  ${vat.toFixed(2)}
                </td>
              </tr>

              {/* Final Total */}
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                  請求額
                </td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-red-600 text-xl max-[640px]:text-base">
                  ${billedAmount.toFixed(2)}
                </td>
              </tr>

              {/* Payment Method */}
              {bookingData?.payment_method && (
                <tr>
                  <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">
                    お支払い方法
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">
                    {getPaymentMethodLabel(bookingData.payment_method)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 max-[640px]:gap-2 max-[640px]:px-4 max-[640px]:pb-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="px-6 py-3 max-[640px]:px-4 max-[640px]:py-2 text-gray-500 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 max-[640px]:px-4 max-[640px]:py-2 bg-[#01ae00] text-white rounded-full hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '予約中...' : '予約する'}
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;

