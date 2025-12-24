import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingStep1 from './components/BookingStep1';
import BookingStep2 from './components/BookingStep2';
import BookingStep3 from './components/BookingStep3';
import BookingSuccess from './components/BookingSuccess';
import LineInquiry from './components/LineInquiry';
import Footer from './components/Footer';
import './App.css';

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
  // Additional fields from ApiJson.txt
  date_of_birth: '',
  passport_expiry_date: '',
  passport_number: '',
  sex: null,
  nationality: '',
  add_ons: [],
  // Immigration fields
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
  // Emigration fields
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
  // bookingData is kept purely in React state; we do NOT persist it to localStorage.
  const [bookingData, setBookingData] = useState(getDefaultBookingData);

  return (
    <Router>
      <LineInquiry />
      <div className="w-[90vw] mx-20 max-[1150px]:w-[100vw] max-[1150px]:mx-0">
        <div className="flex flex-wrap justify-center w-[100%] mb-8 overflow-hidden max-[1150px]:w-[96vw]">
          <img src="/uploads/vjp-flight-booking-banner.jpg" alt="" />
        </div>
        <div className="text-blue-800 flex flex-start w-[90vw] mx-auto mb-8 font-bold hover:underline max-[1150px]:w-[96vw]">
          <a href="https://vietjapan.vip/book-domestic/" target="_blank" rel="noopener noreferrer">
            ベトナム国内線ファストトラックの予約はこちら＞＞
          </a>
        </div>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/book-now/" replace />} />
            <Route
              path="/book-now/"
              element={
                <BookingStepRouter
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                />
              }
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

// Router component to handle step routing with internal state
function BookingStepRouter({ bookingData, setBookingData }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Check sessionStorage directly in render to show success page
  const isSuccess = sessionStorage.getItem('bookingSuccess') === 'true';

  // Clear flag and reset data when success is detected
  if (isSuccess) {
    sessionStorage.removeItem('bookingSuccess');
    setBookingData(getDefaultBookingData());
  }

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Show success page if booking was successful
  if (isSuccess) {
    return <BookingSuccess onNewBooking={() => {
      setCurrentStep(1);
      setBookingData(getDefaultBookingData());
    }} />;
  }

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
