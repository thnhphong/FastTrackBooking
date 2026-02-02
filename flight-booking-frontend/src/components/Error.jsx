import { useTranslation } from "react-i18next";
const Error = ({ message }) => {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <div className="mb-6 p-3 border-2 border-[#b98d5d] rounded-lg shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-base">!</span>
        </div>
        <p className="text-[#b98d5d] font-small">{t(`booking.error_text`)}</p>
      </div>
    </div>
  );
};

export default Error;

