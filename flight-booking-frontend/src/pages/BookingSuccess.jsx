// pages/BookingSuccess.jsx
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import banner from '../assets/images/vjp-flight-booking-banner.jpg';

const BookingSuccess = ({ onNewBooking }) => {
  const handleNewBooking = () => {
    if (onNewBooking) {
      onNewBooking();
    }
  };

  const text = {
    title: '予約完了しました。',
    thankYou: '弊社のファストトラックサービスにお申込みいただき、誠にありがとうございます。',
    message: `お客様のご予約内容を確認し、スタッフが速やかに手続きを進めてまいりますので、
今しばらくお待ちください。
何かご不明な点やご要望がございましたら、
以下のいずれかの連絡方法にてお気軽にお問い合わせください。`,
    giftTitle: '🎁VJPファストラックご利用のお客様へプレゼントです。',
    giftDesc: 'LINEで使える日本語・ベトナム語・英語のAI通訳ツールのプレゼントをご案内致します。',
    aiTransTitle: '★VJP-AiTrans VN-JP-ENとは★',
    aiTransDesc: `「VJP-AiTrans VN-JP-EN」は、日本語・ベトナム語・英語に
対応した自動翻訳LINEチャットボットです。
LINE上で簡単に翻訳ができ、ベトナム滞在中のさまざまなシーンでご活用いただけます。`,
    howToUse: '★使い方はとても簡単！★',
    bookingTitle: '国際線・国内線のベトナムファストトラックをすぐ予約はこちら',
    intlButton: 'ベトナム入出国ファストトラック予約フォームを開く',
    domesticButton: 'ベトナム国内線ファストトラック予約フォームを開く'
  };

  return (
    <div className="w-[100vw]">
      <Navbar />
      <div className="flex flex-wrap justify-center w-[100%] mb-8 overflow-hidden max-[1150px]:w-[96vw]">
        <img src={banner} alt="VJP Flight Booking" />
      </div>
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-[90vw] mx-20 max-[1150px]:w-[100vw] max-[1150px]:mx-0 max-w-6xl mx-auto px-4 py-8">
          <div className="h-12" />
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black text-center mb-4">{text.title}</h2>
            <div className="border-t-2 border-gray-300 my-6" />
          </div>
          <div className="mb-8">
            <p className="text-base text-left mb-4">
              <strong className="text-black">{text.thankYou}</strong>
            </p>
            <p className="text-base text-gray-700 text-left mb-6" style={{ whiteSpace: 'pre-line' }}>
              {text.message}
              <br /><br />
              <strong>・Line OA：</strong>
              <a
                href="https://page.line.me/vjp.fasttrack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://page.line.me/vjp.fasttrack
              </a><br />
              <strong>・お問い合わせフォーム：</strong>
              <a
                href="https://vietjapan.vip/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://vietjapan.vip/contact/
              </a><br />
              <strong>・Email：</strong>
              <a
                href="mailto:fasttrack@vietjapan.vip"
                className="text-blue-600 hover:underline"
              >
                fasttrack@vietjapan.vip
              </a>
            </p>
          </div>
          <div className="mb-8">
            <p className="text-base text-gray-700 mb-4">
              <strong>{text.giftTitle}</strong><br />
              {text.giftDesc}
            </p>
            <p className="text-base text-gray-700 mb-4" style={{ whiteSpace: 'pre-line' }}>
              <strong>{text.aiTransTitle}</strong><br />
              {text.aiTransDesc}
            </p>
            <p className="text-base text-gray-700 mb-4">
              <strong>{text.howToUse}</strong><br />
              1.「VJP-AiTrans」をLINEに追加<br />
              方法①：添付のLINE用QRコードをスキャンする<br />
              <img
                src="https://qr-official.line.me/gs/M_vnjpen_GW.png?from=page&searchId=vnjpen"
                alt="LINE QR Code"
                className="my-4 max-w-xs"
              />
            </p>
            <p className="text-base text-gray-700 mb-4">
              方法②：LINEチャットの下記のURLにアクセスする<br />
              <a
                href="https://page.line.me/vnjpen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://page.line.me/vnjpen
              </a><br />
              2. 日本語でメッセージを送るだけで、翻訳結果が自動的に表示されます。<br />
              <a
                href="https://www.youtube.com/shorts/S2muz2f684c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://www.youtube.com/shorts/S2muz2f684c
              </a>
            </p>
          </div>
          <div className="mb-8 py-8 bg-white">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">
              {text.bookingTitle}<br />
            </h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleNewBooking}
                className="px-8 py-4 bg-[#01ae00] text-white rounded font-medium hover:bg-[#018800] transition-all duration-300 text-center min-w-[300px]"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <span>{text.intlButton}</span>
              </button>
              <a
                href="https://vietjapan.vip/book-domestic/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#01ae00] text-white rounded font-medium hover:bg-[#018800] transition-all duration-300 text-center min-w-[300px] block"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <span>{text.domesticButton}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;
