import Image from "next/image";
import { fetchWeather, DetailType } from '@/app/lib/data';
import { Suspense } from "react";
import Menu from "./ui/menu";
import { getLanguage, getPlacesFromCookie, getShowCurrentPlace, Language, PlaceData } from "./lib/cookies";
import {Currentrow} from "./ui/currentrow";
import  WeatherSkelton  from "./ui/skelton";
import Row from '@/app/ui/row';
import Showcurrent from "./ui/showcurrent";

const translations:   { [language: string]: { [key: string]: string | string[] } } = 
{
  en: {
    days: 'Days',
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weather: 'Weather',
    temp: 'Temp',
    pop: 'POP',
    _: 'No precipitation',
    hours: 'Hours',
    humidity: 'Humidity',
    wind: 'Wind',
    menu: 'menu',
    selectPlace: 'Select Place',
    language: 'Language',
    aboutUs: 'About us',
  },
  ja: {
    days: '日',
    week: ['日', '月', '火', '水', '木', '金', '土'],
    weather: '天気',
    temp: '気温',
    pop: '降水確率',
    _: '降水無し',
    hours: 'Hours',
    humidity: '湿度',
    wind: '風',
    menu: 'メニュー',
    selectPlace: '場所選択',
    language: '言語',
    aboutUs: '私たちについて',
  },
  zh_cn: {
    days: '日期',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    weather: '天气',
    temp: '温度',
    pop: '降水概率',
    _: '无降水',
    hours: '时间',
    humidity: '湿度',
    wind: '风',
    menu: '菜单',
    selectPlace: '选择地点',
    language: '语言',
    aboutUs: '关于我们',
  },
  ru: {
    days: 'Дни',
    week: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    weather: 'Погода',
    temp: 'Темп',
    pop: 'Осадки',
    _: 'Без осадков',
    hours: 'Время',
    humidity: 'Влажность',
    wind: 'Ветер',
    menu: 'меню',
    selectPlace: 'Выбрать место',
    language: 'Язык',
    aboutUs: 'О нас',
  },
  es: {
    days: 'Días',
    week: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    weather: 'Clima',
    temp: 'Temp',
    pop: 'Precipitación',
    _: 'Sin precipitaciones',
    humidity: 'Humedad',
    hours: 'Hora',
    wind: 'Viento',
    menu: 'menú',
    selectPlace: 'Seleccionar lugar',
    language: 'Idioma',
    aboutUs: 'Acerca de nosotros',
  },
  fr: {
    days: 'Jours',
    week: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    weather: 'Météo',
    temp: 'Temp',
    pop: 'Précipitations',
    _: 'Aucune précipitation',
    hours: 'Heure',
    humidity: 'Humidité',
    wind: 'Vent',
    menu: 'menu',
    selectPlace: 'Sélectionner un lieu',
    language: 'Langue',
    aboutUs: 'À propos de nous',
  },
  ar: {
    days: 'الأيام',
    week: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    weather: 'الطقس',
    temp: 'الحرارة',
    pop: 'الأمطار',
    _: 'لا هطول للأمطار',
    hours: 'الوقت',
    humidity: 'الرطوبة',
    wind: 'الرياح',
    menu: 'القائمة',
    selectPlace: 'اختيار المكان',
    language: 'اللغة',
    aboutUs: 'معلومات عنا'
  }
};

export type LangProp =  [language: Language, {[key: string]: string |string[]; }]; 

async function RowData({ name, lat, lng, lang, url="" }: { name: string; lat: string; lng: string; lang: LangProp;  url: string}) {
   
  const data: {name:string,details:Map<string, DetailType[]>} =  await fetchWeather(lat, lng, lang[0] , url);
    const cityname = name.startsWith("default") ? data.name : name ; 
  return (
    <div>
      <Row weather={data.details} lang={lang[1]}  name={cityname} />
    </div>
  );
}

export default async function Home() {
  const cookies:PlaceData[] = await getPlacesFromCookie();
  const showcurrent:boolean = await getShowCurrentPlace(); 
  console.log('Cookie data:', showcurrent); // Debug log
 // const showcurrent = true; //  await getShowCurrentPlace()
  const places: {name: string, lat: string, lng: string, url: string}[] = 
    cookies.length > 0 ? cookies.map(cookie => ({'name': cookie.name, 'lat': cookie.lat, 'lng': cookie.lng, 'url': ""})) : [];
  console.log('Places array:', places); // Debug log  
  const language:Language =  await getLanguage();
  const lang:LangProp  = [language, translations[language]];
  return (
    <>
     <div className="menu  absolute right-[5%] top-1">
       <Menu lang={lang} showcurrent={showcurrent} />
     </div>
     <div className="mt-[49px] "> 
      { showcurrent &&
      <Suspense key="current" fallback={<WeatherSkelton/>}>
        <Currentrow  lang={lang} />
      </Suspense>
      }
         {places &&  places.map((place, index) => 
         <Suspense key={index} fallback={<WeatherSkelton/> }>
           <RowData name={place.name} lat={place.lat} lng={place.lng} lang={lang} url={place.url}  />
         </Suspense>
         )}
  </div>
  </>
  )
}