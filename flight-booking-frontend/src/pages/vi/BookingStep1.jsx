import { useState } from 'react';
import PriceBar from '../../components/PriceBar';
import ProcessIndicator from '../../components/ProcessIndicator';
import Error from '../../components/Error';
import FieldRequired from '../../components/FieldRequired';
import JapaneseDatePicker from '../../components/JapaneseDatePicker';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { airports, immigrationPackages, emigrationPackages, pickupVehicles, seatingPreferences } from '../../constants/bookingOptions';
import { isInputEmpty } from '../../utils/formHelpers';

const BookingStep1 = ({ bookingData, setBookingData, onNextStep }) => {
  useScrollToTop();
  const [formData, setFormData] = useState({
    // Immigration
    useImmigration: bookingData?.immigration ? true : false,
    entry_fast_track_option: typeof bookingData?.immigration?.entry_fast_track_option === 'number' ? bookingData.immigration.entry_fast_track_option : 0, // 0..3
    arrival_flight_reservation_code: bookingData?.immigration?.arrival_flight_reservation_code ?? '',
    arrival_flight_number: bookingData?.immigration?.arrival_flight_number ?? '',
    arrival_airport: typeof bookingData?.immigration?.arrival_airport === 'number' ? bookingData.immigration.arrival_airport : (bookingData?.immigration?.arrival_airport !== undefined && bookingData?.immigration?.arrival_airport !== null ? Number(bookingData.immigration.arrival_airport) : ''),
    arrival_date: bookingData?.immigration?.arrival_date ?? '',
    // Store as strings like pickup_service, not booleans
    tarmac_pickup: (bookingData?.immigration?.tarmac_pickup === 'true' || bookingData?.immigration?.tarmac_pickup === true || bookingData?.immigration?.tarmac_pickup === 1) ? 'true' : 'false',
    use_immigration_fast_track: (bookingData?.immigration?.use_immigration_fast_track === 'true' || bookingData?.immigration?.use_immigration_fast_track === true || bookingData?.immigration?.use_immigration_fast_track === 1) ? 'true' : 'false',
    pickup_service: typeof bookingData?.immigration?.pickup_service === 'number'
      ? String(bookingData.immigration.pickup_service)
      : (bookingData?.immigration?.pickup_service ? String(bookingData.immigration.pickup_service) : '0'),
    arrival_phone_number: bookingData?.immigration?.arrival_phone_number ?? '',
    arrival_request: bookingData?.immigration?.arrival_request ?? '',
    useOtherOptions: bookingData?.immigration?.useOtherOptions === true ||
      bookingData?.immigration?.useOtherOptions === 'true' ||
      // Auto-check if pickup_service is not 0 or tarmac_pickup is true
      (bookingData?.immigration?.pickup_service && bookingData.immigration.pickup_service !== 0) ||
      bookingData?.immigration?.tarmac_pickup === 'true' ||
      bookingData?.immigration?.tarmac_pickup === true
      ? true : false,

    // Emigration
    useEmigration: bookingData?.emigration ? true : false,
    departure_fast_track_option: typeof bookingData?.emigration?.departure_fast_track_option === 'number' ? bookingData.emigration.departure_fast_track_option : 0, // 0..1
    departure_flight_reservation_code: bookingData?.emigration?.departure_flight_reservation_code ?? '',
    airline_membership_num: bookingData?.emigration?.airline_membership_num ?? '',
    departure_airport_code: typeof bookingData?.emigration?.departure_airport_code === 'number' ? bookingData.emigration.departure_airport_code : (bookingData?.emigration?.departure_airport_code !== undefined && bookingData?.emigration?.departure_airport_code !== null ? Number(bookingData.emigration.departure_airport_code) : ''),
    departure_seating_preferences: typeof bookingData?.emigration?.departure_seating_preferences === 'number' ? bookingData.emigration.departure_seating_preferences : (bookingData?.emigration?.departure_seating_preferences !== undefined && bookingData?.emigration?.departure_seating_preferences !== null ? Number(bookingData.emigration.departure_seating_preferences) : ''),
    departure_phone_number: bookingData?.emigration?.departure_phone_number ?? '',
    departure_request: bookingData?.emigration?.departure_request ?? '',
    departure_date: bookingData?.emigration?.departure_date ?? '',
    departure_time: bookingData?.emigration?.departure_time ?? '',
    departure_flight_number: bookingData?.emigration?.departure_flight_number ?? '',
    sameAsEntry: false, // Track if "Same as entry" checkbox is checked
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Auto-select first package when checkbox is checked
    if (type === 'checkbox' && name === 'useImmigration' && checked && formData.entry_fast_track_option === '') {
      setFormData(prev => ({
        ...prev,
        [name]: Boolean(checked), // Ensure boolean
        entry_fast_track_option: 0, // Auto-select first option
      }));
      return;
    }

    if (type === 'checkbox' && name === 'useEmigration' && checked && formData.departure_fast_track_option === '') {
      setFormData(prev => ({
        ...prev,
        [name]: Boolean(checked), // Ensure boolean
        departure_fast_track_option: 0, // Auto-select first option
      }));
      return;
    }

    // If unchecking, reset package selection
    if (type === 'checkbox' && name === 'useImmigration' && !checked) {
      setFormData(prev => ({
        ...prev,
        [name]: Boolean(checked), // Ensure boolean
        entry_fast_track_option: 0, // Reset to first option
      }));
      return;
    }

    if (type === 'checkbox' && name === 'useEmigration' && !checked) {
      setFormData(prev => ({
        ...prev,
        [name]: Boolean(checked), // Ensure boolean
        departure_fast_track_option: 0, // Reset to first option
      }));
      return;
    }

    // If selecting 300$ package (index 3), disable use_immigration_fast_track and hide the option
    if (name === 'use_immigration_fast_track' && Number(value) === 3) {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value),
        use_immigration_fast_track: 'false', // Disable when 300$ is selected
      }));
      return;
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]:
          type === 'checkbox'
            ? Boolean(checked) // Ensure checkbox values are always boolean
            : ['pickup_service', 'entry_fast_track_option', 'departure_fast_track_option', 'arrival_airport', 'departure_airport_code', 'seating_pref', 'departure_seating_preferences'].includes(
              name
            )
              ? Number(value)
              : value,
      };

      // If "Same as entry" is checked and immigration flight_reservation_num changes, update emigration
      if (name === 'arrival_flight_reservation_code' && prev.sameAsEntry && prev.useImmigration) {
        updated.departure_flight_reservation_code = updated.arrival_flight_reservation_code;
      }

      // If user manually edits emigration flight reservation, uncheck "Same as entry"
      if (name === 'departure_flight_reservation_code' && prev.sameAsEntry) {
        updated.sameAsEntry = false;
      }

      return updated;
    });
  };

  // Handle "Same as entry" checkbox for emigration flight reservation
  const handleSameAsEntry = (checked) => {
    if (checked && formData.useImmigration && formData.arrival_flight_reservation_code) {
      // When checked: copy immigration flight reservation to emigration
      setFormData(prev => ({
        ...prev,
        departure_flight_reservation_code: prev.arrival_flight_reservation_code,
        sameAsEntry: true,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        departure_flight_reservation_code: '',
        sameAsEntry: false,
      }));
    }
  };

  const handlePriceUpdate = (priceData) => {
    setBookingData(prev => ({
      ...prev,
      ...priceData,
    }));
  };

  const handleNext = () => {
    if (!validateForm()) {
      setShowError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowError(false);
    const updatedData = {
      ...bookingData,
      immigration: formData.useImmigration ? {
        entry_fast_track_option: formData.entry_fast_track_option,
        arrival_flight_reservation_code: formData.arrival_flight_reservation_code,
        arrival_flight_number: formData.arrival_flight_number,
        arrival_airport: formData.arrival_airport,
        arrival_date: formData.arrival_date,
        // Already stored as strings "true"/"false"
        tarmac_pickup: formData.tarmac_pickup || 'false',
        use_immigration_fast_track: formData.use_immigration_fast_track || 'false',
        pickup_service: formData.pickup_service,
        arrival_phone_number: formData.arrival_phone_number,
        arrival_request: formData.arrival_request,
        // Persist \"他のオプション\" checkbox state so it remains checked when returning to Step 1
        useOtherOptions: formData.useOtherOptions,
      } : null,
      emigration: formData.useEmigration ? {
        departure_fast_track_option: formData.departure_fast_track_option,
        departure_flight_reservation_code: formData.departure_flight_reservation_code,
        departure_flight_number: formData.departure_flight_number,
        airline_membership_num: formData.airline_membership_num,
        departure_airport_code: formData.departure_airport_code,
        departure_seating_preferences: formData.departure_seating_preferences,
        departure_phone_number: formData.departure_phone_number,
        departure_request: formData.departure_request,
        departure_date: formData.departure_date,
        departure_time: formData.departure_time,
      } : null,
      type: formData.useImmigration && formData.useEmigration ? 'both' :
        formData.useImmigration ? 'immigration' : 'emigration',
    };

    setBookingData(updatedData);
    if (onNextStep) {
      onNextStep();
    }
  };

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  // Helper function to check if input is empty and should show red label

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (formData.useImmigration) {
      if (formData.entry_fast_track_option === '' || formData.entry_fast_track_option === null || formData.entry_fast_track_option === undefined) {
        newErrors.entry_fast_track_option = 'Please select an immigration package';
      }

      if (!formData.arrival_flight_reservation_code || !formData.arrival_flight_reservation_code.trim()) {
        newErrors.arrival_flight_reservation_code = 'This field is required';
      }
      if (!formData.arrival_flight_number || !formData.arrival_flight_number.trim()) {
        newErrors.arrival_flight_number = 'This field is required';
      }
      if (!formData.arrival_date) {
        newErrors.arrival_date = 'This field is required';
      }
      if (formData.arrival_airport === '' || formData.arrival_airport === null || formData.arrival_airport === undefined) {
        newErrors.arrival_airport = 'This field is required';
      }
      // Always validate use_immigration_fast_track for non-300$ packages (not part of "Other options")
      if (formData.entry_fast_track_option !== 3 && (!formData.use_immigration_fast_track || formData.use_immigration_fast_track === '')) {
        newErrors.use_immigration_fast_track = 'This field is required';
      }
      // Only validate pickup_service if "Other options" is checked
      if (formData.useOtherOptions && (formData.pickup_service === null || formData.pickup_service === undefined)) {
        newErrors.pickup_service = 'This field is required';
      }
    }

    if (formData.useEmigration) {
      if (formData.departure_fast_track_option === '' || formData.departure_fast_track_option === null || formData.departure_fast_track_option === undefined) {
        newErrors.departure_fast_track_option = 'Please select an emigration package';
      }
      if (!formData.departure_flight_reservation_code || !formData.departure_flight_reservation_code.trim()) {
        newErrors.departure_flight_reservation_code = 'This field is required';
      }
      if (!formData.departure_flight_number || !formData.departure_flight_number.trim()) {
        newErrors.departure_flight_number = 'This field is required';
      }
      if (!formData.departure_date) {
        newErrors.departure_date = 'This field is required';
      }
      if (formData.departure_airport_code === '' || formData.departure_airport_code === null || formData.departure_airport_code === undefined) {
        newErrors.departure_airport_code = 'This field is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (

    <div className="min-h-screen bg-white">
      <div className="w-full custom:max-w-[1140px] px-4 py-8 pb-32 text-left border border-gray-200 rounded-lg">
        <ProcessIndicator currentStep={1} />
        <div className="border-b-1 border-[#CBCBCB] my-4" />

        {/* Error Message */}
        <Error message={showError ? "There Is A Problem With Your Answer. Please Check The Fields Below." : null} />
        {/* Information Box */}
        <div className="mb-6 p-4 text-left flex-col justify-center">
          <div className="flex flex-col text-[15px] text-gray-700 text-center mb-6">
            <p>
              ✔️アカウント登録不要 ✔️パスポート写真送付不要 ✔️丁寧に対応 ✔️当日予約可
            </p>
            <p>✔️日本語24時間対応 ✔️夜間・早朝の追加料無 ✔️予約簡単 ✔️日本語領収書発行可</p>
            <p className="text-red-600 underline text-center">
              <a href="https://vietnam-fasttrack.com/vjp-fasttrack-december-esim-campaign/?_gl=1*atd23l*_gcl_au*MTk5MDI3MTkzOS4xNzY0MDQ3NDEyLjE4OTg5OTIyNjAuMTc2NTgwMzE3Mi4xNzY1ODAzMTcy" target='_blank'>🎁高速データ通信 eSIM（30GB/5日・10USD相当）を今だけ無料プレゼント！詳細はこちら</a>
            </p>
          </div>

          {/* line esim */}
          <div className="flex flex-col text-[15px] font-bold text-right text-blue-700 underline">
            <a href="https://vietjapan.vip/line-chat/" target='_blank'>📱LINE予約でeSIMプレゼント＞＞</a>
          </div>

        </div>
        {/* Your desired service */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-4 text-left">ご希望のサービス</h2>
          {/* Immigration Checkbox */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="useImmigration"
                checked={Boolean(formData.useImmigration)}
                onChange={handleInputChange}
                className="w-5 h-5 mr-3 text-blue-600 border-gray-300 rounded focus:outline-none"
              />
              <span className="text-black text-base"> 入国ファストトラックのご利用（35$～）</span>
            </label>
          </div>

          {/* Immigration Form - Show when checked */}
          {formData.useImmigration && (
            //make the div bigger 
            <div className="mb-6 w-full">
              <hr className="border-b-4 border-[#CBCBCB] my-8" />
              {/* Immigration Package and Complete within 15 minutes group using cols-2*/}
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-4">
                <div className="mb-6">
                  <FieldRequired label="入国ファストトラックパッケージ" required={true} error={errors.entry_fast_track_option} isEmpty={formData.entry_fast_track_option === '' || formData.entry_fast_track_option === null || formData.entry_fast_track_option === undefined}>
                    <fieldset className="space-y-2 w-[98%] border-none p-0 m-0">
                      {immigrationPackages.map(pkg => (
                        <label key={pkg.value} className="flex items-start cursor-pointer text-start">
                          <input
                            type="radio"
                            name="entry_fast_track_option"
                            value={pkg.value}
                            checked={formData.entry_fast_track_option === pkg.value || formData.entry_fast_track_option === String(pkg.value)}
                            onChange={handleInputChange}
                            required={formData.useImmigration}
                            className="mt-1 w-4 h-4 focus:outline-none cursor-pointer text-blue-600 border-gray-300"
                          />
                          <span className="ml-3 text-base text-left text-black">{pkg.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  </FieldRequired>
                </div>
                {/* Only show "Complete within 15 min" option for first 3 packages (not 300$) - always visible, not part of "Other options" */}
                {formData.entry_fast_track_option !== 3 && (
                  <div className="mt-6">
                    <FieldRequired
                      label="オプション：15分以内に入国審査手続き完了"
                      required={true}
                      error={errors.use_immigration_fast_track}
                      isEmpty={!formData.use_immigration_fast_track || formData.use_immigration_fast_track === ''}
                    >
                      <fieldset className="space-y-2 border-none p-0 m-0">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="use_immigration_fast_track"
                            value="false"
                            checked={formData.use_immigration_fast_track === 'false'}
                            onChange={() => {
                              if (errors.use_immigration_fast_track) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.use_immigration_fast_track;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, use_immigration_fast_track: 'false' }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.use_immigration_fast_track && (!formData.use_immigration_fast_track || formData.use_immigration_fast_track === '') ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.use_immigration_fast_track && formData.use_immigration_fast_track === undefined ? 'text-[#c02b0b]' : 'text-black'}`}>利用しない</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="use_immigration_fast_track"
                            value="true"
                            checked={formData.use_immigration_fast_track === 'true'}
                            onChange={() => {
                              if (errors.use_immigration_fast_track) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.use_immigration_fast_track;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, use_immigration_fast_track: 'true' }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.use_immigration_fast_track && (!formData.use_immigration_fast_track || formData.use_immigration_fast_track === '') ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.use_immigration_fast_track && formData.use_immigration_fast_track === undefined ? 'text-[#c02b0b]' : 'text-black'}`}>利用する (15$)</span>
                        </label>
                        <p className="text-md text-[#1362cb] mt-2 text-left">
                          ※「外交官専用レーン」をご利用することで最短に入国手続きが終わります。15分以上かかる場合、15$が返金されます。お預かり荷物のない方にはおすすめです。
                        </p>
                      </fieldset>
                    </FieldRequired>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <FieldRequired
                    label="フライトの予約番号や予約コード"
                    required={true}
                    error={errors.arrival_flight_reservation_code}
                    isEmpty={isInputEmpty(formData.arrival_flight_reservation_code)}
                  >
                    <input
                      type="text"
                      name="arrival_flight_reservation_code"
                      value={formData.arrival_flight_reservation_code ?? ''}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="予約番号や予約コード"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border text-base border-[#f2f2f2] rounded-lg focus:outline-none ${errors.arrival_flight_reservation_code ? 'border-[#c02b0b]' : 'border-[#b98d5d]'
                        }`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="便・フライトNo."
                    required={true}
                    error={errors.arrival_flight_number}
                    isEmpty={isInputEmpty(formData.arrival_flight_number)}
                  >
                    <input
                      type="text"
                      name="arrival_flight_number"
                      value={formData.arrival_flight_number ?? ''}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="VN000"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border text-base border-[#f2f2f2] rounded-lg focus:outline-none ${errors.arrival_flight_number ? 'border-[#c02b0b]' : 'border-[#b98d5d]'
                        }`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired label="ご利用の対象空港" required={true} error={errors.arrival_airport} isEmpty={formData.arrival_airport === '' || formData.arrival_airport === null || formData.arrival_airport === undefined}>
                    <fieldset className="space-y-2 border-none p-0 m-0">
                      {airports.map(airport => (
                        <label key={airport.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="arrival_airport"
                            value={airport.value}
                            checked={formData.arrival_airport === airport.value || formData.arrival_airport === String(airport.value)}
                            onChange={handleInputChange}
                            required={formData.useImmigration}
                            className="w-4 h-4 focus:outline-none cursor-pointer text-blue-600 border-gray-300"
                          />
                          <span className="ml-3 text-base text-left text-black">{airport.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="到着日"
                    required={true}
                    error={errors.arrival_date}
                    isEmpty={isInputEmpty(formData.arrival_date)}
                  >
                    <JapaneseDatePicker
                      name="arrival_date"
                      value={formData.arrival_date ?? ''}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="年 / 月 / 日"
                      minDate={new Date()}
                      className={`w-full md:w-[60%] lg:w-[40%] text-center px-4 py-3 bg-[#a3e7a3] border placeholder-gray-400 text-base border-[#f2f2f2] rounded-lg focus:outline-none ${errors.arrival_date ? 'border-[#c02b0b]' : 'border-[#b98d5d]'
                        }`}
                      error={errors.arrival_date}
                    />
                  </FieldRequired>
                </div>
              </div>


              {/* Other options toggle */}
              <div className="mt-6 ">
                <label className="flex items-center cursor-pointer text-left ">
                  <input
                    type="checkbox"
                    name="useOtherOptions"
                    checked={Boolean(formData.useOtherOptions)}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:outline-none"
                  />
                  <span className="ml-3 text-base text-black">他のオプション</span>
                </label>
              </div>

              {/* Additional options shown only when "Other options" is enabled */}
              {formData.useOtherOptions && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 max-[640px]:grid-cols-1 gap-6 max-[640px]:gap-4 p-4 max-[640px]:px-8">
                  {/* Column 1: Pickup at airplane exit */}
                  <div>
                    <FieldRequired
                      label="飛行機の降り口（または飛行機からバスで到着した場所）でお迎えのご利用を選択してください: (必須)"
                      required={true}
                      error={errors.tarmac_pickup}
                      isEmpty={formData.tarmac_pickup === 'false'}
                    >
                      {/* with max-w-[640px] => make tarmac_pickup into 2 cols*/}
                      <fieldset className="space-y-2 border-none p-0 m-0 max-[640px]:grid grid-cols-2 gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tarmac_pickup"
                            value="false"
                            checked={formData.tarmac_pickup === 'false'}
                            onChange={() => {
                              if (errors.tarmac_pickup) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.tarmac_pickup;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, tarmac_pickup: 'false' }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.tarmac_pickup && formData.tarmac_pickup === 'false' ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.tarmac_pickup && formData.tarmac_pickup === false ? 'text-[#c02b0b]' : 'text-black'}`}>利用しない</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tarmac_pickup"
                            value="true"
                            checked={formData.tarmac_pickup === 'true'}
                            onChange={() => {
                              if (errors.tarmac_pickup) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.tarmac_pickup;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, tarmac_pickup: 'true' }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.tarmac_pickup && formData.tarmac_pickup === 'false' ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.tarmac_pickup && formData.tarmac_pickup === false ? 'text-[#c02b0b]' : 'text-black'}`}>ご利用する (60$)</span>
                        </label>
                      </fieldset>
                    </FieldRequired>
                  </div>

                  {/* Column 2: Pickup vehicle use */}
                  <div>
                    <FieldRequired
                      label="迎車利用 (必須)"
                      required={true}
                      error={errors.pickup_service}
                      isEmpty={formData.pickup_service === null || formData.pickup_service === undefined}
                    >
                      <fieldset className="space-y-2 grid grid-cols-2 max-[640px]:grid-cols-1 gap-4 max-[640px]:gap-0 border-none p-0 m-0">
                        {pickupVehicles.map(vehicle => (
                          <label key={vehicle.value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="pickup_service"
                              value={vehicle.value}
                              checked={formData.pickup_service === String(vehicle.value) || Number(formData.pickup_service) === vehicle.value}
                              onChange={handleInputChange}
                              required={formData.useOtherOptions}
                              className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.pickup_service && !formData.pickup_service ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                            />
                            <span className={`ml-3 text-base text-left ${errors.pickup_service && !formData.pickup_service ? 'text-[#c02b0b]' : 'text-black'}`}>
                              {vehicle.label}
                            </span>
                          </label>
                        ))}
                      </fieldset>
                    </FieldRequired>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    お迎えのベトナム語を話せる方の電話番号（任意）
                  </label>
                  <input
                    type="text"
                    name="arrival_phone_number"
                    value={formData.arrival_phone_number ?? ''}
                    onChange={handleInputChange}
                    className="text-center w-full px-4 py-3 bg-[#a3e7a3] border text-base 
                    border-[#f2f2f2] rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    他のご希望があればご記入くださいませ。
                  </label>
                  <textarea
                    name="arrival_request"
                    value={formData.arrival_request ?? ''}
                    onChange={handleInputChange}
                    rows={1}
                    className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                  />
                </div>
              </div>
            </div>
          )}

          <hr className="border-b-4 border-[#CBCBCB] my-8" />

          {/* Emigration Checkbox */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="useEmigration"
                checked={Boolean(formData.useEmigration)}
                onChange={handleInputChange}
                className="w-5 h-5 mr-3 text-blue-600 border-gray-300 rounded focus:outline-none"
              />
              <span className="text-black text-base">出国ファストトラックのご利用(50$～)</span>
            </label>
          </div>

          <hr className="border-b-4 border-[#CBCBCB] my-8" />

          {/* Emigration Form - Show when checked */}
          {formData.useEmigration && (
            <div className="mb-6 w-full">
              <div className="mb-6">
                <FieldRequired label="出国Fasttrack" required={true} error={errors.departure_fast_track_option} isEmpty={formData.departure_fast_track_option === '' || formData.departure_fast_track_option === null || formData.departure_fast_track_option === undefined}>
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    {emigrationPackages.map(pkg => (
                      <label key={pkg.value} className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="departure_fast_track_option"
                          value={pkg.value}
                          checked={formData.departure_fast_track_option === pkg.value || formData.departure_fast_track_option === String(pkg.value)}
                          onChange={handleInputChange}
                          required={formData.useEmigration}
                          className="mt-1 w-4 h-4 focus:outline-none cursor-pointer text-blue-600 border-gray-300"
                        />
                        <span className="ml-3 text-base text-left text-black">{pkg.label}</span>
                      </label>
                    ))}
                  </fieldset>
                </FieldRequired>
              </div>

              <fieldset className="ml-0 mb-2 md:ml-[36%] md:mb-[-2%] flex relative whitespace-nowrap border-none p-0 m-0">
                <label className="flex items-center text-base text-black whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.sameAsEntry)}
                    onChange={(e) => handleSameAsEntry(Boolean(e.target.checked))}
                    disabled={!formData.useImmigration || !formData.arrival_flight_reservation_code}
                    className="w-4 h-4 mr-1 text-blue-600 border-gray-300 rounded focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  入国と同じ
                </label>
              </fieldset>



              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <FieldRequired
                    label="フライトの予約番号や予約コード"
                    required={true}
                    error={errors.departure_flight_reservation_code}
                    isEmpty={isInputEmpty(formData.departure_flight_reservation_code)}
                  >
                    <input
                      type="text"
                      name="departure_flight_reservation_code"
                      value={formData.departure_flight_reservation_code ?? ''}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="予約番号や予約コード"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.departure_flight_reservation_code ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="便・フライトNo."
                    required={true}
                    error={errors.departure_flight_number}
                    isEmpty={isInputEmpty(formData.departure_flight_number)}
                  >
                    <input
                      type="text"
                      name="departure_flight_number"
                      value={formData.departure_flight_number ?? ''}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="VN999"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.departure_flight_number ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired label="ご利用の対象空港" required={true} error={errors.departure_airport_code} isEmpty={formData.departure_airport_code === '' || formData.departure_airport_code === null || formData.departure_airport_code === undefined}>
                    <fieldset className="space-y-2 max-[640px]:space-y-0 border-none p-0 m-0">
                      {airports.map(airport => (
                        <label key={airport.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="departure_airport_code"
                            value={airport.value}
                            checked={formData.departure_airport_code === airport.value || formData.departure_airport_code === String(airport.value)}
                            onChange={handleInputChange}
                            required={formData.useEmigration}
                            className="w-4 h-4 focus:outline-none cursor-pointer text-blue-600 border-gray-300"
                          />
                          <span className="ml-3 text-base text-left text-black">{airport.label}</span>
                        </label>
                      ))}
                    </fieldset>

                  </FieldRequired>
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    運行航空の会員番号やマイレージ番号（あれば）
                  </label>
                  <input
                    type="text"
                    name="airline_membership_num"
                    value={formData.airline_membership_num ?? ''}
                    onChange={handleInputChange}
                    className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                  />
                </div>


              </div>

              {/* Seating Preferences - Placed after 出発日 and before 運行航空の会員番号やマイレージ番号 */}
              <div className="my-8">
                <label className="block text-base font-medium text-black mb-3 text-left">
                  席のご希望（出来るだけアレンジしますが、ご希望を応えない場合もあります）
                </label>
                <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-4 max-[640px]:grid-cols-1 max-[640px]:gap-0 border-none p-0 m-0 "> {/* 4 columns on desktop, when width = 640 or lower, it will be 1 column*/}
                  {seatingPreferences.map(seat => (
                    <label key={seat.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="departure_seating_preferences"
                        value={seat.value}
                        checked={formData.departure_seating_preferences === seat.value || formData.departure_seating_preferences === String(seat.value)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                      />
                      <span className="ml-3 text-base text-black text-left">{seat.label}</span>
                    </label>
                  ))}
                </fieldset>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <FieldRequired
                    label="出発日"
                    required={true}
                    error={errors.departure_date}
                    isEmpty={isInputEmpty(formData.departure_date)}
                  >
                    <JapaneseDatePicker
                      name="departure_date"
                      value={formData.departure_date ?? ''}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="年 / 月 / 日"
                      minDate={new Date()}
                      className={`w-full md:w-[60%] lg:w-[40%] text-center px-4 py-3 bg-[#a3e7a3] border placeholder-gray-400 border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.departure_date ? 'border-[#c02b0b]' : 'border-[#b98d5d]'
                        }`}
                      error={errors.departure_date}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    出発空港での待ち合わせご希望時間（出発の３時間前からご指定可）
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Hours input box */}
                    <input
                      type="number"
                      name="departure_time_hours"
                      min="0"
                      max="23"
                      placeholder="時"
                      value={formData.departure_time ? parseInt(formData.departure_time.split(':')[0] || '0') : ''}
                      onChange={(e) => {
                        const hours = e.target.value;
                        const minutes = formData.departure_time ? formData.departure_time.split(':')[1] : '00';
                        const timeValue = hours !== '' ? `${hours.padStart(2, '0')}:${minutes}` : '';
                        setFormData(prev => ({
                          ...prev,
                          departure_time: timeValue,
                        }));
                      }}
                      className="w-16 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md text-center text-black font-medium focus:outline-none text-base placeholder-gray-400"
                    />
                    {/* Colon separator */}
                    <span className="text-black text-lg font-medium">:</span>
                    {/* Minutes input box */}
                    <input
                      type="number"
                      name="meeting_time_minutes"
                      min="0"
                      max="59"
                      placeholder='分'
                      value={formData.departure_time ? parseInt(formData.departure_time.split(':')[1] || '0') : ''}
                      onChange={(e) => {
                        const minutes = e.target.value;
                        const hours = formData.departure_time ? formData.departure_time.split(':')[0] : '00';
                        const timeValue = minutes !== '' ? `${hours}:${minutes.padStart(2, '0')}` : '';
                        setFormData(prev => ({
                          ...prev,
                          departure_time: timeValue,
                        }));
                      }}
                      className="w-16 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md text-center text-black font-medium focus:outline-none text-base placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    お見送りのベトナム語を話せる方の電話番号（任意）
                  </label>
                  <input
                    type="text"
                    name="departure_phone_number"
                    value={formData.departure_phone_number ?? ''}
                    onChange={handleInputChange}
                    className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    他のご希望があればご記入くださいませ。
                  </label>
                  <textarea
                    name="departure_request"
                    value={formData.departure_request ?? ''}
                    onChange={handleInputChange}
                    rows={1}
                    className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* PriceBar - Always visible at bottom */}
      <PriceBar
        bookingData={{
          ...bookingData,
          immigration: formData.useImmigration ? {
            entry_fast_track_option: formData.entry_fast_track_option ?? 0,
            immigration_package: immigrationPackages[formData.entry_fast_track_option]?.priceKey || '35$',
            tarmac_pickup: formData.useOtherOptions ? formData.tarmac_pickup : 'false',
            use_immigration_fast_track:
              (immigrationPackages[formData.entry_fast_track_option]?.priceKey || '35$') !== '300$'
                ? formData.use_immigration_fast_track
                : 'false',
            pickup_service: formData.useOtherOptions ? formData.pickup_service : 0,
          } : null,
          emigration: formData.useEmigration ? {
            departure_fast_track_option: formData.departure_fast_track_option ?? 0,
            emigration_package: emigrationPackages[formData.departure_fast_track_option]?.priceKey || '50$',
          } : null,
        }}
        onCouponApply={handlePriceUpdate}
        onPrimaryAction={handleNext}
        primaryActionLabel="利用者情報のご記入"
        primaryActionDisabled={
          (!formData.useImmigration && !formData.useEmigration) ||
          (formData.useImmigration && (formData.entry_fast_track_option === '' || formData.entry_fast_track_option === null || formData.entry_fast_track_option === undefined)) ||
          (formData.useEmigration && (formData.departure_fast_track_option === '' || formData.departure_fast_track_option === null || formData.departure_fast_track_option === undefined))
        }
      />
    </div>
  );
};

export default BookingStep1;