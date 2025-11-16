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
    <div className="menu-container">
      <button onClick={showMenu}>{t('menu')}</button>
      {menu && (
        <div className="menu-items">
          <div className="menu-content">
            <Link href="/select-place">{t('selectPlace')}</Link>
          </div>
          <div className="menu-content">
            <button onClick={() => setShowLang(!showLang)}>{t('language')}</button>
            {showLang && (
              <div className="language-submenu">
                {languages.map(lang => (
                  <button key={lang.code} onClick={() => {setLanguage(lang.code as any); setShowLang(false);}}>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="menu-content">
            <p>{t('aboutUs')}</p>
          </div>
        </div>
      )}
    </div>
  );
}