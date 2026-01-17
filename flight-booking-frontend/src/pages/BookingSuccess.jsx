// pages/BookingSuccess.jsx
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const BookingSuccess = ({ onNewBooking }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // Detect current language from URL
  const currentLang = location.pathname.startsWith('/en') ? 'en' :
    location.pathname.startsWith('/vi') ? 'vi' : 'ja';

  const handleNewBooking = () => {
    if (onNewBooking) {
      onNewBooking();
    }
  };

  // Multi-language content
  const content = {
    ja: {
      title: '予約完了しました。',
      thankYou: '弊社のファストトラックサービスにお申込みいただき、誠にありがとうございます。',
      message: `お客様のご予約内容を確認し、スタッフが速やかに手続きを進めてまいりますので、
今しばらくお待ちください。
何かご不明な点やご要望がございましたら、
以下のいずれかの連絡方法にてお気軽にお問い合わせください。`,
      giftTitle: '🎁VJPファストトラックご利用のお客様へプレゼントです。',
      giftDesc: 'LINEで使える日本語・ベトナム語・英語のAI通訳ツールのプレゼントをご案内致します。',
      aiTransTitle: '★VJP-AiTrans VN-JP-ENとは★',
      aiTransDesc: `「VJP-AiTrans VN-JP-EN」は、日本語・ベトナム語・英語に
対応した自動翻訳LINEチャットボットです。
LINE上で簡単に翻訳ができ、ベトナム滞在中のさまざまなシーンでご活用いただけます。`,
      howToUse: '★使い方はとても簡単！★',
      useCases: '★こんな場面で活躍！★',
      bookingTitle: '国際線・国内線のベトナムファストトラックをすぐ予約はこちら',
      intlButton: 'ベトナム入出国ファストトラック予約フォームを開く',
      domesticButton: 'ベトナム国内線ファストトラック予約フォームを開く'
    },
    en: {
      title: 'Booking Completed',
      thankYou: 'Thank you for applying for our Fast Track service.',
      message: `We will review your booking and our staff will proceed with the arrangements promptly.
Please wait for a moment.
If you have any questions or requests,
please feel free to contact us through any of the following methods:`,
      giftTitle: '🎁 Gift for VJP Fast Track Users',
      giftDesc: 'We are pleased to offer an AI interpretation tool for LINE that supports Japanese, Vietnamese, and English.',
      aiTransTitle: '★ What is VJP-AiTrans VN-JP-EN? ★',
      aiTransDesc: `"VJP-AiTrans VN-JP-EN" is an automatic translation LINE chatbot
supporting Japanese, Vietnamese, and English.
You can easily translate on LINE and use it in various situations during your stay in Vietnam.`,
      howToUse: '★ Very Easy to Use! ★',
      useCases: '★ Perfect for These Situations! ★',
      bookingTitle: 'Book Vietnam Fast Track for International and Domestic Flights Here',
      intlButton: 'Open International Fast Track Booking Form',
      domesticButton: 'Open Domestic Fast Track Booking Form'
    },
    vi: {
      title: 'Đặt chỗ hoàn tất',
      thankYou: 'Cảm ơn bạn đã đăng ký dịch vụ Fast Track của chúng tôi.',
      message: `Chúng tôi sẽ xem xét đặt chỗ của bạn và nhân viên của chúng tôi sẽ tiến hành các thủ tục ngay lập tức.
Vui lòng chờ trong giây lát.
Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào,
vui lòng liên hệ với chúng tôi qua bất kỳ phương thức nào sau đây:`,
      giftTitle: '🎁 Quà tặng cho người dùng VJP Fast Track',
      giftDesc: 'Chúng tôi xin giới thiệu công cụ phiên dịch AI cho LINE hỗ trợ tiếng Nhật, tiếng Việt và tiếng Anh.',
      aiTransTitle: '★ VJP-AiTrans VN-JP-EN là gì? ★',
      aiTransDesc: `"VJP-AiTrans VN-JP-EN" là chatbot dịch tự động trên LINE
hỗ trợ tiếng Nhật, tiếng Việt và tiếng Anh.
Bạn có thể dễ dàng dịch trên LINE và sử dụng trong nhiều tình huống khác nhau khi lưu trú tại Việt Nam.`,
      howToUse: '★ Rất dễ sử dụng! ★',
      useCases: '★ Hoàn hảo cho những tình huống này! ★',
      bookingTitle: 'Đặt Fast Track Việt Nam cho chuyến bay quốc tế và nội địa tại đây',
      intlButton: 'Mở biểu mẫu đặt chỗ Fast Track quốc tế',
      domesticButton: 'Mở biểu mẫu đặt chỗ Fast Track nội địa'
    }
  };

  const text = content[currentLang];

  return (
    <div>
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Spacer */}
          <div className="h-12"></div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black text-center mb-4">{text.title}</h2>
            <div className="border-t-2 border-gray-300 my-6"></div>
          </div>

          {/* Main Content */}
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
              <strong>・{currentLang === 'ja' ? 'お問い合わせフォーム' : currentLang === 'en' ? 'Contact Form' : 'Biểu mẫu liên hệ'}：</strong>
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

          {/* VJP-AiTrans Gift Section */}
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
              {currentLang === 'ja' ? '1.「VJP-AiTrans」をLINEに追加' : currentLang === 'en' ? '1. Add "VJP-AiTrans" to LINE' : '1. Thêm "VJP-AiTrans" vào LINE'}<br />
              {currentLang === 'ja' ? '方法①：添付のLINE用QRコードをスキャンする' : currentLang === 'en' ? 'Method ①: Scan the attached LINE QR code' : 'Phương pháp ①: Quét mã QR LINE đính kèm'}<br />
              <img
                src="https://qr-official.line.me/gs/M_vnjpen_GW.png?from=page&searchId=vnjpen"
                alt="LINE QR Code"
                className="my-4 max-w-xs"
              />
            </p>

            <p className="text-base text-gray-700 mb-4">
              {currentLang === 'ja' ? '方法②：LINEチャットの下記のURLにアクセスする' : currentLang === 'en' ? 'Method ②: Access the URL below in LINE chat' : 'Phương pháp ②: Truy cập URL bên dưới trong LINE chat'}<br />
              <a
                href="https://page.line.me/vnjpen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://page.line.me/vnjpen
              </a><br />
              {currentLang === 'ja' ? '2. 日本語でメッセージを送るだけで、翻訳結果が自動的に表示されます。' : currentLang === 'en' ? '2. Just send a message in your language, and the translation will be displayed automatically.' : '2. Chỉ cần gửi tin nhắn bằng ngôn ngữ của bạn và bản dịch sẽ tự động hiển thị.'}<br />
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

          {/* Booking Section */}
          <div className="mb-8 py-8 bg-white">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">
              {text.bookingTitle}<br />
            </h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleNewBooking}
                className="px-8 py-4 bg-[#01ae00] text-white rounded font-medium hover:bg-[#018800] transition-all duration-300 text-center min-w-[300px]"
                style={{
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <span>{text.intlButton}</span>
              </button>
              <a
                href="https://vietjapan.vip/book-domestic/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#01ae00] text-white rounded font-medium hover:bg-[#018800] transition-all duration-300 text-center min-w-[300px] block"
                style={{
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
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