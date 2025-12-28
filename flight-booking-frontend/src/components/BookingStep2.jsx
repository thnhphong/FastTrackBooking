import { useState, useEffect, useMemo } from 'react';
import { parse, differenceInMonths } from 'date-fns';
import ProcessIndicator from './ProcessIndicator';
import Error from './Error';
import FieldRequired from './FieldRequired';
import JapaneseDatePicker from './JapaneseDatePicker';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { surveyChannels, contactOptions, addOnsOptions } from '../constants/bookingOptions';
import { isInputEmpty, isValidEmail } from '../utils/formHelpers';

const BookingStep2 = ({ bookingData, setBookingData, onNextStep, onPrevStep }) => {
  useScrollToTop();
  // Form state using API-style field names from ApiJson.txt
  const [formData, setFormData] = useState({
    first_name: bookingData?.first_name || '',
    last_name: bookingData?.last_name || '',
    date_of_birth: bookingData?.date_of_birth || '',
    passport_expiry_date: bookingData?.passport_expiry_date || '',
    // sex (0: male, 1: female) - must be number or empty string for controlled input
    sex: typeof bookingData?.sex === 'number' ? bookingData.sex : (bookingData?.sex !== undefined && bookingData?.sex !== null ? Number(bookingData.sex) : ''),
    user_phone_number: bookingData?.user_phone_number || '',
    nationality: bookingData?.nationality || '',
    contact_email_to: bookingData?.contact_email_to || '',
    contact_email_cc: bookingData?.contact_email_cc || '',
    passport_number: bookingData?.passport_number || '',
    optional_company_name: bookingData?.optional_company_name || '',
    referred_by_name: bookingData?.referred_by_name || '',
    // survey_channel and contact_method must be numbers for radio buttons
    survey_channel: typeof bookingData?.survey_channel === 'number' ? bookingData.survey_channel : (bookingData?.survey_channel !== undefined && bookingData?.survey_channel !== null ? Number(bookingData.survey_channel) : ''),
    contact_method: typeof bookingData?.contact_method === 'number' ? bookingData.contact_method : (bookingData?.contact_method !== undefined && bookingData?.contact_method !== null ? Number(bookingData.contact_method) : ''),
    add_ons: Array.isArray(bookingData?.add_ons) ? bookingData.add_ons : [],
  });

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  // Check if passport expiration date is less than 6 months away from the arrival date
  // Show warning initially, hide it when passport expires more than 6 months after arrival date
  // Only show warning if immigration package is selected (not for emigration only)
  const showPassportWarning = useMemo(() => {
    // Don't show warning if only emigration is selected (no immigration)
    if (!bookingData?.immigration && bookingData?.emigration) {
      return false;
    }

    // Show warning initially if no expiration date is set
    if (!formData.passport_expiry_date) return true;

    try {
      const expireDate = parse(formData.passport_expiry_date, 'yyyy-MM-dd', new Date());

      // Get arrival date from immigration (not maximum, just the arrival date)
      if (!bookingData?.immigration?.arrival_date) {
        // If no arrival date is set yet, show warning as reminder
        return true;
      }

      const arrivalDate = parse(bookingData.immigration.arrival_date, 'yyyy-MM-dd', new Date());

      // Check if passport expires within 6 months FROM the arrival date
      // Calculate from arrival date to expire date
      // Show warning if expire date is less than 6 months after arrival date
      const monthsFromArrivalToExpiry = differenceInMonths(expireDate, arrivalDate);
      return monthsFromArrivalToExpiry < 6;
    } catch {
      // Show warning if there's an error parsing dates
      return true;
    }
  }, [formData.passport_expiry_date, bookingData?.immigration, bookingData?.emigration]);

  // Save formData to bookingData as user types (like step1)
  useEffect(() => {
    setBookingData(prev => ({
      ...prev,
      // Maintain nested passport for existing backend/models
      passport: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        birthday: formData.date_of_birth,
        expire_date: formData.passport_expiry_date,
        gender: formData.sex === 1 ? 'female' : formData.sex === 0 ? 'male' : '',
        phone_num: formData.user_phone_number,
        nationality: formData.nationality,
        email: formData.contact_email_to,
        email_cc: formData.contact_email_cc,
        passport_num: formData.passport_number,
        company_name: formData.optional_company_name,
        referer_name: formData.referred_by_name,
      },
      contact_method: formData.contact_method,
      survey_channel: formData.survey_channel,
      add_ons: formData.add_ons,
      // Flat fields following ApiJson.txt
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
      passport_expiry_date: formData.passport_expiry_date,
      sex: formData.sex,
      user_phone_number: formData.user_phone_number,
      nationality: formData.nationality,
      contact_email_to: formData.contact_email_to,
      contact_email_cc: formData.contact_email_cc,
      passport_number: formData.passport_number,
      optional_company_name: formData.optional_company_name,
      referred_by_name: formData.referred_by_name,
    }));
  }, [formData, setBookingData]);



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

    // Convert numeric enum fields to numbers
    const numericFields = ['sex', 'survey_channel', 'contact_method'];
    const processedValue = type === 'checkbox'
      ? checked
      : numericFields.includes(name) && value !== ''
        ? Number(value)
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleAddOnChange = (addOnValue, checked) => {
    setFormData(prev => {
      const currentAddOns = prev.add_ons || [];
      if (checked) {
        return {
          ...prev,
          add_ons: [...currentAddOns, addOnValue],
        };
      } else {
        return {
          ...prev,
          add_ons: currentAddOns.filter(val => val !== addOnValue),
        };
      }
    });
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name || !formData.first_name.trim()) {
      newErrors.first_name = 'This field is required';
    }
    if (!formData.last_name || !formData.last_name.trim()) {
      newErrors.last_name = 'This field is required';
    }
    if (formData.sex === '' || formData.sex === null || formData.sex === undefined) {
      newErrors.sex = 'This field is required';
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'This field is required';
    }
    if (!formData.user_phone_number || !formData.user_phone_number.trim()) {
      newErrors.user_phone_number = 'This field is required';
    }
    // Email validation - required and must be valid format
    if (!formData.contact_email_to || !formData.contact_email_to.trim()) {
      newErrors.contact_email_to = 'required';
    } else if (!isValidEmail(formData.contact_email_to)) {
      newErrors.contact_email_to = 'invalid_format';
    }
    if (!formData.passport_number || !formData.passport_number.trim()) {
      newErrors.passport_number = 'This field is required';
    }
    if (!formData.passport_expiry_date) {
      newErrors.passport_expiry_date = 'This field is required';
    }
    if (formData.survey_channel === '' || formData.survey_channel === null || formData.survey_channel === undefined) {
      newErrors.survey_channel = 'This field is required';
    }
    if (formData.contact_method === '' || formData.contact_method === null || formData.contact_method === undefined) {
      newErrors.contact_method = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    if (onPrevStep) {
      onPrevStep();
    }
  };

  const handleNext = () => {
    // Validate form
    if (!validateForm()) {
      setShowError(true);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowError(false);
    // Data is already saved via useEffect, just navigate to next step
    if (onNextStep) {
      onNextStep();
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 max-[640px]:px-2 py-8 max-[640px]:py-4 pb-32">

        {/* Error Message */}
        <Error message={showError ? "There Is A Problem With Your Answer. Please Check The Fields Below." : null} />

        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {/* All sections within one border */}
          <div className="mb-6 p-6 max-[640px]:p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Process Indicator inside the border */}
            <div className="mb-6">
              <ProcessIndicator currentStep={2} />
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">

              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-6 max-[640px]:gap-4">


                {/* Last Name */}
                <div>
                  <FieldRequired
                    label="性（パスポートと同じくご記入ください）"
                    required={true}
                    error={errors.last_name}
                    isEmpty={isInputEmpty(formData.last_name)}
                  >
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.last_name ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* First Name */}
                <div>
                  <FieldRequired
                    label="名（パスポートと同じくご記入ください）"
                    required={true}
                    error={errors.first_name}
                    isEmpty={isInputEmpty(formData.first_name)}
                  >
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.first_name ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div className="col-span-2 max-[640px]:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-6 max-[640px]:gap-4">
                  {/* Sex and Date of Birth - grouped in one column */}
                  <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-6 max-[640px]:gap-4">
                    {/* Sex (numeric: 0=male, 1=female) */}
                    <div>
                      <FieldRequired
                        label="性別"
                        required={true}
                        error={errors.sex}
                        isEmpty={formData.sex === '' || formData.sex === null || formData.sex === undefined || (typeof formData.sex !== 'number')}
                      >
                        <fieldset className="mt-2 flex gap-6 max-[640px]:gap-38 border-none p-0 m-0">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="sex"
                              value={0}
                              checked={formData.sex === 0 || formData.sex === '0'}
                              onChange={handleInputChange}
                              className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.sex && (formData.sex === '' || formData.sex === null || formData.sex === undefined || typeof formData.sex !== 'number') ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                            />
                            <span className={`ml-3 text-base ${errors.sex && (formData.sex === '' || formData.sex === null || formData.sex === undefined || typeof formData.sex !== 'number') ? 'text-[#c02b0b]' : 'text-black'}`}>男性</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="sex"
                              value={1}
                              checked={formData.sex === 1 || formData.sex === '1'}
                              onChange={handleInputChange}
                              className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.sex && (formData.sex === '' || formData.sex === null || formData.sex === undefined || typeof formData.sex !== 'number') ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                            />
                            <span className={`ml-3 text-base ${errors.sex && (formData.sex === '' || formData.sex === null || formData.sex === undefined || typeof formData.sex !== 'number') ? 'text-[#c02b0b]' : 'text-black'}`}>女性</span>
                          </label>
                        </fieldset>
                      </FieldRequired>
                    </div>
                    {/* Date of Birth */}
                    <div>
                      <FieldRequired
                        label="生年月日"
                        required={true}
                        error={errors.date_of_birth}
                        isEmpty={!formData.date_of_birth}
                      >
                        <JapaneseDatePicker
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          placeholder="年/月/日"
                          maxDate={new Date()}
                          className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.date_of_birth ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                          error={errors.date_of_birth}
                        />
                      </FieldRequired>
                    </div>
                  </div>
                  {/* Phone Number and Nationality - side by side */}
                  <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-6 max-[640px]:gap-4">
                    {/* Phone Number */}
                    <div className="text-start">
                      <FieldRequired
                        label="国コード 付電話番号"
                        required={true}
                        error={errors.user_phone_number}
                        isEmpty={isInputEmpty(formData.user_phone_number)}
                      >
                        <input
                          type="tel"
                          name="user_phone_number"
                          value={formData.user_phone_number}
                          onChange={handleInputChange}
                          placeholder=""
                          className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.phone_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                        />
                      </FieldRequired>
                    </div>
                    {/* Nationality */}
                    <div className="text-start relative">
                      <FieldRequired
                        label="国籍"
                        required={false}
                      >
                        <select
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base appearance-none pr-10"
                        >
                          <option value="JPN">日本</option> {/* Japan */}
                          <option value="VNM">ベトナム</option> {/* Vietnam */}
                          <option value="others">その他</option> {/* Other */}
                        </select>
                        <div className="absolute right-3 bottom-1.5 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-[#bbbbbb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </FieldRequired>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="text-start">
                  <FieldRequired
                    label="案内を受け取るためのメールアドレス"
                    required={true}
                    error={errors.contact_email_to}
                    isEmpty={isInputEmpty(formData.contact_email_to)}
                    customErrorMessage="入力したメールアドレスが無効です。フォーマットを確認してください（例：email@domain.com）"
                  >
                    <input
                      type="email"
                      name="contact_email_to"
                      value={formData.contact_email_to}
                      onChange={handleInputChange}
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.email ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* Email CC */}
                <div>
                  <FieldRequired
                    label="CCを希望されるメールアドレス"
                    required={false}
                  >
                    <input
                      type="email"
                      name="contact_email_cc"
                      value={formData.contact_email_cc}
                      onChange={handleInputChange}
                      className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                    />
                  </FieldRequired>
                </div>

                {/* Passport Number - 50% */}
                <div className="text-start">
                  <FieldRequired
                    label="パスポート No."
                    required={true}
                    error={errors.passport_number}
                    isEmpty={isInputEmpty(formData.passport_number)}
                  >
                    <input
                      type="text"
                      name="passport_number"
                      value={formData.passport_number}
                      onChange={handleInputChange}
                      className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.passport_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* Passport Expiration Date + Warning - 50% */}
                <div className="text-start">
                  <FieldRequired
                    label="パスポートの有効期限"
                    required={true}
                    error={errors.passport_expiry_date}
                    isEmpty={!formData.passport_expiry_date}
                  >
                    <div className="flex gap-2 items-start max-[640px]:flex-col max-[640px]:gap-3">
                      <div className="w-[40%] max-[640px]:w-full flex-shrink-0">
                        <JapaneseDatePicker
                          name="passport_expiry_date"
                          value={formData.passport_expiry_date}
                          onChange={handleInputChange}
                          placeholder="年/月/日"
                          minDate={new Date()}
                          className={`text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.passport_expiry_date ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                          error={errors.passport_expiry_date}
                        />
                      </div>
                      {showPassportWarning && (
                        <div className="flex-1 min-w-0 ml-14 max-[640px]:ml-0 font-bold max-[640px]:px-8">
                          <div className="text-red-600 font-bold text-base">
                            ★ 要注意★
                          </div>
                          <div className="text-red-600 text-sm leading-relaxed">
                            お客様のパスポートの有効期限が<br />
                            6か月未満のため、<br />
                            ビザ免除での入国はできません。
                          </div>
                        </div>
                      )}
                    </div>
                  </FieldRequired>
                </div>

                {/* Company Name */}
                <div className="text-start">
                  <FieldRequired
                    label="会社宛に領収書の発行が要る場合、会社名のご記入ください。"
                    required={false}
                  >
                    <input
                      type="text"
                      name="optional_company_name"
                      value={formData.optional_company_name}
                      onChange={handleInputChange}
                      placeholder=""
                      className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                    />
                  </FieldRequired>
                </div>

                {/* Referer Name */}
                <div className="text-start">
                  <FieldRequired
                    label="任意情報： ご紹介の方のお名前"
                    required={false}
                  >
                    <input
                      type="text"
                      name="referred_by_name"
                      value={formData.referred_by_name}
                      onChange={handleInputChange}

                      className="text-center w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                    />
                  </FieldRequired>
                </div>
              </div>
            </div>

            {/* LINE Contact Section 50% separated from the other sections*/}
            <div className="mb-4 mx-24 max-[640px]:mx-0 pt-4">
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-6 max-[640px]:gap-4">
                {/* QR Code Section */}
                <div className="flex-shrink-0 max-[640px]:flex max-[640px]:justify-center">
                  <div className="w-80 h-80 max-[640px]:w-48 max-[640px]:h-48 flex max-[640px]:w-65 max-[640px]:h-65">
                    <img src="/public/uploads/Line-QR.png" alt="" className="max-[640px]:w-full max-[640px]:h-full object-contain " />
                  </div>
                </div>

                {/* Contact Options */}
                <div className="flex-1">
                  <FieldRequired
                    label="お客様に最適なサポートを提供するために、弊社のLINE公式アカウントと友だち追加をお願いいたします。"
                    required={true}
                    error={errors.contact_method}
                    isEmpty={formData.contact_method === '' || formData.contact_method === null || formData.contact_method === undefined}
                  >
                    {/* make this wider for 1 line text*/}
                    <fieldset className="mt-3 grid grid-cols-2 max-[640px]:grid-cols-1 gap-2 max-[640px]:gap-0 border-none p-0 m-0">
                      {contactOptions.map(option => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="contact_method"
                            value={option.value}
                            checked={formData.contact_method === option.value || formData.contact_method === String(option.value)}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                          />
                          <span className="ml-3 text-base text-black">{option.label}</span>
                        </label>
                      ))}
                    </fieldset>
                    <p className="mt-3 text-base text-blue-600 text-start">
                      ※ベトナムの空港では無料Wi-Fiがあります。
                    </p>
                  </FieldRequired>
                </div>
              </div>
            </div>

            {/* Survey Channel Section */}
            <div className="mb-6 pt-5 border-gray-200 text-start">
              <FieldRequired
                label="弊社のファストトラックサービスはどのチャンネルから知りましたか？"
                required={true}
                error={errors.survey_channel}
                isEmpty={!formData.survey_channel}
              >
                <fieldset className="mt-3 grid grid-cols-2 max-[640px]:grid-cols-1 border-none p-0 m-0">
                  {surveyChannels.map(channel => (
                    <label key={channel.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="survey_channel"
                        value={channel.value}
                        checked={formData.survey_channel === channel.value || formData.survey_channel === String(channel.value)}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                      />
                      <span className="ml-3 text-base text-black">{channel.label}</span>
                    </label>
                  ))}
                </fieldset>
              </FieldRequired>
            </div>

            {/* Add-ons Section */}
            <div className="pt-4 border-gray-200 text-start">
              <label className="block text-base font-medium text-black mb-4">
                以下のサービスについての無料相談をご希望しませんか。
              </label>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-3 max-[640px]:gap-2">
                {/* Left Column: value 0, 2, 4, 6, 8 */}
                <div className="space-y-1">
                  {addOnsOptions.filter(addOn => addOn.value % 2 === 0).map(addOn => (
                    <label key={addOn.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.add_ons?.includes(addOn.value) || false}
                        onChange={(e) => handleAddOnChange(addOn.value, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none"
                      />
                      <span className="ml-3 text-base text-black">{addOn.label}</span>
                    </label>
                  ))}
                </div>
                {/* Right Column: value 1, 3, 5, 7, 9 */}
                <div className="space-y-1">
                  {addOnsOptions.filter(addOn => addOn.value % 2 === 1).map(addOn => (
                    <label key={addOn.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.add_ons?.includes(addOn.value) || false}
                        onChange={(e) => handleAddOnChange(addOn.value, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none"
                      />
                      <span className="ml-3 text-base text-black">{addOn.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-base text-blue-900">
                弊社のスタッフが日本語で無料相談を行い、場合によっては提携サービスの割引券をプレゼントすることもありますので、 ぜひご協力をよろしくお願いいたします。
              </p>
            </div>

          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-2 mt-8 max-[640px]:gap-3 max-[640px]:px-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-base max-[640px]:w-full"
            >
              戻る
            </button>
            <button
              //hover with bg-white-500 with slow transition
              type="submit"
              className="px-8 py-3 bg-[#01ae00] text-white rounded-full hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-300 text-base max-[391px]:text-sm max-[640px]:w-full"
            >
              予約情報の確認
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default BookingStep2;
