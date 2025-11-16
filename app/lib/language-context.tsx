'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'english' | 'japanese' | 'chinese' | 'russian' | 'spanish' | 'french' | 'arabic';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  english: {
    days: 'Days',
    weather: 'Weather',
    temp: 'Temp',
    pop: 'POP',
    humidity: 'Humidity',
    wind: 'Wind',
    menu: 'menu',
    selectPlace: 'Select Place',
    language: 'Language',
    aboutUs: 'About us',
    noPrecipitation: 'No precipitation'
  },
  japanese: {
    days: '日',
    weather: '天気',
    temp: '気温',
    pop: '降水確率',
    humidity: '湿度',
    wind: '風',
    menu: 'メニュー',
    selectPlace: '場所選択',
    language: '言語',
    aboutUs: '私たちについて',
    noPrecipitation: '降水なし'
  },
  chinese: {
    days: '日期',
    weather: '天气',
    temp: '温度',
    pop: '降水概率',
    humidity: '湿度',
    wind: '风',
    menu: '菜单',
    selectPlace: '选择地点',
    language: '语言',
    aboutUs: '关于我们',
    noPrecipitation: '无降水'
  },
  russian: {
    days: 'Дни',
    weather: 'Погода',
    temp: 'Темп',
    pop: 'Осадки',
    humidity: 'Влажность',
    wind: 'Ветер',
    menu: 'меню',
    selectPlace: 'Выбрать место',
    language: 'Язык',
    aboutUs: 'О нас',
    noPrecipitation: 'Без осадков'
  },
  spanish: {
    days: 'Días',
    weather: 'Clima',
    temp: 'Temp',
    pop: 'Precipitación',
    humidity: 'Humedad',
    wind: 'Viento',
    menu: 'menú',
    selectPlace: 'Seleccionar lugar',
    language: 'Idioma',
    aboutUs: 'Acerca de nosotros',
    noPrecipitation: 'Sin precipitación'
  },
  french: {
    days: 'Jours',
    weather: 'Météo',
    temp: 'Temp',
    pop: 'Précipitations',
    humidity: 'Humidité',
    wind: 'Vent',
    menu: 'menu',
    selectPlace: 'Sélectionner un lieu',
    language: 'Langue',
    aboutUs: 'À propos de nous',
    noPrecipitation: 'Pas de précipitations'
  },
  arabic: {
    days: 'الأيام',
    weather: 'الطقس',
    temp: 'الحرارة',
    pop: 'الأمطار',
    humidity: 'الرطوبة',
    wind: 'الرياح',
    menu: 'القائمة',
    selectPlace: 'اختيار المكان',
    language: 'اللغة',
    aboutUs: 'معلومات عنا',
    noPrecipitation: 'لا توجد أمطار'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english');

  useEffect(() => {
    const saved = document.cookie.split(';').find(c => c.trim().startsWith('language='));
    if (saved) {
      setLanguageState(saved.split('=')[1] as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};