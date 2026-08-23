import Image from "next/image";
import { fetchWeather, DetailType } from '@/app/lib/data';
import { Suspense } from "react";
import Menu from "./ui/menu";
import { getLanguage, getPlacesFromCookie, Language, PlaceData } from "./lib/cookies";
import {Currentrow} from "./ui/currentrow";
import  WeatherSkelton  from "./ui/skelton";
import Row from '@/app/ui/row';

const translations:   { [language: string]: { [key: string]: string } } = 
{
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
    aboutUs: 'معلومات عنا'
  }
};

type LangProp =  [language: Language, {[key: string]: string; }]; 

async function RowData({ name, lat, lon, lang, url="" }: { name: string; lat: string; lon: string; lang: LangProp;  url: string}) {
   
  const data: Map<string, DetailType[]> =  await fetchWeather(lat, lon, lang[0] , url);
        
  return (
    <div>
      <Row name={name} weather={data} lang={lang[1]}  />
    </div>
  );
}

export default async function Home() {
  const cookies:PlaceData[] = await getPlacesFromCookie();
  console.log('Cookie data:', cookies); // Debug log
 // const showcurrent = true; //  await getShowCurrentPlace()
  const places: {name: string, lat: string, lon: string, url: string}[] = 
    cookies.length > 0 ? cookies.map(cookie => ({'name': cookie.name, 'lat': cookie.lat, 'lon': cookie.lon, 'url': ""})) : [];
  console.log('Places array:', places); // Debug log  
  const language:Language =  await getLanguage();
  const lang:LangProp  = [language, translations[language]];
  return (
    <>
     <div className="menu  absolute right-[5%] top-1">
       <Menu />
     </div>
     <div className="mt-[49px] ">
      <Suspense key="current" fallback={<WeatherSkelton/>}>
        <Currentrow  lang={language}/>
      </Suspense>
         
         {places &&  places.map((place, index) => 
         <Suspense key={index} fallback={<WeatherSkelton/> }>
           <RowData name={place.name} lat={place.lat} lon={place.lon} lang={lang} url={place.url}  />
         </Suspense>
         )}
  </div>
  </>
  )
}