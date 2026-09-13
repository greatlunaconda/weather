'use client';

import Link from "next/link";
import { useState, startTransition } from "react";
import { saveLanguage , Language, saveShowCurrrentPlace} from "../lib/cookies";
import { LangProp } from "../page";

//import { useLanguage } from "../contexts/language-context";

export default function Menu({lang, showcurrent}:{ lang: LangProp, showcurrent:boolean }) {
  const [menu, setMenu] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [currentplace, setCurrentPlace] = useState(showcurrent);
  //const { language, setLanguage, t } = useLanguage();
 console.log("showcurrent = "+showcurrent); 
  const showMenu = () => setMenu(true);
  const languages: {code: Language, name: string}[] = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'zh_cn', name: '中文' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];
  const handleCurrentPlace = async () => {
     const nextValue = !currentplace; 
     setCurrentPlace(nextValue);

     startTransition(async () => {
     await saveShowCurrrentPlace(nextValue);
  });
};
  return (
    <div className="relative">
      <div>
      <button 
        onClick={showMenu}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
      >
        {lang[1]['menu']}
      </button>
      </div>
      {menu && (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMenu(false)} />
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className={`"absolute top-[3px] left-[10%]"+ ${currentplace ? " green-100  disabled": " green-800 "}`}>   
            <div className="flex items-center gap-[12px]">
              <button 
                type="button"
                role="switch"
                aria-checked={currentplace}
                className={`relative w-[85px] h-[28px] rounded-full border-none p-0 flex items-center cursor-pointer transition-colors duration-200 ${
                    currentplace ? 'bg-[#4cd964]' : 'bg-[#e4e4e7]'}` }
                onClick={handleCurrentPlace}
                >
                {!currentplace && <span className="absolute right-[10px] text-[11px] font-medium text-[#71717a] select-none pointer-events-none"></span>}

              <span className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                currentplace ? 'translate-x-[3px]' : 'translate-x-[60px]'}`}   />
              </button>

              <span className="text-[14px] font-bold">
                   {currentplace ? 'Current Place On' : `Current Place Off` }          
                
              </span>
            </div>
          </div>

          <div className="py-2">
            <Link 
                href="/select-place"
                className="block px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
            >
                {lang[1]['selectPlace']}
            </Link>
          </div>
          <div className="border-t border-gray-100">

            <button 
              onClick={() => setShowLang(!showLang)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 flex justify-between items-center"
            >
              {lang[1]['language']}
              <span className="text-sm">{showLang ? '▲' : '▼'}</span>
            </button> 
              {showLang && (
            <div className="bg-gray-50 border-t border-gray-100">
              {languages.map(lang => (
              <button 
                key={lang.code} 
                onClick={() => {saveLanguage(lang.code); setShowLang(false);}}
                className="w-full text-left px-6 py-2 hover:bg-blue-100 transition-colors text-sm text-gray-600 hover:text-blue-700"
              >
              {lang.name}
              </button>
                  ))}
            </div>
            )}
            </div>
            <div className="border-t border-gray-100">
              <p className="px-4 py-3 text-gray-700">{lang[1]['aboutUs']}</p>
            </div>
          </div>
        
        </>
      )}
    </div>
  );}
