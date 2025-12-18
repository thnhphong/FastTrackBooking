import { useState, useEffect } from 'react';
import PriceBar from './PriceBar';
import ProcessIndicator from './ProcessIndicator';
import Error from './Error';
import FieldRequired from './FieldRequired';
import JapaneseDatePicker from './JapaneseDatePicker';

const BookingStep1 = ({ bookingData, setBookingData, onNextStep }) => {
  // Scroll to top when this step is mounted
  useEffect(() => {
    window.scrollTo({ top: 250, left: 0, behavior: 'auto' });
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 100, left: 0, behavior: 'auto' });
    }
  }, []);
  const [formData, setFormData] = useState({
    // Immigration
    useImmigration: bookingData?.immigration ? true : false,
    immigration_package: bookingData?.immigration?.immigration_package || '35$', // Default to first option
    flight_reservation_num: bookingData?.immigration?.flight_reservation_num || '',
    flight_num: bookingData?.immigration?.flight_num || '',
    airport: bookingData?.immigration?.airport,
    arrival_date: bookingData?.immigration?.arrival_date || '',
    pickup_at_airplain_exit: bookingData?.immigration?.pickup_at_airplain_exit || false,
    complete_within_15min: bookingData?.immigration?.complete_within_15min || false,
    pickup_vehicle_using: bookingData?.immigration?.pickup_vehicle_using || 'no',
    phone_num_of_picker: bookingData?.immigration?.phone_num_of_picker || '',
    requirement: bookingData?.immigration?.requirement || '',
    useOtherOptions: bookingData?.immigration?.useOtherOptions || false,

    // Emigration
    useEmigration: bookingData?.emigration ? true : false,
    emigration_package: bookingData?.emigration?.emigration_package || '50$', // Default to first option
    emigration_flight_reservation_num: bookingData?.emigration?.flight_reservation_num || '',
    airline_membership_num: bookingData?.emigration?.airline_membership_num || '',
    emigration_airport: bookingData?.emigration?.airport,
    seating_pref: bookingData?.emigration?.seating_pref || '',
    emigration_phone_num_of_picker: bookingData?.emigration?.phone_num_of_picker || '',
    emigration_requirement: bookingData?.emigration?.requirement || '',
    departure_date: bookingData?.emigration?.departure_date || '',
    meeting_time: bookingData?.emigration?.meeting_time || '',
    emigration_flight_num: bookingData?.emigration?.flight_num || '',
    sameAsEntry: false, // Track if "Same as entry" checkbox is checked
  });

  const airports = [
    { value: 'SGN', label: 'SGN - タンソンニャット空港 (Tan Son Nhat・Ho Chi Minh City)' },
    { value: 'DAD', label: 'DAD - ダナン空港(Da Nang)' },
    { value: 'HAN', label: 'HAN - ノイバイ(Noi Bai・Ha Noi)' },
  ];

  const immigrationPackages = [
    { value: '35$', label: 'VIP_IN1_入国審査での優先レーンのみ利用(フィー：35$ )' },
    { value: '40$', label: 'VIP_IN2_入国審査での優先レーン利用＋空港の外の迎え場所への案内 (フィー：40$ )' },
    { value: '50$', label: 'VIP_IN3_ 入国審査での優先レーン利用＋荷物受取サポート＋空港の外の迎え場所への案内 (フィー：50$ )' },
    { value: '300$', label: 'VIP_IN6_VVIP最優先レーン利用・Non-stopパッケージ(フィー：300$)' },
  ];

  const emigrationPackages = [
    { value: '50$', label: '出国Fasttrackフルサポートをご利用する(50$)' },
    { value: '300$', label: 'VVIP出国Fasttrackを利用する(300$)' },
  ];

  const pickupVehicles = [
    { value: 'no', label: '利用しない' },
    { value: '4_seat', label: '迎車 4席 (20$)' },
    { value: '7_seat', label: '迎車 7席 (25$)' },
    { value: 'limousine_7_seat', label: '迎車 9席 Limousine (50$)' },
  ];

  const seatingPreferences = [
    { value: 'dont_want', label: "希望しない" },
    { value: 'front_window', label: '前方 窓側' },
    { value: 'front_aisle', label: '前方 通路側' },
    { value: 'front_middle_window', label: '前方 真ん中席又は窓側' },
    { value: 'middle_window', label: '中列 窓側' },
    { value: 'middle_aisle', label: '中列 通路側' },
    { value: 'middle_middle_window', label: '中列 真ん中席又は窓側' },
    { value: 'rear_aisle', label: '後方 通路側' },
    { value: 'rear_window', label: '後方 窓側' },
    { value: 'rear_middle_window', label: '後方 真ん中席又は窓側' },
  ];

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
    if (type === 'checkbox' && name === 'useImmigration' && checked && !formData.immigration_package) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        immigration_package: '35$', // Auto-select first option
      }));
      return;
    }

    if (type === 'checkbox' && name === 'useEmigration' && checked && !formData.emigration_package) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        emigration_package: '50$', // Auto-select first option
      }));
      return;
    }

    // If unchecking, reset package selection
    if (type === 'checkbox' && name === 'useImmigration' && !checked) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        immigration_package: '35$', // Reset to first option
      }));
      return;
    }

    if (type === 'checkbox' && name === 'useEmigration' && !checked) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        emigration_package: '50$', // Reset to first option
      }));
      return;
    }

    // If selecting 300$ package, disable complete_within_15min
    if (name === 'immigration_package' && value === '300$') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        complete_within_15min: false, // Disable when 300$ is selected
      }));
      return;
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // If "Same as entry" is checked and immigration flight_reservation_num changes, update emigration
      if (name === 'flight_reservation_num' && prev.sameAsEntry && prev.useImmigration) {
        updated.emigration_flight_reservation_num = updated.flight_reservation_num;
      }

      // If user manually edits emigration flight reservation, uncheck "Same as entry"
      if (name === 'emigration_flight_reservation_num' && prev.sameAsEntry) {
        updated.sameAsEntry = false;
      }

      return updated;
    });
  };

  // Handle "Same as entry" checkbox for emigration flight reservation
  const handleSameAsEntry = (checked) => {
    if (checked && formData.useImmigration && formData.flight_reservation_num) {
      // When checked: copy immigration flight reservation to emigration
      setFormData(prev => ({
        ...prev,
        emigration_flight_reservation_num: prev.flight_reservation_num,
        sameAsEntry: true,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        emigration_flight_reservation_num: '',
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
        immigration_package: formData.immigration_package,
        flight_reservation_num: formData.flight_reservation_num,
        flight_num: formData.flight_num,
        airport: formData.airport,
        arrival_date: formData.arrival_date,
        pickup_at_airplain_exit: formData.pickup_at_airplain_exit,
        complete_within_15min: formData.complete_within_15min,
        pickup_vehicle_using: formData.pickup_vehicle_using,
        phone_num_of_picker: formData.phone_num_of_picker,
        requirement: formData.requirement,
      } : null,
      emigration: formData.useEmigration ? {
        emigration_package: formData.emigration_package,
        flight_reservation_num: formData.emigration_flight_reservation_num,
        flight_num: formData.emigration_flight_num,
        airline_membership_num: formData.airline_membership_num,
        airport: formData.emigration_airport,
        seating_pref: formData.seating_pref,
        phone_num_of_picker: formData.emigration_phone_num_of_picker,
        requirement: formData.emigration_requirement,
        departure_date: formData.departure_date,
        meeting_time: formData.meeting_time,
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
  const isInputEmpty = (value) => !value || value.trim() === '';

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (formData.useImmigration) {
      if (!formData.immigration_package) {
        newErrors.immigration_package = 'Please select an immigration package';
      }

      if (!formData.flight_reservation_num || !formData.flight_reservation_num.trim()) {
        newErrors.flight_reservation_num = 'This field is required';
      }
      if (!formData.flight_num || !formData.flight_num.trim()) {
        newErrors.flight_num = 'This field is required';
      }
      if (!formData.arrival_date) {
        newErrors.arrival_date = 'This field is required';
      }
      if (!formData.airport) {
        newErrors.airport = 'This field is required';
      }
      // Always validate complete_within_15min for non-300$ packages (not part of "Other options")
      if (formData.immigration_package !== '300$' && formData.complete_within_15min === undefined) {
        newErrors.complete_within_15min = 'This field is required';
      }
      // Only validate pickup_vehicle_using if "Other options" is checked
      if (formData.useOtherOptions && !formData.pickup_vehicle_using) {
        newErrors.pickup_vehicle_using = 'This field is required';
      }
    }

    if (formData.useEmigration) {
      if (!formData.emigration_package) {
        newErrors.emigration_package = 'Please select an emigration package';
      }
      if (!formData.emigration_flight_reservation_num || !formData.emigration_flight_reservation_num.trim()) {
        newErrors.emigration_flight_reservation_num = 'This field is required';
      }
      if (!formData.emigration_flight_num || !formData.emigration_flight_num.trim()) {
        newErrors.emigration_flight_num = 'This field is required';
      }
      if (!formData.departure_date) {
        newErrors.departure_date = 'This field is required';
      }
      if (!formData.emigration_airport) {
        newErrors.emigration_airport = 'This field is required';
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
                checked={formData.useImmigration}
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
                  <FieldRequired label="入国ファストトラックパッケージ" required={true} error={errors.immigration_package} isEmpty={!formData.immigration_package}>
                    <fieldset className="space-y-2 w-[98%] border-none p-0 m-0">
                      {immigrationPackages.map(pkg => (
                        <label key={pkg.value} className="flex items-start cursor-pointer text-start">
                          <input
                            type="radio"
                            name="immigration_package"
                            value={pkg.value}
                            checked={formData.immigration_package === pkg.value}
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
                {formData.immigration_package !== '300$' && (
                  <div className="mt-6">
                    <FieldRequired
                      label="オプション：15分以内に入国審査手続き完了"
                      required={true}
                      error={errors.complete_within_15min}
                      isEmpty={formData.complete_within_15min === undefined}
                    >
                      <fieldset className="space-y-2 border-none p-0 m-0">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="complete_within_15min"
                            value="false"
                            checked={!formData.complete_within_15min}
                            onChange={() => {
                              if (errors.complete_within_15min) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.complete_within_15min;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, complete_within_15min: false }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.complete_within_15min && formData.complete_within_15min === undefined ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.complete_within_15min && formData.complete_within_15min === undefined ? 'text-[#c02b0b]' : 'text-black'}`}>利用しない</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="complete_within_15min"
                            value="true"
                            checked={formData.complete_within_15min}
                            onChange={() => {
                              if (errors.complete_within_15min) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.complete_within_15min;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, complete_within_15min: true }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.complete_within_15min && formData.complete_within_15min === undefined ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.complete_within_15min && formData.complete_within_15min === undefined ? 'text-[#c02b0b]' : 'text-black'}`}>利用する (15$)</span>
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
                    error={errors.flight_reservation_num}
                    isEmpty={isInputEmpty(formData.flight_reservation_num)}
                  >
                    <input
                      type="text"
                      name="flight_reservation_num"
                      value={formData.flight_reservation_num}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="予約番号や予約コード"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border text-base border-[#f2f2f2] rounded-lg focus:outline-none ${errors.flight_reservation_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'
                        }`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="便・フライトNo."
                    required={true}
                    error={errors.flight_num}
                    isEmpty={isInputEmpty(formData.flight_num)}
                  >
                    <input
                      type="text"
                      name="flight_num"
                      value={formData.flight_num}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="VN000"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border text-base border-[#f2f2f2] rounded-lg focus:outline-none ${errors.flight_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'
                        }`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired label="ご利用の対象空港" required={true} error={errors.airport} isEmpty={!formData.airport}>
                    <fieldset className="space-y-2 border-none p-0 m-0">
                      {airports.map(airport => (
                        <label key={airport.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="airport"
                            value={airport.value}
                            checked={formData.airport === airport.value}
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
                      value={formData.arrival_date}
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
                    checked={formData.useOtherOptions}
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
                      error={errors.pickup_at_airplain_exit}
                      isEmpty={formData.pickup_at_airplain_exit === false}
                    >
                      {/* with max-w-[640px] => make pickup_at_airplain_exit into 2 cols*/}
                      <fieldset className="space-y-2 border-none p-0 m-0 max-[640px]:grid grid-cols-2 gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="pickup_at_airplain_exit"
                            value="false"
                            checked={!formData.pickup_at_airplain_exit}
                            onChange={() => {
                              if (errors.pickup_at_airplain_exit) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.pickup_at_airplain_exit;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, pickup_at_airplain_exit: false }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.pickup_at_airplain_exit && formData.pickup_at_airplain_exit === false ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.pickup_at_airplain_exit && formData.pickup_at_airplain_exit === false ? 'text-[#c02b0b]' : 'text-black'}`}>利用しない</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="pickup_at_airplain_exit"
                            value="true"
                            checked={formData.pickup_at_airplain_exit}
                            onChange={() => {
                              if (errors.pickup_at_airplain_exit) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.pickup_at_airplain_exit;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, pickup_at_airplain_exit: true }));
                            }}
                            className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.pickup_at_airplain_exit && formData.pickup_at_airplain_exit === false ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                          />
                          <span className={`ml-3 text-base ${errors.pickup_at_airplain_exit && formData.pickup_at_airplain_exit === false ? 'text-[#c02b0b]' : 'text-black'}`}>ご利用する (60$)</span>
                        </label>
                      </fieldset>
                    </FieldRequired>
                  </div>

                  {/* Column 2: Pickup vehicle use */}
                  <div>
                    <FieldRequired
                      label="迎車利用 (必須)"
                      required={true}
                      error={errors.pickup_vehicle_using}
                      isEmpty={!formData.pickup_vehicle_using}
                    >
                      <fieldset className="space-y-2 grid grid-cols-2 max-[640px]:grid-cols-1 gap-4 max-[640px]:gap-0 border-none p-0 m-0">
                        {pickupVehicles.map(vehicle => (
                          <label key={vehicle.value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="pickup_vehicle_using"
                              value={vehicle.value}
                              checked={formData.pickup_vehicle_using === vehicle.value}
                              onChange={handleInputChange}
                              required={formData.useOtherOptions}
                              className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.pickup_vehicle_using && !formData.pickup_vehicle_using ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                            />
                            <span className={`ml-3 text-base text-left ${errors.pickup_vehicle_using && !formData.pickup_vehicle_using ? 'text-[#c02b0b]' : 'text-black'}`}>
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
                    name="phone_num_of_picker"
                    value={formData.phone_num_of_picker}
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
                    name="requirement"
                    value={formData.requirement}
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
                checked={formData.useEmigration}
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
                <FieldRequired label="出国Fasttrack" required={true} error={errors.emigration_package} isEmpty={!formData.emigration_package}>
                  <fieldset className="space-y-2 border-none p-0 m-0">
                    {emigrationPackages.map(pkg => (
                      <label key={pkg.value} className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="emigration_package"
                          value={pkg.value}
                          checked={formData.emigration_package === pkg.value}
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
                    checked={formData.sameAsEntry}
                    onChange={(e) => handleSameAsEntry(e.target.checked)}
                    disabled={!formData.useImmigration || !formData.flight_reservation_num}
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
                    error={errors.emigration_flight_reservation_num}
                    isEmpty={isInputEmpty(formData.emigration_flight_reservation_num)}
                  >
                    <input
                      type="text"
                      name="emigration_flight_reservation_num"
                      value={formData.emigration_flight_reservation_num}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="予約番号や予約コード"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.emigration_flight_reservation_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="便・フライトNo."
                    required={true}
                    error={errors.emigration_flight_num}
                    isEmpty={isInputEmpty(formData.emigration_flight_num)}
                  >
                    <input
                      type="text"
                      name="emigration_flight_num"
                      value={formData.emigration_flight_num}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="VN999"
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.emigration_flight_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired label="ご利用の対象空港" required={true} error={errors.emigration_airport} isEmpty={!formData.emigration_airport}>
                    <fieldset className="space-y-2 max-[640px]:space-y-0 border-none p-0 m-0">
                      {airports.map(airport => (
                        <label key={airport.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="emigration_airport"
                            value={airport.value}
                            checked={formData.emigration_airport === airport.value}
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
                    value={formData.airline_membership_num}
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
                        name="seating_pref"
                        value={seat.value}
                        checked={formData.seating_pref === seat.value}
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
                      value={formData.departure_date}
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
                      name="meeting_time_hours"
                      min="0"
                      max="23"
                      placeholder="時"
                      value={formData.meeting_time ? parseInt(formData.meeting_time.split(':')[0] || '0') : ''}
                      onChange={(e) => {
                        const hours = e.target.value;
                        const minutes = formData.meeting_time ? formData.meeting_time.split(':')[1] : '00';
                        const timeValue = hours !== '' ? `${hours.padStart(2, '0')}:${minutes}` : '';
                        setFormData(prev => ({
                          ...prev,
                          meeting_time: timeValue,
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
                      value={formData.meeting_time ? parseInt(formData.meeting_time.split(':')[1] || '0') : ''}
                      onChange={(e) => {
                        const minutes = e.target.value;
                        const hours = formData.meeting_time ? formData.meeting_time.split(':')[0] : '00';
                        const timeValue = minutes !== '' ? `${hours}:${minutes.padStart(2, '0')}` : '';
                        setFormData(prev => ({
                          ...prev,
                          meeting_time: timeValue,
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
                    name="emigration_phone_num_of_picker"
                    value={formData.emigration_phone_num_of_picker}
                    onChange={handleInputChange}
                    className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2 text-left">
                    他のご希望があればご記入くださいませ。
                  </label>
                  <textarea
                    name="emigration_requirement"
                    value={formData.emigration_requirement}
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
            immigration_package: formData.immigration_package || '35$',
            pickup_at_airplain_exit: formData.useOtherOptions ? formData.pickup_at_airplain_exit : false,
            complete_within_15min: (formData.immigration_package || '35$') !== '300$' ? formData.complete_within_15min : false,
            pickup_vehicle_using: formData.useOtherOptions ? formData.pickup_vehicle_using : 'no',
          } : null,
          emigration: formData.useEmigration ? {
            emigration_package: formData.emigration_package || '50$',
          } : null,
        }}
        onCouponApply={handlePriceUpdate}
        onPrimaryAction={handleNext}
        primaryActionLabel="利用者情報のご記入"
        primaryActionDisabled={
          (!formData.useImmigration && !formData.useEmigration) ||
          (formData.useImmigration && !formData.immigration_package) ||
          (formData.useEmigration && !formData.emigration_package)
        }
      />
    </div>
  );
};

export default BookingStep1;
