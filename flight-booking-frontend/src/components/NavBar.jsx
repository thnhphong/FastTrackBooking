// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // or use <a> if no React Router
import LineInquiry from './LineInquiry';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <nav className="bg-white w-[100vw] flex justify-evenly align-center mx-auto">
      <div className="w-[100vw] flex justify-evenly align-center px-4 py-3">
        <div className="flex items-center gap-10 h-20">
          {/* 1. Logo */}
          <a href="https://vietjapan.vip" className="flex-shrink-0 max-[1025px]:scale-1.4">
            <img
              src="https://vietjapan.vip/wp-content/uploads/2024/12/cropped-vjp-ft-logo-ngang-web-header-4-4-e1735100765817.png" // put your image in public/
              alt="VJP Fast Track Logo"
              className="h-auto object-contain max-w-[15vw] max-[1025px]:max-w-[28vw]"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* 2. すぐ予約 Button */}
            <a
              href="https://vietjapan.vip/book-now/"
              className="bg-[#00ae00] hover:bg-[#2dae00] text-white font-bold text-lg px-10 py-5 rounded-[10px] transition-colors duration-300 max-[1025px]:scale-75"
            >
              すぐ予約
            </a>

            {/* 3. Main Navigation */}
            <ul className="flex flex-wrap items-center space-x-10 block max-[1025px]:hidden">
              <li>
                <a
                  href="https://vietjapan.vip/"
                  className="text-gray-800 hover:text-blue-800 font-light transition-colors cursor-pointer"
                >
                  ホーム
                </a>
              </li>

              {/* VJPファストトラックとは Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-800 hover:text-blue-800 font-light transition-colors focus:outline-none cursor-pointer text-lg"
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  <strong>VJP</strong>ファストトラックとは
                  <svg
                    className="ml-2 w-4 h-4 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-1/2 right-1/2 transform -translate-x-1/2 top-5 w-60 bg-white py-2 mt-2 transition-all duration-200 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  <ul className="text-sm text-gray-700">
                    <li className="border-b border-[#01ae00] last:border-0">
                      <a
                        href="https://vietjapan.vip/tan-son-nhat-entry-vip-fasttrack/"
                        className="block px-6 py-3 hover:bg-[#2dae00] hover:text-white transition-colors"
                      >
                        【入国専用】ホーチミン・タンソンニャット空港VIPファストトラック｜ベトナム入国を最速で｜日本語サポート
                      </a>
                    </li>
                    <li className="border-b border-[#01ae00]">
                      <a
                        href="https://vietjapan.vip/%e3%80%90%e5%87%ba%e5%9b%bd%e5%b0%82%e7%94%a8%e3%80%91%e3%83%9b%e3%83%bc%e3%83%81%e3%83%9f%e3%83%b3%e3%83%bb%e3%82%bf%e3%83%b3%e3%82%bd%e3%83%b3%e3%83%8b%e3%83%a3%e3%83%83%e3%83%88%e7%a9%ba%e6%b8%afvi/"
                        className="block px-6 py-3 hover:bg-[#2dae00] hover:text-white transition-colors"
                      >
                        【出国専用】ホーチミン・タンソンニャット空港VIPファストトラック｜チェックインをスムーズに｜日本語サポート
                      </a>
                    </li>
                    <li className="border-b border-[#01ae00]">
                      <a
                        href="https://vietjapan.vip/tan-son-nhat-airport-fasttrack/"
                        className="block px-6 py-3 hover:bg-[#2dae00] hover:text-white transition-colors"
                      >
                        タンソンニャットファストトラックとは
                      </a>
                    </li>
                    <li className="border-b border-[#01ae00]">
                      <a
                        href="https://vietjapan.vip/hanoi-noibai-fasttrack/"
                        className="block px-6 py-3 hover:bg-[#2dae00] hover:text-white transition-colors"
                      >
                        ハノイ・ノイバイファストトラックとは
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vietjapan.vip/danang-fasttrack/"
                        className="block px-6 py-3 hover:bg-[#2dae00] hover:text-white transition-colors"
                      >
                        ダナンファストトラックとは
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <li>
                <a href="https://vietjapan.vip/contact/" className="text-black hover:text-blue-800 font-light transition-colors">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="https://vietjapan.vip/faq/" className="text-black hover:text-[#0d1f49] font-light transition-colors">
                  よくあるご質問
                </a>
              </li>
              <li>
                <a href="https://vietjapan.vip/news/" className="text-black hover:text-[#0d1f49] font-light transition-colors cursor-pointer">
                  お知らせ
                </a>
              </li>
              <li>
                <a href="https://vietjapan.vip/blog/" className="text-black hover:text-[#0d1f49] font-light transition-colors cursor-pointer">
                  ブログ
                </a>
              </li>
            </ul>

            <div className="relative">
              <input type="hidden" name="post_type" value="post" />
              {/* Search Icon + Dropdown */}
              <div className="relative max-[1025px]:hidden">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 text-[#01ae00] hover:text-[#0d9520] transition-colors focus:outline-none"
                  aria-label="Search"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                  </svg>
                </button>

                {/* Search Icon + Dropdown */}
                <div className="relative">

                  {/* Search Input Only Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute right-0 mt-4 bg-white w-80 shadow-2xl rounded-sm overflow-hidden z-50 border border-[#1a3e92] border-width-1">
                      <form
                        method="get"
                        action="https://vietjapan.vip/"
                      >
                        <input type="hidden" name="post_type" value="post" />

                        <input
                          type="search"
                          name="s"
                          autoFocus
                          required
                          className="w-full py-2"
                        />
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="flex flex-col items-center gap-2 p-2 fill-[#00AE00] hidden max-[1025px]:flex">
            <a href="https://page.line.me/vietjapan.vip" className="w-11 h-11 hover:scale-90 transition-all duration-300">
              <svg aria-hidden="true" className="e-font-icon-svg e-fab-line" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"></path></svg>
            </a>
            <a href="https://page.line.me/vietjapan.vip" className="text-base text-black">
              LINEお問い合わせ
            </a>
          </div>

          {/* Mobile Menu Button - hamburger menu */}
          {/* onclick switch to x icon*/}
          <div className="hidden max-[1025px]:block">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 focus:outline-none cursor-pointer bg-gray-100 rounded-md p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {/* Hamburger (3 lines) - visible when menu closed */}
                <path
                  className={`transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />

                {/* X Icon - visible when menu open */}
                <path
                  className={`transition-all duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Appears below the navbar */}
      {/* transition the dropdown menu from top to bottom*/}
      {mobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-white z-50 flex justify-center items-center transition-all duration-300 hidden max-[1025px]:block">
          <div className="text-center w-full">
            <a href="https://vietjapan.vip/" className="block text-gray-800 hover:text-[#0d1f49] text-sm font-light border-b border-[#01ae00] z-50 hover:bg-[#01ae00] hover:text-white py-2">ホーム</a>
            <a href="https://vietjapan.vip/about-vjp-fasttrack" className="block text-gray-800 hover:text-[#0d1f49] text-sm font-light border-b border-[#01ae00] z-50 hover:bg-[#01ae00] hover:text-white py-2">
            <strong className="font-medium">VJP</strong>ファストトラックとは</a>
            <a href="https://vietjapan.vip/contact/" className="block text-gray-800 hover:text-[#0d1f49] text-sm font-light border-b border-[#01ae00] z-50 hover:bg-[#01ae00] hover:text-white py-2">お問い合わせ</a>
            <a href="https://vietjapan.vip/faq/" className="block text-gray-800 hover:text-[#0d1f49] text-sm font-light border-b border-[#01ae00] z-50 hover:bg-[#01ae00] hover:text-white py-2">よくあるご質問</a>
            <a href="https://vietjapan.vip/news/" className="block text-gray-800 hover:text-[#0d1f49] text-sm font-light border-b border-[#01ae00] z-50 hover:bg-[#01ae00] hover:text-white py-2">お知らせ</a>
            <a href="https://vietjapan.vip/blog/" className="block text-gray-800 hover:text-[#0d1f49] text-sm font-light border-b border-[#01ae00] z-50 hover:bg-[#01ae00] hover:text-white py-2">ブログ</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;