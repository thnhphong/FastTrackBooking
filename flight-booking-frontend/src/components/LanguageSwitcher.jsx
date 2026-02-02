// components/LanguageSwitcher.jsx
import { React, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const LanguageSwitcher = ({ currentLang }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Language labels in different languages
  const languageLabels = {
    en: {
      en: 'English',
      ja: 'Japanese',
      vi: 'Vietnamese'
    },
    ja: {
      en: '英語',
      ja: '日本語',
      vi: 'ベトナム語'
    },
    vi: {
      en: 'Tiếng Anh',
      ja: 'Tiếng Nhật',
      vi: 'Tiếng Việt'
    }
  };

  const languages = [
    {
      code: 'en',
      flag: '🇬🇧'
    },
    {
      code: 'ja',
      flag: '🇯🇵'
    },
    {
      code: 'vi',
      flag: '🇻🇳'
    }
  ];

  // Get label based on current language
  const getLanguageLabel = (langCode) => {
    return languageLabels[currentLang][langCode];
  };

  const [newPath, setNewPath] = useState('')
  const handleLanguageChange = (newLang) => {
    i18n.changeLanguage(newLang);

    let pathWithoutLang = location.pathname;
    if (pathWithoutLang.startsWith('/en/') || pathWithoutLang.startsWith('/vi/')) {
      pathWithoutLang = pathWithoutLang.replace(/^\/(en|vi)/, '');
    }

    let calculatedNewPath;
    if (newLang === 'ja') {
      calculatedNewPath = pathWithoutLang;
    } else {
      calculatedNewPath = `/${newLang}${pathWithoutLang}`;
    }
    setNewPath(calculatedNewPath); 
  };

  useEffect(() => {
    if (newPath) {
      window.location.href = newPath;
    }
  }, [newPath]); 

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`
            flex items-center gap-2 px-2 py-1 rounded-md
            transition-all duration-200 font-medium
          `}
          title={getLanguageLabel(language.code)}
          aria-label={`Switch to ${getLanguageLabel(language.code)}`}
        >
          <span className="text-xl" role="img" aria-label={getLanguageLabel(language.code)}>
            {language.flag}
          </span>
          <span className="text-sm whitespace-nowrap">
            {getLanguageLabel(language.code)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;