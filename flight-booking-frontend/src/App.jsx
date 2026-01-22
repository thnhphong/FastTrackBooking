import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import banner from './assets/images/vjp-flight-booking-banner.jpg';

//pages
import BookingStep1 from './pages/BookingStep1';
import BookingStep2 from './pages/BookingStep2';
import BookingStep3 from './pages/BookingStep3';
import BookingSuccess from './pages/BookingSuccess';

//components
import Navbar from './components/NavBar';
import LanguageSwitcher from './components/LanguageSwitcher';
import LineInquiry from './components/LineInquiry';
import './App.css';

const SUPPORTED_LANGUAGES = ['en', 'ja', 'vi'];
const DEFAULT_LANGUAGE = 'ja';

const getDefaultBookingData = () => ({
  booking_type: null,
  immigration: null,
  emigration: null,
  passport: null,
  contact_method: '',
  survey_channel: '',
  first_name: '',
  last_name: '',
  user_phone_number: '',
  contact_email_to: '',
  contact_email_cc: '',
  optional_company_name: '',
  referred_by_name: '',
  preliminary_calculation: 0,
  sub_price: 0,
  tax: 0,
  total: 0,
  coupon_id: null,
  payment_method: null,
  date_of_birth: '',
  passport_expiry_date: '',
  passport_number: '',
  sex: null,
  nationality: '',
  add_ons: [],
  arrival_airport: null,
  arrival_date: '',
  arrival_flight_number: '',
  arrival_flight_reservation_code: '',
  arrival_phone_number: '',
  arrival_request: '',
  entry_fast_track_option: null,
  tarmac_pickup: false,
  use_immigration_fast_track: false,
  pickup_service: 0,
  departure_airport_code: null,
  departure_date: '',
  departure_flight_number: '',
  departure_flight_reservation_code: '',
  departure_phone_number: '',
  departure_request: '',
  departure_fast_track_option: null,
  departure_seating_preferences: null,
  departure_meeting_time: '',
  use_departure_fast_track: false,
});

function App() {
  const [bookingData, setBookingData] = useState(getDefaultBookingData);

  return (
    <Router>
      <LineInquiry />
      <Routes>
        {/* Root redirects to default Japanese booking */}
        <Route path="/" element={<Navigate to="/book-now" replace />} />

        {/* Japanese (default) - no language prefix */}
        <Route path="/book-now" element={<LanguageWrapper lang="ja" page="booking" bookingData={bookingData} setBookingData={setBookingData} />} />
        <Route path="/booking_success" element={<LanguageWrapper lang="ja" page="success" bookingData={bookingData} setBookingData={setBookingData} />} />

        {/* English - with /en prefix */}
        <Route path="/en/book-now" element={<LanguageWrapper lang="en" page="booking" bookingData={bookingData} setBookingData={setBookingData} />} />
        <Route path="/en/booking_success" element={<Navigate to="/booking_success" replace />} />

        {/* Vietnamese - with /vi prefix */}
        <Route path="/vi/book-now" element={<LanguageWrapper lang="vi" page="booking" bookingData={bookingData} setBookingData={setBookingData} />} />
        <Route path="/vi/booking_success" element={<Navigate to="/booking_success" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/book-now" replace />} />
      </Routes>
    </Router>
  );
}

// Language wrapper component that handles i18n and SEO
function LanguageWrapper({ lang, page, bookingData, setBookingData }) {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Update i18next language
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Get base URL for SEO tags
  const baseUrl = 'https://vietjapan.vip';

  // Determine current path without language prefix
  const pathWithoutLang = location.pathname.replace(/^\/(en|vi)/, '');

  // Generate alternate URLs for each language
  const getAlternateUrl = (language) => {
    if (language === 'ja') {
      return `${baseUrl}${pathWithoutLang}`;
    }
    return `${baseUrl}/${language}${pathWithoutLang}`;
  };

  // Page titles for each language
  const pageTitles = {
    ja: 'ベトナムファストトラック | 日本人向け空港入国・出国優先サービス – VJPファストトラック公式 - 日本人向けベトナムファストトラック | ベトナム 優先入国審査 | ベトナムファストトラック',
    en: 'VJP Fast Track - Vietnamese Airport Support for Japanese Travelers | Smooth Entry and Exit Procedures',
    vi: 'VJP Fast Track - Dịch vụ hỗ trợ sân bay Việt Nam cho du khách Nhật Bản | Thủ tục xuất nhập cảnh nhanh chóng'
  };

  // Meta descriptions for each language
  const metaDescriptions = {
    ja: 'VJPファストトラックサービスは、日本人のお客様に向けたベトナムの空港での優先サービスをご提供します。入国・出国手続きがスムーズで、待ち時間を最小限に抑え、快適な旅を実現します | タンソンニャット国際空港 優先レーン | ベトナムファストトラック | ベトナム 優先入国審査 | ハノイ ファストトラック',
    en: 'VJP Fast Track service provides priority services at Vietnamese airports for Japanese travelers. Smooth entry and exit procedures with minimal waiting time for comfortable travel | Tan Son Nhat Airport Priority Lane | Vietnam Fast Track | Hanoi Fast Track',
    vi: 'Dịch vụ VJP Fast Track cung cấp dịch vụ ưu tiên tại các sân bay Việt Nam cho du khách Nhật Bản. Thủ tục xuất nhập cảnh nhanh chóng với thời gian chờ tối thiểu | Làn ưu tiên sân bay Tân Sơn Nhất | Fast Track Việt Nam | Fast Track Hà Nội'
  };

  return (
    <>
      {/* SEO Meta Tags with hreflang */}
      <Helmet>
        <html lang={lang} />

        {/* Dynamic Title */}
        <title>{pageTitles[lang]}</title>

        {/* Meta Description */}
        <meta name="description" content={metaDescriptions[lang]} />

        {/* Canonical URL */}
        <link rel="canonical" href={lang === 'ja' ? `${baseUrl}${pathWithoutLang}` : `${baseUrl}/${lang}${pathWithoutLang}`} />

        {/* Alternate language versions - CRITICAL FOR SEO */}
        <link rel="alternate" hrefLang="ja" href={getAlternateUrl('ja')} />
        <link rel="alternate" hrefLang="en" href={getAlternateUrl('en')} />
        <link rel="alternate" hrefLang="vi" href={getAlternateUrl('vi')} />
        <link rel="alternate" hrefLang="x-default" href={getAlternateUrl('ja')} />

        {/* Open Graph tags */}
        <meta property="og:locale" content={lang === 'ja' ? 'ja_JP' : lang === 'en' ? 'en_US' : 'vi_VN'} />
        <meta property="og:title" content={pageTitles[lang]} />
        <meta property="og:description" content={metaDescriptions[lang]} />
        <meta property="og:url" content={lang === 'ja' ? `${baseUrl}${pathWithoutLang}` : `${baseUrl}/${lang}${pathWithoutLang}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VJP Fast Track" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitles[lang]} />
        <meta name="twitter:description" content={metaDescriptions[lang]} />

        {/* Additional locale alternates for Open Graph */}
        <meta property="og:locale:alternate" content="ja_JP" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="vi_VN" />
      </Helmet>

      {/* Render page based on 'page' prop */}
      {page === 'success' ? (
        <BookingSuccessPage lang={lang} setBookingData={setBookingData} />
      ) : (
        <>
          <Navbar />
          <div className="w-[90vw] mx-20 max-[1150px]:w-[100vw] max-[1150px]:mx-0">
            {/* Language Switcher */}
            <div className="flex justify-end mb-4 max-[1150px]:px-4">
              <LanguageSwitcher currentLang={lang} />
            </div>

            <div className="flex flex-wrap justify-center w-[100%] mb-8 overflow-hidden max-[1150px]:w-[96vw]">
              <img src={banner} alt="VJP Flight Booking" />
            </div>

            <div className="text-blue-800 flex flex-start w-[90vw] mx-auto mb-8 font-bold hover:underline max-[1150px]:w-[96vw]">
              <a href="https://vietjapan.vip/book-domestic/" target="_blank" rel="noopener noreferrer">
                {lang === 'ja' && 'ベトナム国内線ファストトラックの予約はこちら＞＞'}
                {lang === 'en' && 'Vietnam Domestic Fast Track Booking Here >>'}
                {lang === 'vi' && 'Đặt Fast Track chuyến bay nội địa tại đây >>'}
              </a>
            </div>

            <div className="App">
              <BookingStepRouter bookingData={bookingData} setBookingData={setBookingData} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Booking Success Page Component
function BookingSuccessPage({ lang, setBookingData }) {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSuccessFlag = sessionStorage.getItem('bookingSuccess') === 'true';
    if (hasSuccessFlag) {
      sessionStorage.setItem('hasViewedSuccess', 'true');
      sessionStorage.removeItem('bookingSuccess');
      setBookingData(getDefaultBookingData());
    }
  }, [setBookingData]);

  const getBookingUrl = () => (lang === 'ja' ? '/book-now' : `/${lang}/book-now`);

  return (
    <BookingSuccess
      onNewBooking={() => {
        sessionStorage.removeItem('hasViewedSuccess');
        setBookingData(getDefaultBookingData());
        navigate(getBookingUrl(), { replace: true });
      }}
    />
  );
}

// Router component to handle step routing with internal state
function BookingStepRouter({ bookingData, setBookingData }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  switch (currentStep) {
    case 1:
      return (
        <BookingStep1
          bookingData={bookingData}
          setBookingData={setBookingData}
          onNextStep={handleNextStep}
        />
      );
    case 2:
      return (
        <BookingStep2
          bookingData={bookingData}
          setBookingData={setBookingData}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      );
    case 3:
      return (
        <BookingStep3
          bookingData={bookingData}
          onPrevStep={handlePrevStep}
        />
      );
    default:
      setCurrentStep(1);
      return null;
  }
}

export default App;