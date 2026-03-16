'use client';

import { Children, useState } from 'react';
import { useLanguage } from '../contexts/language-context';
import {WeatherArray, Icons} from '../lib/description';

interface WeatherData {
  date: string;
  wind: string;
  pop: string;
}

interface WeatherTableProps {
  location: string;
  data: WeatherData[];
}

interface DailyWeatherItem {
  weather: number[];
  temp?: number;
  min?: number;
  max?: number;
  pop?: number;
  ml?: number;
}

interface DetailWeatherItem {
  time: string;
  weather: number[];
  temp: number;
  pop?: number;
  ml?: number;
  humidity: number;
  ws: number;
  wd: string;
}

interface Weather {
  daily: Map<string, DailyWeatherItem>;
  detail: Map<string, DetailWeatherItem[]>;
} 

// Helper functions
const getUniqueIcons = (weatherData:number[]) => {
  const icons = weatherData.map((x ) => WeatherArray.find((y) => y[0] == x)[3]);
  return icons.filter((x: any, i: number) => icons.findIndex((y: any) => x == y) == i);
};

const renderWeatherIcons = (icons: any) => {
  return icons.map((icon: any, i: number) => (
    <img key={`img-${i}`} className="w-6 h-6 inline-block" src={Icons[icon]} />
  ));
};

const DayHeader = ({ date, isSelected, onClick }: { date: any; isSelected: boolean; onClick: (date: any) => void }) => (
  <th 
    key={date} 
    className={`border px-4 py-2 w-[15%] cursor-pointer ${
      isSelected ? 'bg-green-200' : ''
    }`} 
    onClick={() => onClick(date)}
  >
    {date}
  </th>
);

const WeatherCell = ({ icons, date }: { icons: any; date: any }) => {
  const hasFog = icons.includes('50d');
  return (
    <td key={`weather-${date}`} className="border px-4 py-2 w-[15%]">
      <div className={`flex items-center justify-center gap-1 ${
        hasFog ? 'flex-col' : 'flex-row'
      }`}>
        {renderWeatherIcons(icons)}
      </div>
    </td>
  );
};

/*
import React, { Children, isValidElement, cloneElement } from 'react';

const ClassModifier = ({ children }) => {
  return (
    <>
      {Children.map(children, (child) => {
        // 1. React要素（タグ）であるか確認
        if (!isValidElement(child)) return child;

        // 2. 既存のクラス名を取得 (未定義なら空文字)
        const originalClass = child.props.className || "";

        // 3. クラスの追加・削除ロジック
        let newClass = originalClass;

        if (originalClass.includes("target")) {
          // 例：'target' を削除して 'active' を追加
          newClass = originalClass.replace("target", "").trim() + " active";
        } else {
          // 例：単純に 'new-item' クラスを追加
          newClass = `${originalClass} new-item`.trim();
        }

        // 4. 新しいクラス名を注入してクローンを作成
        return cloneElement(child, {
          className: newClass,
        });
      })}
    </>
  );
};

// 使い方
export default function App() {
  return (
    <ClassModifier>
      <div className="target">ターゲット（activeに変わる）</div>
      <p className="foo">普通の要素（new-itemが付く）</p>
      テキストノード（無視される）
    </ClassModifier>
  );
}


const HoverDrscription =  ({ children }) => {
return (
  <span className="anchor-name-[detail] relative"relative">
    {children}

     ホバー時に表示されるテキスト *
    <span className="invisible group-hover:visible absolute bottom-full mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap">   
      {htext}
    </span>
  </span>
);
}
*/

export default function Row({ name, weather }: { name: string; weather: Weather }) {
    const [showDetail, setShowDetail] = useState("");
    const { t } = useLanguage();
    const daily = weather.daily;
    const detail = weather.detail;
     
    console.log("name = " + name);
    console.log(weather) ; 
    // Convert Map to array of [key, value] pairs
    const dailyEntries = Array.from(daily.entries());
    
    const showDetailOn = (date: any) => setShowDetail(date);
    const hideDetail = () => setShowDetail("");

    return (
      <div className={`${showDetail ? "anchor-name-[detail] relative" : ""} p-6`}>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center h-[120px]">
            <thead>
              <tr className="bg-gray-100 h-[25px]">
                <th className="border px-4 py-2 text-left w-[20%]">{t('days')}</th>
                {dailyEntries.map(([date, _]) => (
                  <DayHeader 
                    key={date}
                    date={date} 
                    isSelected={showDetail == date} 
                    onClick={showDetailOn} 
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="h-[35px]">
                <td className="border px-4 py-2 text-left w-[20%]">{name}</td>
                {dailyEntries.map(([date, item]) => {
                  const icons = getUniqueIcons(item.weather);
                  return <WeatherCell key={date} icons={icons} date={date} />;
                })}
              </tr>
              <tr className="h-[30px]">
                <td className="border px-4 py-2 text-left w-[20%]">{t('temp')}</td>
                {dailyEntries.map(([date, item]) => (
                  <td key={`temp-${date}`} className="border px-4 py-2 w-[15%]">
                    {item.temp == undefined ? (
                      <><span className='bg-blue-200 px-2'>{item.min}</span><span className='bg-red-200 px-2'>{item.max}</span></>
                    ) : (
                      <span className='bg-green-200'>{item.temp}</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="h-[30px]">
                <td className="border px-4 py-2 text-left w-[20%]">{t('pop')}</td>
                {dailyEntries.map(([date, item]) => (
                  <td key={`pop-${date}`} className="border px-4 py-2 w-[15%]">
                    {item.pop  ?  (<span className='text-blue-500'>{item.pop}%   {item.ml &&  `${item.ml}ml` }  </span>) 
                    : (<span className='text-green-500'>_</span>)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {showDetail && (
          <div>
            <DetailTable datedetail={detail.get(showDetail)} />
            <button 
              className="[anchor-[detail] top-[50px] left-[5px] absolute z-101" 
              onClick={hideDetail}
            >
              X
            </button>
          </div>
        )}
      </div>
    );
};

const DetailTable = ({ datedetail }: { datedetail: any[] }) => {
  const sortWeatherIcons = (weather: any) => {
    const sorted: any[] = [];
    weather.forEach((w: any) => 
      w[1] === '50d' ? sorted.push(w) : sorted.unshift(w)
    );
    return sorted;
  };

  const renderWeatherIcons = (weather: any) => (
    sortWeatherIcons(weather).map((w: any, i: number) => (
      <img key={`img-${i}`} className="icon" src={Icons[w[1]]} />
    ))
  );

  return (
    <div className="anchor-[detail] top-[55px] right-[0px] absolute z-100 w-full bg-white shadow-lg px-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center h-[120px]">
          <thead>
            <tr className="bg-gray-100 h-[25px]">
              <th className="border px-4 py-2 text-left w-[20%]">Hour</th>
              {datedetail.map((item: any) => (
                <th key={item.time} className="border px-4 py-2 w-[10%]">
                  {item.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="h-[35px]">
              <td className="border px-4 py-2 text-left w-[20%]">weather</td>
              {datedetail.map((item: any) => (
                <td key={`weather-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {renderWeatherIcons(item.weather)}
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">temp</td>
              {datedetail.map((item: any) => (
                <td key={`temp-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.temp}
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">pop</td>
              {datedetail.map((item: any) => (
                <td key={`pop-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.pop ? (<span className='text-blue-500'>{item.pop} %  {item.ml >0 && `${item.ml}ml`} </span>)
                    : (<span className='text-green-500'>_</span>)}

                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">humidity</td>
              {datedetail.map((item: any) => (
                <td key={`hum-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.humidity}%
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">wind</td>
              {datedetail.map((item: any) => (
                <td key={`wind-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.ws} m/s {item.wd}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};