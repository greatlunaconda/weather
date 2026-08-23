'use client';

import { Children, useState } from 'react';
import { getDaily, DetailType, DailyType } from '../lib/data';

import { Icons } from '../lib/description';
import { Language } from '../lib/cookies';
import Detail from './detail';

//const {language, t} = useLanguage();

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
  weather: string[];
  temp?: number;
  min?: number;
  max?: number;
  pop?: number;
  ml?: number;
}

interface DetailWeatherItem {
  time: string;
  weather: { id: string; icon: string }[];
  temp: number;
  pop?: number;
  ml?: number;
  humidity: number;
  ws: number;
  wd: number;
}


//const hovername = "absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all";

//const noperception ='<span absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all> </span>';

// Helper functions

/*
const getUniqueIcons = (weatherData:number[]) => {
  const icons = weatherData.map((x ) => WeatherArray.find((y) => y[0] == x)[1]); 
  const iconset =  icons.filter((x: any, i: number) => icons.findIndex((y: any) => x == y) == i);
  const ids = iconset.map(x => icons.flatMap((y, i) => y == x ? weatherData[i] : []) );
  const idsset = ids.map(x => x.filter( (y, i) => x.findIndex(z => z == y ) != i ));
  return {"icons": iconset, "ids": idsset };
};*/


// <span className="absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all"> </span> 
const weatherCell = ( date:string, weather:DailyType['weather'] )  => {
  return (
    <td key={`weather-${date}`} className="border px-4 py-2 w-[13%]" onClick={showDetail(date)}>
      <div className={`flex items-center justify-center gap-1`}>
        {weather.map((icon: string[], i: number) => (
          <>
            <img key={`img-${i}`} className="w-6 h-6 inline-block relative" src={`/images/${icon[0]}_t.png`} />

          </>
        ))}

      </div>
    </td>
  )
};



export default function Row({ name, weather, lang }: { name: string, weather: Map<string,DetailType[]>, lang: {[key: string]: string} }) {
  const [showdetail, setShowDetail] = useState("");
  console.log(weather);
  const daily = getDaily(weather);
  console.log("name = " + name);
  console.log(weather);
  // Convert Map to array of [key, value] pairs
  const dailyEntries:[string, DailyType][] = Array.from(daily.entries());


  return (
    <div className="p-6">
      <div className="">
        <table className='min-w-full border border-gray-300 text-center h-[120px]'>
          <thead>
            <tr className='bg-gray-100 h-[25px]'>
              <th key='days' className='border px-4 py-2 text-left w-[13%]'>{('days')}</th>
              {dailyEntries.map(([date, _]) => (
                <th key={date} className='border px-4 py-2 w-[13%] cursor-pointer' onClick={showDetail(date)}>
                  {date}
                </th>)
              )
            }
            </tr>
          </thead>
          <tbody refc={detailRef}>
            <tr className="h-[35px]">
              <td className="relative w-[13%] h-16"><div> {name}</div></td>
              {dailyEntries.map(([date, item]) =>
                weatherCell(date, item.weather)
              )
              }

            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[13%]">{('temp')}</td>
            
              {dailyEntries.map(([date, item]: [string, DailyType]) => (
              <td key={`temp-${date}`} className="border px-4 py-2 w-[13%]" onClick={showDetail(date)}>
              {item.temp == undefined ? (
            <> <span className='bg-blue-200 px-2'>{item.min}</span><span className='bg-red-200 px-2'>{item.max}</span></>
          ) : 
            ( <span className='bg-green-200'>{item.temp}</span> )
              }
              </td>))
              }
            </tr>                   
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[13%]">{('pop')}</td>
              {dailyEntries.map(([date, item]) => (
              <td key={`pop-${date}`} className="border px-4 py-2 w-[13%]" onClick={showDetail(date)}>
              {item.pop != 0 ? 
                (<span className='text-blue-500'>{`${item.pop}%  ${item.ml}ml`}  </span>) 
              : (<span className='text-green-500  group'></span>)
              }
             </td>))
              }
            </tr>
          </tbody>
        </table>
      </div>
    
    </div>
  );
};



const DetailTable = ({ detail }: { detail: DetailType[] }) => {
  console.log(detail);

  const popml = (item: DetailType): React.JSX.Element => {
    const elem = item.ml != 0 ? (<span className='text-blue-500'>{item.pop} %  `${item.ml}ml` </span>)
      : (<span className='text-green-500 relative group'>_<span className="">No perception</span></span>);

    return (
      <td key={`pop-${item.time}`} className="border px-4 py-2 w-[8%]">
        {elem}
      </td>
    );
  };

  const sortedWeatherIcons = (item: DetailType): React.JSX.Element => {
    const sorted: { id: string, icon: string }[] = [];
    item.weather.forEach((w) =>
      w.icon === '50d' ? sorted.push(w) : sorted.unshift(w)
    );
    return (
      <td key={`weather-${item.time}`} className="border px-4 py-2 w-[8%]">
        {sorted.map((w: { id: string, icon: string }, i: number) => (
          <>
            <img key={`img-${i}`} className="icon relative" src={Icons[w.icon]} />
            {/*   <span  className='absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all'> </span> */}
          </>
        ))}
      </td>
    )}

  return (
    <div className="anchor-[detail] top-[59px] right-[0px] absolute z-100 bg-white w-full shadow-lg px-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center h-[120px]">
          <thead>
            <tr key="time" className="bg-gray-100 h-[25px]">
              <th key="time" className="border px-4 py-2 text-left w-[8%]">Hour</th>
              {detail.map((item: DetailType) => (
                <th key={item.time} className="border px-4 py-2 w-[8%]">
                  {item.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr key="weather" className="h-[35px]">
              <td key="weather" className="border px-4 py-2 text-left w-[8%]">weather</td>
              {detail.map((item: DetailType) => sortedWeatherIcons(item))}
            </tr>
            <tr key="temp" className="h-[30px]">
              <td key="temp" className="border px-4 py-2 text-left w-[8%]">temp</td>
              {detail.map((item: DetailType) => (
                <td key={`temp-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.temp}
                </td>
              ))}
            </tr>
            <tr key="popml" className="h-[30px]">
              <td key="popml" className="border px-4 py-2 text-left w-[8%]">pop</td>
              {detail.map((item: DetailType) => popml(item))}

            </tr>
            <tr key="humidity" className="h-[30px]">
              <td key="humidity" className="border px-4 py-2 text-left w-[8%]">humidity</td>
              {detail.map((item: DetailType) => (
                <td key={`hum-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.humidity}%
                </td>
              ))}
            </tr>
            <tr key="wind" className="h-[30px]">
              <td key="wind" className="border px-4 py-2 text-left w-[8%]">wind</td>
              {detail.map((item: DetailType) => (
                <td key={`wind-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.ws} m/s {item.wd}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}