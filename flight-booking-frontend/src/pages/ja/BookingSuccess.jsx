import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
const BookingSuccess = ({ onNewBooking }) => {
  const navigate = useNavigate();

  const handleNewBooking = () => {
    if (onNewBooking) {
      onNewBooking();
    }
    // Navigate to /book-now/ to start a new booking
    navigate('/book-now/');
  };

  return (
    <div >
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Spacer */}
        <div className="h-12"></div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-black text-center mb-4">予約完了しました。</h2>
          <div className="border-t-2 border-gray-300 my-6"></div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <p className="text-base text-left mb-4">
            <strong className="text-black">弊社のファストトラックサービスにお申込みいただき、誠にありがとうございます。</strong>
          </p>
          <p className="text-base text-gray-700 text-left mb-6">
            お客様のご予約内容を確認し、スタッフが速やかに手続きを進めてまいりますので、<br />
            今しばらくお待ちください。<br />
            何かご不明な点やご要望がございましたら、<br />
            以下のいずれかの連絡方法にてお気軽にお問い合わせください。<br />
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
            <strong>・メール：</strong>
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
            <strong>🎁VJPファストトラックご利用のお客様へプレゼントです。</strong><br />
            LINEで使える日本語・ベトナム語・英語のAI通訳ツールのプレゼントをご案内致します。
          </p>

            <p className="text-base text-gray-700 mb-4">
            <strong>★VJP-AiTrans VN-JP-ENとは★</strong><br />
            「<strong>VJP-AiTrans VN-JP-EN</strong>」は、<strong>日本語・ベトナム語・英語</strong>に<br />
            対応した自動翻訳LINEチャットボットです。<br />
            LINE上で簡単に翻訳ができ、ベトナム滞在中のさまざまなシーンでご活用いただけます。
          </p>

          <p className="text-base text-gray-700 mb-4">
            <strong>★使い方はとても簡単！★</strong><br />
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
            3. グループチャットに追加すれば、関係者とのやり取りもスムーズにできます。<br />
            ※英語訳も同時に表示されるため、翻訳内容の確認も安心です。<br />
            自動翻訳チャットボットの使い方の紹介はこちらです。<br />
                <a
                  href="https://www.youtube.com/shorts/S2muz2f684c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.youtube.com/shorts/S2muz2f684c
                </a>
              </p>

          <p className="text-base text-gray-700 mb-4">
            <strong>★こんな場面で活躍！★</strong><br />
            ・空港・ホテル・レストランでのやり取り<br />
            ・現地スタッフとのチャット会話<br />
            ・ビジネス現場でのグループコミュニケーション<br />
            ・ベトナムの知人との日常チャット<br />
            ・自分専用の翻訳ツールとして など
          </p>

          <p className="text-base text-gray-700 mb-4">
            この機会にぜひ「VJP-AiTrans」をご体験いただき、<br />
            <strong>より快適で安心なベトナム滞在</strong>をお楽しみくださいませ。
          </p>

          <p className="text-base text-gray-700 mb-6">
            ご不明な点がございましたら、<br />
            LINE公式アカウントまでお気軽にお問い合わせください。<br />
            <strong>・Line OAお問い合わせ：</strong>
              <a
                href="https://page.line.me/vjp.fasttrack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://page.line.me/vjp.fasttrack
            </a><br />
            宜しくお願い致します。
          </p>
        </div>

        {/* Booking Section */}
        <div className="mb-8 py-8 bg-white">
          <h3 className="text-2xl font-bold text-black mb-6 text-center">
            国際線・国内線のベトナムファストトラックをすぐ予約はこちら<br />
          </h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleNewBooking}
              className="px-8 py-4 bg-[#01ae00] text-white rounded font-medium hover:bg-[#018800] transition-all duration-300 text-center min-w-[300px]"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span>ベトナム入出国ファストトラック予約フォームを開く</span>
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
              <span>ベトナム国内線ファストトラック予約フォームを開く</span>
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
