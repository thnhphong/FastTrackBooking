import { useTranslation } from "react-i18next";
const FieldRequired = ({ label, required, children, error, isEmpty, customErrorMessage }) => {
  const { t } = useTranslation();
  const hasError = error && isEmpty;
  // Show custom error message if provided, otherwise check if it's a validation error (not just empty)
  const showCustomError = error && customErrorMessage && !isEmpty;

  return (
    //make the field with higher height 
    <div>
      <label className={`block text-base font-regular mb-2 ${(hasError || showCustomError) ? 'text-[#c02b0b]' : 'text-black'}`}>
        {label}
        {required && (
          <span className="text-[#c02b0b] font-regular italic ml-1">
            {t(`booking.require_label`)}
          </span>
        )}
      </label>
      {children}
      {hasError && (
        <div className="mt-1 p-3 border border-[#c02b0b]">
          <p className="text-base text-blue-600">{t(`booking.field_require_text`)}</p>
        </div>
      )}
      {showCustomError && (
        <div className="mt-1 p-3 max-[640px]:p-2 border border-[#c02b0b]">
          <p className="text-base max-[640px]:text-sm text-blue-600">{customErrorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FieldRequired;

