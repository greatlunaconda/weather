'use client';

import { Children, useState, useRef, MouseEvent } from 'react';
import { getDaily, DetailType, DailyType } from '../lib/data';

import { Language } from '../lib/cookies';

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

const weatherDate = ( date:string, detail:string, cb1: (e:MouseEvent<HTMLElement>, date:string)=>void, cb2: (e:MouseEvent<HTMLElement>)=>void, week: string[]) => 
   date==detail ?   
   (<th key={date} className='border bg-green-200 px-4 py-2 w-[13%] cursor-pointer' onClick={cb2} >
    
    {date.replace(/(\d)$/, (ma, p)=> week[p])}
    <img  className='inline-block w-5 h-5 ml-5  align-middle rounded '  src='/images/close.png'/>
    </th> 
   ):
   (<th key={date} className='border px-4 py-2 w-[13%] cursor-pointer' onClick={(e)=>cb1(e, date)}>
    
    {date.replace(/(\d)$/, (ma, p)=> week[p])}
   </th>
   );
                  

const weatherCell = ( date:string, weather:DailyType['weather'], onclick: (e:MouseEvent<HTMLElement>, date:string)=>void)  => {
  return (
    <td key={`weather-${date}`} className="border px-4 py-2 w-[13%]" onClick={(e)=>onclick(e, date)}>
      <div className={`flex items-center justify-center gap-1`}>
        {weather.map((icon: string[], i: number) => (
      
          <span  className="group relative inline-block cursor-pointer" >
            <img key={`img-${i}`} className="w-6 h-6 inline-block relative" src={`/images/${icon[0]}_t.png`} />

             <span className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full 
                        invisible opacity-0 group-hover:visible group-hover:opacity-100 
                        transition-all duration-200 pointer-events-none
                        bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                   {icon.slice(1)}
               <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full 
                          w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
             </span>
              
          </span>
        
        ))}

      </div>
    </td>
  )
};



export default function Row({ weather, lang, name="" }: {  weather: Map<string,DetailType[]>, lang: {[key: string]: string | string[]} , name: string}) {
  const [detail, setDetail] = useState<string>("");
  const [overlay, setOverlay] = useState<{x: number; y: number} | null>(null);
  console.log(weather);
  const daily = getDaily(weather);
  console.log("name = " + name);
  console.log(weather);
  
  // Convert Map to array of [key, value] pairs
  const dailyEntries:[string, DailyType][] = Array.from(daily.entries());
  
  const detailRef = useRef<HTMLTableSectionElement>(null);
  
  const showDetail = (e:MouseEvent<HTMLElement>, date:string) => {
    if(date == ""){  return; }
    const detailref = detailRef.current;
    if (!detailref) { return; }
    const position = detailref.getBoundingClientRect();

    const x = Math.round(position.left+window.scrollX);
    const y = Math.round(position.top)+window.scrollY; 
    console.log("x = "+x +" y = " +y);
    if(weather.get(date) != null){setDetail(date);}
    setOverlay({ x, y });
  };
  
  const hideDetail = (e:MouseEvent) => {
    setDetail("");
    setOverlay(null);
  };

  return (
    <div className="p-6">
      <div className="">
        <table className='min-w-full border border-gray-300 text-center h-[120px]'>
          <thead>
            <tr className='bg-gray-100 h-[25px]'>
              <th key='days' className='border px-4 py-2 text-left w-[13%]'>{(lang['days'])}</th>
              {dailyEntries.map(([date, _]) => 
              weatherDate(date, detail, showDetail, hideDetail, lang['week'] as string[] ) 
              )}
            </tr>
          </thead>
          <tbody ref={detailRef}>
            <tr className="h-[35px]">
              <td className="relative w-[13%] h-16"><div> {name}</div></td>
              {dailyEntries.map(([date, item]) =>
                weatherCell(date, item.weather, showDetail )
              )
              }

            </tr>
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[13%]">{(lang['temp'])}</td>
            
              {dailyEntries.map(([date, item]: [string, DailyType]) => (
              <td key={`temp-${date}`} className="border px-4 py-2 w-[13%]" onClick={(e)=>showDetail(e, date)}>
              {item.temp == undefined ? (
            <> <span className='bg-blue-200 px-2'>{item.min}</span><span className='bg-red-200 px-2'>{item.max}</span></>
          ) : 
            ( <span className='bg-green-200'>{item.temp}</span> )
              }
              </td>))
              }
            </tr>                   
            <tr className="h-[30px]">
              <td className="border px-4 py-2 text-left w-[13%]">{(lang['pop'])}</td>
              {dailyEntries.map(([date, item]) => (
              <td key={`pop-${date}`} className="border px-4 py-2 w-[13%]" onClick={(e)=>showDetail(e, date)}>
              {item.pop != 0 || item.ml ? 
                (<span className='text-blue-500'> {item.pop && `${item.pop}%` } {item.ml &&  `${item.ml}ml` }  </span>) 
              : (<span  data-content={lang['_']}  className="hover:after:content-[attr(data-content)] hover:after:text-green-500 hover:after:text-[14px] text-green-500 group relative">_</span>)
              }
             </td>))
              }
            </tr>
          </tbody>
        </table>
        {weather.get(detail) && overlay && <Detail  detail={weather.get(detail) as DetailType[]}  overlay={overlay}  lang={lang} /> }
      </div>
    
    </div>
  );
};



const Detail = ({ detail, overlay, lang }: { detail: DetailType[]; overlay: {x: number; y: number}; lang: {[key: string]: string | string[] } } ) => {
  console.log(detail);

  const popml = (item: DetailType): React.JSX.Element => {
    
      const elem:React.JSX.Element = 
      item.pop != 0 || item.ml ? 
                (<span className='text-blue-500'> {item.pop && `${item.pop}%` } {item.ml &&  `${item.ml}ml` }  </span>) 
              : (<span  data-content={lang['_']} className="hover:after:content-[attr(data-content)] hover:after:text-green-500 hover:after:text-[14px] text-green-500 group relative">_</span>)
              
    return (
      <td key={`pop-${item.time}`} className=" border px-4 py-2 w-[8%]">
        {elem}
      </td>
    );
  };

  const sortedWeatherIcons = (item: DetailType): React.JSX.Element => {
    const sorted: { id: string, icon: string, desc: string }[] = [];
    item.weather.forEach((w) =>
      w.icon === '50d' ? sorted.push(w) : sorted.unshift(w)
    );
    return (
      <td key={`weather-${item.time}`} className="border px-4 py-2 w-[8%]">
        {sorted.map((w: {id:string,  icon: string, desc:string  }, i: number) => (
         <span  className="group relative inline-block cursor-pointer" >
            <img key={`img-${i}`} className="w-6 h-6 inline-block relative" src={`/images/${w.icon}_t.png`} />
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full 
                        invisible opacity-0 group-hover:visible group-hover:opacity-100 
                        transition-all duration-200 pointer-events-none
                        bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                {w.desc}
               <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full 
                          w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
            </span>
          </span> 
        ))}

      </td>
    )}

  return (
    <div className="absolute z-4 bg-white w-full shadow-lg px-6" style={{top: `${overlay.y}px`, left:`${overlay.x}px`}}>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center h-[120px]">
          <thead>
            <tr key="time" className="bg-gray-100 h-[25px]">
              <th key="time" className="border px-4 py-2 text-left w-[8%]">{lang['hours']}</th>
              {detail.map((item: DetailType) => (
                <th key={item.time} className="border px-4 py-2 w-[8%]">
                  {item.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr key="weather" className="h-[35px]">
              <td key="weather" className="border px-4 py-2 text-left w-[8%]">{lang['weather']}</td>
              {detail.map((item: DetailType) => sortedWeatherIcons(item))}
            </tr>
            <tr key="temp" className="h-[30px]">
              <td key="temp" className="border px-4 py-2 text-left w-[8%]">{lang['temp']}</td>
              {detail.map((item: DetailType) => (
                <td key={`temp-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.temp}
                </td>
              ))}
            </tr>
            <tr key="popml" className="h-[30px]">
              <td key="popml" className="border px-4 py2- text-left w-[8%]">{lang['pop']}</td>
              {detail.map((item: DetailType) => popml(item))}

            </tr>
            <tr key="humidity" className="h-[30px]">
              <td key="humidity" className="border px-4 py-2 text-left w-[8%]">{lang['humidity']}</td>
              {detail.map((item: DetailType) => (
                <td key={`hum-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.humidity}%
                </td>
              ))}
            </tr>
            <tr key="wind" className="h-[30px]">
              <td key="wind" className="border px-4 py-2 text-left w-[8%]">{lang['wind']}</td>
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