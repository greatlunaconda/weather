'use client';

import { useState } from 'react';
import { useLanguage } from '../lib/language-context';
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

// Helper functions
const getUniqueIcons = (weatherData) => {
  const icons = weatherData.map(x => WeatherArray.find(y => y[0] == x)[3]);
  return icons.filter((x, i) => icons.findIndex(y => x == y) == i);
};

const renderWeatherIcons = (icons) => {
  return icons.map((icon, i) => (
    <img key={`img-${i}`} className="w-6 h-6 inline-block" src={Icons[icon]} />
  ));
};

const DayHeader = ({ date, isSelected, onClick }) => (
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

const WeatherCell = ({ icons, date }) => {
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

export default function Row({ name, weather }: { name: string; weather: any }) {
    const [showDetail, setShowDetail] = useState("");
    const { t } = useLanguage();
    const daily = weather.daily;
    const detail = weather.detail;
    
    const showDetailOn = (date) => setShowDetail(date);
    const hideDetail = () => setShowDetail("");

    return (
      <div className={`${showDetail ? "anchor-name-[detail] relative" : ""} p-6`}>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center h-[120px]">
            <thead>
              <tr className="bg-gray-100 h-[25px]">
                <th className="border px-4 py-2 text-left w-[20%]">{t('days')}</th>
                {daily.map((_, date) => (
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
                {daily.map((item, date) => {
                  const icons = getUniqueIcons(item.weather);
                  return <WeatherCell key={date} icons={icons} date={date} />;
                })}
              </tr>
              <tr className="h-[30px]">
                <td className="border px-4 py-2 text-left w-[20%]">{t('temp')}</td>
                {daily.map((item, date) => (
                  <td key={`temp-${date}`} className="border px-4 py-2 w-[15%]">
                    {item.min ? `${item.min}-${item.max}` : `${item.temp}`}
                  </td>
                ))}
              </tr>
              <tr className="h-[30px]">
                <td className="border px-4 py-2 text-left w-[20%]">{t('pop')}</td>
                {daily.map((item, date) => (
                  <td key={`pop-${date}`} className="border px-4 py-2 w-[15%]">
                    {item.pop ? `${item.pop} ml` : t('noPrecipitation')}
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

const DetailTable = ({ datedetail }: { datedetail: [] }) => {
  const sortWeatherIcons = (weather) => {
    const sorted = [];
    weather.forEach(w => 
      w[1] === '50d' ? sorted.push(w) : sorted.unshift(w)
    );
    return sorted;
  };

  const renderWeatherIcons = (weather) => (
    sortWeatherIcons(weather).map((w, i) => (
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
              {datedetail.map(item => (
                <th key={item.time} className="border px-4 py-2 w-[10%]">
                  {item.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="h-[35px]">
              <td className="border px-4 py-2 text-left w-[20%]">weather</td>
              {datedetail.map(item => (
                <td key={`weather-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {renderWeatherIcons(item.weather)}
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">temp</td>
              {datedetail.map(item => (
                <td key={`temp-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.temp}
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">pop</td>
              {datedetail.map(item => (
                <td key={`pop-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.pop ? `${item.pop} % ${item.ml} ml` : 'noPrecipitation'}
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">humidity</td>
              {datedetail.map(item => (
                <td key={`hum-${item.time}`} className="border px-4 py-2 w-[10%]">
                  {item.humidity}%
                </td>
              ))}
            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[20%]">wind</td>
              {datedetail.map(item => (
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