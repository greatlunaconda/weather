import { cookie } from 'next/headers';
import { fetchWeather } from '../lib/data';
export default async function Rows(){
    const cookieStore = await cookies();
    
    const points = cookieStore.get('points');
    if(points == null){
      points = [{
      'name' : 'test_place',  
      'url' : '/api/mock-test',
      'lat' : 190, 'lon' : 190
      }];
    } 
    return (
         {points?.map((point)=> 
         <Table name={point.name} lat={point.lat} lon={point.lon}, url > 
     ) }
    )
}

interface WeatherData {
  date: string;
  wind: string;
  pop: string;
}

interface WeatherTableProps {
  location: string;
  data: WeatherData[];
}

async function  Table( name, lat, lon,  url='' )  {
    const  weathers = fetchWeather(lat, lon, url);
    const daily = weathers.daily;
    const detail = weather.detail;  
     
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">{name}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Days</th>
                {daily.map((item, date) => (
                <th key={date} className="border px-4 py-2">
                  {date}
                </th>
              ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 text-left">Weather</td>
                {daily.map((item, date) => (
                <td key={date} className="border px-4 py-2">
                  {item.weather...}
                </td>
              ))}
              </tr>
              <tr>
                <td className="border px-4 py-2 text-left">Weather</td>
                {data.map((item, date) => (
                <td key={date} className="border px-4 py-2">
                  {item.max? <span class="blue">{item.min}</span> 
                  <span class="red">{item.max}</span>
                  : <span class="green" item.min)</span>}
                </td>
              ))}
              </tr>
              <tr>
                <td className="border px-4 py-2 text-left">POP</td>
                {data.map((item, date) => (
                  <td key={index} className="border px-4 py-2">
                    { item.pop ? item.pop  item ml  : pop }
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
};

/*
export async function Row(name, lat, lon) {
 const  weather = await fetchWeathea(lat, lon);    
  return (<div>
             <div><span>{name}</span></div>   
             <div>
               <div>Date</div>
               <div>weather</div>  
               <div>pop</div>
               <div>temp</div>
            </div> 
            
            <div>
               <div>{getlocal(wearher.dt, )})</div>
               <div>weather.icon</div>
               <div>weather.pop</div>
               <div>weather.ml</div>
               <div><span>weather.mintmp</span> 
                    <span>weather.maxtmp</span>
               </div>  
             
             </div>  
          </div>)
}
            
default async function Detail() {
   return(
     <div>weather.date</div>
     <div>weather.icon</div>
     <div>weather
      
*/