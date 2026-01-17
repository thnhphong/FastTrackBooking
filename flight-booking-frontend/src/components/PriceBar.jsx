import { useState, useEffect, useRef } from 'react';
import { validateCoupon } from '../services/bookingService';

const PriceBar = ({
  bookingData,
  onCouponApply,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled = false,
}) => {
  // Initialize coupon state from bookingData to persist across steps
  const [couponCode, setCouponCode] = useState(bookingData?.coupon?.code || '');
  const [appliedCoupon, setAppliedCoupon] = useState(bookingData?.coupon?.appliedCoupon || null);
  const [couponError, setCouponError] = useState('');
  const [usedCouponCodes, setUsedCouponCodes] = useState([]); // Track codes already used in this session (in-memory only)
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(
    bookingData?.payment_method ?? 1 // 0: cash, 1: online_credit, 2: vietnam_bank_transfer
  );
  const isCalculatingRef = useRef(false);

  // Package prices
  const packagePrices = {
    immigration: {
      '35$': 35,
      '40$': 40,
      '50$': 50,
      '300$': 300,
    },
    emigration: {
      '50$': 50,
      '65$': 65,
      '300$': 300,
    },
    pickupVehicle: {
      0: 0,
      1: 20,
      2: 25,
      3: 50,
    },
    pickupAtExit: 60,
    completeWithin15min: 15,
  };

  // Sync coupon state when bookingData.coupon changes (e.g., when navigating between steps)
  useEffect(() => {
    const storedCoupon = bookingData?.coupon;
    if (storedCoupon?.appliedCoupon) {
      // Restore coupon from bookingData
      setAppliedCoupon(storedCoupon.appliedCoupon);
      setCouponError('');
    } else if (storedCoupon === null) {
      // Explicitly cleared
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
    }
  }, [bookingData?.coupon]);


  // Initialize payment method on mount if not set
  useEffect(() => {
    if (bookingData?.payment_method === undefined || bookingData?.payment_method === null) {
      // Save default payment method to bookingData on initial mount
      if (onCouponApply) {
        onCouponApply({ payment_method: paymentMethod });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync payment method from bookingData
  useEffect(() => {
    if (bookingData?.payment_method) {
      setPaymentMethod(bookingData.payment_method);
    }
  }, [bookingData?.payment_method]);

  useEffect(() => {
    if (isCalculatingRef.current) return;
    isCalculatingRef.current = true;

    let calculatedSubtotal = 0;

    // Immigration package price
    if (bookingData?.immigration?.immigration_package) {
      const price = packagePrices.immigration[bookingData.immigration.immigration_package] || 0;
      calculatedSubtotal += price;
    }

    // Emigration package price
    if (bookingData?.emigration?.emigration_package) {
      const price = packagePrices.emigration[bookingData.emigration.emigration_package] || 0;
      calculatedSubtotal += price;
    }

    // Pickup vehicle
    if (
      bookingData?.immigration?.pickup_service !== undefined &&
      bookingData?.immigration?.pickup_service !== null
    ) {
      const price = packagePrices.pickupVehicle[bookingData.immigration.pickup_service] || 0;
      calculatedSubtotal += price;
    }

    // Pickup at exit (stored as string "true"/"false")
    if (bookingData?.immigration?.tarmac_pickup === 'true') {
      calculatedSubtotal += packagePrices.pickupAtExit;
    }

    // Complete within 15 min (stored as string "true"/"false")
    if (bookingData?.immigration?.use_immigration_fast_track === 'true') {
      calculatedSubtotal += packagePrices.completeWithin15min;
    }

    // Apply coupon discount
    let discount = 0;
    let couponDiscountAmount = 0;
    let amountAfterCoupon = calculatedSubtotal;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'value_discount') {
        couponDiscountAmount = appliedCoupon.discount;
        discount = couponDiscountAmount;
      } else if (appliedCoupon.type === 'percent_discount') {
        couponDiscountAmount = (calculatedSubtotal * appliedCoupon.discount) / 100;
        discount = couponDiscountAmount;
      }
      amountAfterCoupon = Math.max(0, calculatedSubtotal - discount);
    }

    const calculatedVat = amountAfterCoupon * 0.08; // 8% VAT
    const calculatedTotal = amountAfterCoupon + calculatedVat;

    setSubtotal(calculatedSubtotal);
    setVat(calculatedVat);
    setTotal(calculatedTotal);

    // Update parent component only if callback exists and values changed
    if (onCouponApply) {
      const priceData = {
        sub_price: calculatedSubtotal,
        preliminary_calculation: calculatedSubtotal.toFixed(2),
        tax: calculatedVat,
        total_price: calculatedTotal,
        total: calculatedTotal,
        coupon: appliedCoupon ? couponCode : null,
        coupon_discount_amount: appliedCoupon ? couponDiscountAmount.toFixed(2) : null,
        coupon_discount_formatted: appliedCoupon ? `-$${couponDiscountAmount.toFixed(2)}` : '$0.00',
        has_coupon_discount: !!appliedCoupon,
        amount_after_coupon: amountAfterCoupon.toFixed(2),

        coupon_id: appliedCoupon?.id || null,
        coupon_obj: appliedCoupon ? {
          code: couponCode,
          appliedCoupon: appliedCoupon,
        } : null,
      };
      // Use requestAnimationFrame to avoid infinite loop
      requestAnimationFrame(() => {
        onCouponApply(priceData);
        isCalculatingRef.current = false;
      });
    } else {
      isCalculatingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bookingData?.immigration?.immigration_package,
    bookingData?.immigration?.pickup_service,
    bookingData?.immigration?.tarmac_pickup,
    bookingData?.immigration?.use_immigration_fast_track,
    bookingData?.emigration?.emigration_package,
    appliedCoupon?.id,
    appliedCoupon?.type,
    appliedCoupon?.discount,
    couponCode,
  ]);

  const handleCouponApply = async () => {
    const rawCode = couponCode.trim();
    const normalizedCode = rawCode.toUpperCase();

    if (!rawCode) {
      setCouponError('無効なクーポン');
      setCouponCode(''); // Clear input
      return;
    }

    // Prevent applying a coupon if one is already applied
    if (appliedCoupon) {
      setCouponError('既にクーポンが適用されています。新しいクーポンを適用するには、まず現在のクーポンを削除してください。');
      setCouponCode(''); // Clear input
      return;
    }

    // Clear input immediately regardless of result
    setCouponCode('');

    // Prevent applying the same coupon multiple times in this session
    if (usedCouponCodes.includes(normalizedCode)) {
      setCouponError('このクーポンは複数回適用できません。');
      return;
    }

    try {
      const response = await validateCoupon(normalizedCode, total);
      if (response.valid) {
        const coupon = response.coupon;
        setAppliedCoupon(coupon);
        setCouponError('');
        setUsedCouponCodes(prev => (prev.includes(normalizedCode) ? prev : [...prev, normalizedCode]));

        // Store coupon in bookingData for persistence across steps
        if (onCouponApply) {
          onCouponApply({
            coupon: {
              code: normalizedCode,
              appliedCoupon: coupon,
            },
          });
        }
      } else {
        setCouponError('無効なクーポン。');
      }
    } catch (err) {
      // Backend error or invalid coupon; show message but keep existing coupon
      const errorMessage = err.response?.data?.message || '無効なクーポン。';

      // Handle specific error messages
      if (errorMessage.includes('Coupon code not found') || errorMessage.includes('not found')) {
        setCouponError('無効なクーポン。');
      } else if (errorMessage.includes('expired') || errorMessage.includes('Coupon has expired')) {
        setCouponError('無効なクーポン。');
      } else {
        setCouponError('無効なクーポン。');
      }
    }
  };

  const handleCouponRemove = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setUsedCouponCodes([]);

    // Remove coupon from bookingData
    if (onCouponApply) {
      onCouponApply({
        coupon: null,
        coupon_id: null,
        coupon_obj: null,
        coupon_discount_amount: null,
        coupon_discount_formatted: null,
        has_coupon_discount: false,
        amount_after_coupon: null,
      });
    }
  };

  // Payment method options (numeric values for API)
  const paymentMethods = [
    { value: 0, label: '現金払い' },
    { value: 1, label: 'オンラインでクレジット決済' },
    { value: 2, label: 'ベトナム口座振込' },
  ];

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    if (onCouponApply) {
      onCouponApply({ payment_method: Number(value) });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#f0f8ff] border-t-1 border-black-200 shadow-lg z-40 px-8 max-[769px]:px-3">
      <div className="max-w-[1140px] mx-38 max-[769px]:mx-0 py-2 h-38 max-[769px]:h-40 max-[1367px]:px-0">
        <div className="flex flex-col">
          <div className="flex flex-wrap justify-between items-start max-[1367px]:hidden max-[1367px]:justify-around">
            {/* 仮計算 */}
            <div className="flex flex-col items-start">
              <span className="text-base text-black font-bold">仮計算</span>
              <span className="text-base font-regular text-[#ff0000]">${subtotal.toFixed(2)}</span>
            </div>

            {/* クーポン Section - Hidden on max-[1367px] */}
            <div className="relative flex flex-col gap-2 min-h-[70px] max-[1367px]:hidden">
              <div className="flex items-center gap-2">
                <span className="text-base text-black font-bold">クーポン</span>
                <input
                  type="text"
                  placeholder=""
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    // Clear error when user starts typing
                    if (couponError) {
                      setCouponError('');
                    }
                  }}
                  disabled={!!appliedCoupon}
                  className="w-20 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:opacity-50 disabled:cursor-not-allowed "
                />

                {/* when bg-[#01ae00] hover:bg-gray-300*/}
                <button
                  onClick={handleCouponApply}
                  disabled={couponCode.trim() === '' || !!appliedCoupon}
                  className="px-3 py-2 bg-[#01ae00] text-white rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                >
                  適用
                </button>
              </div>

              {/* Applied coupon info - show below input/button */}
              {appliedCoupon && (
                <button
                  onClick={handleCouponRemove}
                  className="flex items-center gap-3 font-semibold text-[#015cc8] border-b border-dashed border-[#015cc8] w-fit"
                >
                  <span className="flex items-center justify-center w-4 h-4 font-bold rounded-full border-[1.5px] border-[#a42021] text-[#a42021] text-base">
                    ×
                  </span>
                  <span>{appliedCoupon.name}</span>
                  <span className="ml-6 ">-{`$${appliedCoupon.discount.toFixed(2)}`}</span>
                </button>
              )}

              {/* Error message - absolutely positioned, doesn't affect layout */}
              {couponError && (
                <div className="absolute top-[70%] max-w-[250%] px-1 bg-[#fff9f9] border border-[1px] border-[#c02b0b] text-blue-600 text-sm font-medium whitespace-nowrap text-ellipsis inline-flex z-10">
                  {couponError}
                </div>
              )}
            </div>

            {/* 税金 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-black font-bold">税金</span>
              <span className="text-base font-regular text-[#ff0000]">${vat.toFixed(2)}</span>
            </div>

            {/* 合計 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-black font-bold">合計</span>
              <span className="w-24 p-2 text-center font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
            {/* Just Payment Method Section  */}
            {primaryActionLabel && onPrimaryAction && (
              <div className="flex flex-row items-between gap-9 w-full">
                {/* Payment Method Section */}
                <div className="flex justify-start items-end gap-4 flex-1">
                  <label className="text-base font-bold text-black whitespace-nowrap">支払方法</label>

                  {/* Radio buttons for larger screens */}
                  <fieldset className="flex gap-5 max-[1367px]:hidden">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value={0}
                        checked={paymentMethod === 0 || paymentMethod === '0'}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setPaymentMethod(value);
                          if (onCouponApply) {
                            onCouponApply({ payment_method: value });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                      />
                      <span className="ml-3 text-base text-black">現金払い</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value={1}
                        checked={paymentMethod === 1 || paymentMethod === '1'}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setPaymentMethod(value);
                          if (onCouponApply) {
                            onCouponApply({ payment_method: value });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                      />
                      <span className="ml-3 text-base text-black">オンラインでクレジット決済</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value={2}
                        checked={paymentMethod === 2 || paymentMethod === '2'}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setPaymentMethod(value);
                          if (onCouponApply) {
                            onCouponApply({ payment_method: value });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                      />
                      <span className="ml-3 text-base text-black">ベトナム口座振込</span>
                    </label>
                  </fieldset>

                </div>

                <button
                  onClick={onPrimaryAction}
                  disabled={primaryActionDisabled}
                  className="max-[1367px]:hidden max-[640px]:w-[50%] px-6 py-3 bg-[#01ae00] text-white rounded-full font-medium hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base disabled:outline-none whitespace-nowrap"
                >
                  {primaryActionLabel}
                </button>
              </div>
            )}
          </div>



          {/* Responsive layout for max-[1367px] - 2 rows, 
          max-[769px]:w-60%
           */}

          <div className="hidden max-[1367px]:flex max-[1367px]:flex-col max-[1367px]:gap-10 max-[1367px]:mb-2 max-[769px]:w-[120%] max-[769px]:flex-col max-[769px]:py-1 max-[769px]:items-start max-[769px]:gap-10 max-[769px]:px-0">
            {/* Row 1 - summary + payment dropdown */}
            <div className="flex items-start gap-10 justify-between max-[1367px]:px-10 max-[769px]:px-0 max-[769px]:justify-start max-[769px]:gap-6">
              <div className="flex flex-row items-start gap-20 max-[1367px]:gap-10 max-[769px]:gap-3">
                <div className="flex flex-col items-start">
                  <span className="text-base text-black font-bold">仮計算</span>
                  <span className="text-base font-regular text-[#ff0000]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-bold text-black">税金</span>
                  <span className="text-base font-regular text-black">${vat.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-bold text-black">合計</span>
                  <span className="text-start font-bold text-black">${total.toFixed(2)}</span>
                </div>
              </div>
              {/* make label + select into a col*/}
              <div className="flex flex-col gap-1 min-[1367px]:hidden max-[1367px]:block max-[769px]:w-[40%] max-[769px]:py-0 max-[769px]:items-start">
                <label className="text-base font-bold text-black">支払方法</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => handlePaymentMethodChange(Number(e.target.value))}
                  className="w-full max-[1367px]:w-[92%] px-4 py-2 max-[1367px]:py-0  max-[1367px]:px-0 bg-[#a3e7a3] border border-gray-300 rounded-md text-base text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  max-[769px]:w-[90%]"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value} className="text-black ">
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 - coupon + primary button */}
            <div className="relative flex flex-wrap gap-2 max-[769px]:mx-0 max-[1367px]:px-10 max-[769px]:px-0">
              {/* Applied coupon - positioned above the coupon section */}
              {appliedCoupon && (
                <div

                  className="absolute bottom-full mb-1 flex items-center gap-3 font-semibold text-[#015cc8] border-b border-dashed border-[#015cc8] w-fit z-10"
                >
                  <span onClick={handleCouponRemove} className="flex items-center justify-center w-4 h-4 font-bold rounded-full border-[1.5px] border-[#a42021] text-[#a42021] text-base">
                    ×

                  </span>
                  <span>{appliedCoupon.name}</span>
                  <span className="ml-2">{`-$${appliedCoupon.discount.toFixed(2)}`}</span>
                </div>
              )}

              {/* Coupon error - positioned above the coupon section */}
              {couponError && (
                <div className="absolute bottom-full mb-1 px-1 bg-[#fff9f9] border border-[1px] border-[#c02b0b] max-w-[220px] text-blue-600 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis inline-flex z-10">
                  {couponError}
                </div>
              )}

              <div className="flex w-full items-center max-[769px]:py-0 gap-0">
                <span className="text-base text-black font-bold">クーポン</span>
                <input
                  type="text"
                  placeholder=""
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponError) {
                      setCouponError('');
                    }
                  }}
                  disabled={!!appliedCoupon}
                  className="w-24 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleCouponApply}
                  disabled={couponCode.trim() === '' || !!appliedCoupon}
                  className="px-3 py-2 bg-[#01ae00] text-white rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                >
                  適用
                </button>
                {primaryActionLabel && onPrimaryAction && (
                  <button
                    onClick={onPrimaryAction}
                    disabled={primaryActionDisabled}
                    className="ml-auto px-6 py-3 bg-[#01ae00] text-white rounded-full font-medium hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base disabled:outline-none whitespace-nowrap max-[769px]:px-2 max-[769px]:py-2"
                  >
                    {primaryActionLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBar;
