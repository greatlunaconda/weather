'use client';

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../lib/language-context";

export default function Menu() {
  const [menu, setMenu] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const showMenu = () => setMenu(true);
  const languages = [
    { code: 'english', name: 'English' },
    { code: 'japanese', name: '日本語' },
    { code: 'chinese', name: '中文' },
    { code: 'russian', name: 'Русский' },
    { code: 'spanish', name: 'Español' },
    { code: 'french', name: 'Français' },
    { code: 'arabic', name: 'العربية' }
  ];

  return (
    <div className="relative">
      <div>
      <button 
        onClick={showMenu}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
      >
        {t('menu')}
      </button>
      </div>
      {menu && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMenu(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="py-2">
              <Link 
                href="/select-place"
                className="block px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              >
                {t('selectPlace')}
              </Link>
            </div>
            <div className="border-t border-gray-100">
              <button 
                onClick={() => setShowLang(!showLang)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 flex justify-between items-center"
              >
                {t('language')}
                <span className="text-sm">{showLang ? '▲' : '▼'}</span>
              </button>
              {showLang && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {languages.map(lang => (
                    <button 
                      key={lang.code} 
                      onClick={() => {setLanguage(lang.code as any); setShowLang(false);}}
                      className="w-full text-left px-6 py-2 hover:bg-blue-100 transition-colors text-sm text-gray-600 hover:text-blue-700"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-100">
              <p className="px-4 py-3 text-gray-700">{t('aboutUs')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );}
