'use client';

import { Children, useState } from 'react';
import { WeatherResult, Detail, Daily } from '../lib/data';
//import { useLanguage } from '../contexts/language-context';
import {WeatherArray, Icons} from '../lib/description';


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
  weather: {id: string; icon: string}[];
  temp: number;
  pop?: number;
  ml?: number;
  humidity: number;
  ws: number;
  wd: number;
}

  
const hovername = "absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all";

const noperception ='<span absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all> </span>';

// Helper functions


const DayHeader = ({ date, isSelected, onClick }: { date: string; isSelected: boolean; onClick: (date: string) => void }) => (
  <th 
    key={date} 
    className={`border px-4 py-2 w-[13%] cursor-pointer ${
      isSelected ? 'bg-green-200' : ''
    }`} 
    onClick={() => onClick(date)}
  >
    {date}
  </th>
);

/*
const getUniqueIcons = (weatherData:number[]) => {
  const icons = weatherData.map((x ) => WeatherArray.find((y) => y[0] == x)[1]); 
  const iconset =  icons.filter((x: any, i: number) => icons.findIndex((y: any) => x == y) == i);
  const ids = iconset.map(x => icons.flatMap((y, i) => y == x ? weatherData[i] : []) );
  const idsset = ids.map(x => x.filter( (y, i) => x.findIndex(z => z == y ) != i ));
  return {"icons": iconset, "ids": idsset };
};*/


const WeatherCell = ({date, weather}: {date:string, weather:string[]}) => {
 
  const uid = weather.filter((x, i) => weather.findIndex(y => x == y) == i);
  const icons:string[][] = [];
  uid.forEach ((id:string, num:number) => {   
     let ar = WeatherArray.find(a => a[0] == id);
     if(ar){
       let icon = ar[1];
       let ind = icons.findIndex( x => x[0] == icon);
       if(ind != -1){
        icons[ind].push(id);
       } else {
        icons.push([icon, id]);
       }
     } else { 
     
     }
    }); 
  icons.forEach((x, ind) => {
    if(x[0] == '50d'){
      icons.push(icons.splice(ind, 1)[0]);
    }
  });
    
  return (
    <td key={`weather-${date}`} className="border px-4 py-2 w-[13%]">
      <div  className={`flex items-center justify-center gap-1`}>
    {icons.map((icon: string[], i: number) => (
    <>
    <img key={`img-${i}`} className="w-6 h-6 inline-block relative" src={Icons[icon[0]]} />
{/*    <span className="absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all"> 
     
    </span> */}
    </>
  )) }

      </div>
    </td>
  )
};

function Temps ({dailyent}:{dailyent:[string, Daily][]}){
  return ( 
    <>
      {dailyent.map(([date, item]:[string, Daily]) => (
                  <td key={`temp-${date}`} className="border px-4 py-2 w-[13%]">
                    {item.temp == undefined ? (
                     <><span className='bg-blue-200 px-2'>{item.min}</span><span className='bg-red-200 px-2'>{item.max}</span></>
                    ) : (
                      <span className='bg-green-200'>{item.temp}</span>
                    )}
                  </td>
                ))}
   </>
)
}

function Popml ({dailyent}: {dailyent:[string, Daily][]}): React.JSX.Element{ 
  const mljsx  = (item: Daily) =>  
      item.ml != 0 ? (<span className='text-blue-500'>{`${item.pop}%    ${item.ml}ml`}  </span>) 
                    : (<span className='text-green-500 relative group'>_</span>)
  
  return ( 
    <>
    {dailyent.map(([date, item]) => (
                  <td key={`pop-${date}`} className="border px-4 py-2 w-[13%]">
                      {mljsx(item)}                                             
                  </td>) ) 
    }
    </>
    )
  }


export default function Row({ name, weather }: { name: string; weather: WeatherResult }) {
    const [showDetail, setShowDetail] = useState("");
    console.log(weather);
    const daily = weather.daily;
    const detail = weather.detail;
     
    console.log("name = " + name);
    console.log(weather) ; 
    // Convert Map to array of [key, value] pairs
    const dailyEntries = Array.from(daily.entries());
    
    const showDetailOn = (date: string) =>  setShowDetail(date);
     
    const showdetailObj = (showDetail && detail.get(showDetail)) ?
     detail.get(showDetail) : undefined;
     
    const hideDetail = () => setShowDetail("");

    return (
      <div className={`${showDetail ? "anchor-name-[detail] relative" : ""} p-6`}>
        <div className="">
          <table className="min-w-full border border-gray-300 text-center h-[120px]">
    
            <thead>
              <tr className="bg-gray-100 h-[25px]">
                <th className="border px-4 py-2 text-left w-[13%]">{('days')}</th>
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
                <td className="relative w-[13%] h-16"><div className={hovername}> {name}</div></td>
                {dailyEntries.map(([date, item]) => 
                   <WeatherCell key={date}  date={date} weather={item.weather} />
                ) }

              </tr>
              <tr className="h-[30px]">
                <td className="border px-4 py-2 text-left w-[13%]">{('temp')}</td>
                <Temps dailyent={dailyEntries} />  
              </tr>
              <tr className="h-[30px]">
                <td className="border px-4 py-2 text-left w-[13%]">{('pop')}</td>
                <Popml dailyent={dailyEntries} />
              </tr>
            </tbody>
          </table>
        </div>
        {showDetail &&  showdetailObj && (
          <div>
            <DetailTable detail={showdetailObj} />
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

 

const DetailTable = ({ detail }: { detail: Detail[] }) => {
  console.log(detail);

  const popml = (item: Detail): React.JSX.Element => {
    const elem = item.ml !=0 ? (<span className='text-blue-500'>{item.pop} %  `${item.ml}ml` </span>)
    :  (<span className='text-green-500 relative group'>_<span className="">No perception</span></span>);

   return  (
   <td key={`pop-${item.time}`} className="border px-4 py-2 w-[8%]">
    {elem}
    </td>
    );
  };

  const sortedWeatherIcons = (item: Detail): React.JSX.Element => {
    const   sorted: {id: string, icon: string}[]  = [];
    item.weather.forEach((w) => 
      w.icon === '50d' ? sorted.push(w) : sorted.unshift(w)
    );
    return (
      <td key={`weather-${item.time}`} className="border px-4 py-2 w-[8%]">
          {sorted.map((w: {id:string, icon:string}, i: number) => (
       <>
      <img key={`img-${i}`} className="icon relative" src={Icons[w.icon]} />
      <span  className='absolute inset-0 p-2 border bg-white line-clamp-2  hover:line-clamp-none hover:h-max hover:z-20 hover:shadow transition-all'> </span>
      </>
          )) }
      </td>
    )
  };
  
  return (
    <div className="anchor-[detail] top-[59px] right-[0px] absolute z-100 w-full bg-white shadow-lg px-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center h-[120px]">
          <thead>
            <tr  key="time" className="bg-gray-100 h-[25px]">
              <th  key="time" className="border px-4 py-2 text-left w-[8%]">Hour</th>
              {detail.map((item: Detail) => (
                <th key={item.time} className="border px-4 py-2 w-[8%]">
                  {item.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr  key="weather" className="h-[35px]">
              <td key="weather" className="border px-4 py-2 text-left w-[8%]">weather</td>
                {detail.map((item: Detail) => sortedWeatherIcons(item))}
             </tr>
             <tr key="temp" className="h-[30px]">
               <td  key="temp" className="border px-4 py-2 text-left w-[8%]">temp</td>
               {detail.map((item: Detail) => (
               <td key={`temp-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.temp}
               </td>
              ))}
            </tr>
            <tr key="popml" className="h-[30px]">
              <td key="popml" className="border px-4 py-2 text-left w-[8%]">pop</td>
              {detail.map((item: Detail) => popml(item)) }
                                              
            </tr>
            <tr key="humidity" className="h-[30px]">
              <td key="humidity"  className="border px-4 py-2 text-left w-[8%]">humidity</td>
              {detail.map((item: Detail) => (
                <td key={`hum-${item.time}`} className="border px-4 py-2 w-[8%]">
                  {item.humidity}%
                </td>
              ))}
            </tr>
            <tr key="wind" className="h-[30px]">
              <td key="wind" className="border px-4 py-2 text-left w-[8%]">wind</td>
              {detail.map((item: Detail) => (
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
};