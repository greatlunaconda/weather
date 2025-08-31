
'use client';

import { useEffect, useState } from 'react';
import { fetchWeather } from '../lib/data';
import './rows.css';

export default function Rows() {
  const [weatherData, setWeatherData] = useState(null);
  
  useEffect(() => {
    const points = [{
      'name': 'test_place',
      'url': '/api/mock-test',
      'lat': 190, 'lon': 190
    }];
    
    fetchWeather(points[0].lat, points[0].lon, points[0].url)
      .then(data => setWeatherData({ ...points[0], weather: data }))
      .catch(err => console.error('Failed to fetch weather:', err));
  }, []);
  
  if (!weatherData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Table name={weatherData.name} weather={weatherData.weather} />
    </div>
  );
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
const WeatherArray = [
  ["200", "Thunderstorm", "thunderstorm with light rain", "11d"],
  ["201", "Thunderstorm", "thunderstorm with rain", "11d"],
  ["202", "Thunderstorm", "thunderstorm with heavy rain", "11d"],
  ["210", "Thunderstorm", "light thunderstorm", "11d"],
  ["211", "Thunderstorm", "thunderstorm", "11d"],
  ["212", "Thunderstorm", "heavy thunderstorm", "11d"],
  ["221", "Thunderstorm", "ragged thunderstorm", "11d"],
  ["230", "Thunderstorm", "thunderstorm with light drizzle", "11d"],
  ["231", "Thunderstorm", "thunderstorm with drizzle", "11d"],
  ["232", "Thunderstorm", "thunderstorm with heavy drizzle", "11d"],
  ["300", "Drizzle", "light intensity drizzle", "09d"],
  ["301", "Drizzle", "drizzle", "09d"],
  ["302", "Drizzle", "heavy intensity drizzle", "09d"],
  ["310", "Drizzle", "light intensity drizzle rain", "09d"],
  ["311", "Drizzle", "drizzle rain", "09d"],
  ["312", "Drizzle", "heavy intensity drizzle rain", "09d"],
  ["313", "Drizzle", "shower rain and drizzle", "09d"],
  ["314", "Drizzle", "heavy shower rain and drizzle", "09d"],
  ["321", "Drizzle", "shower drizzle", "09d"],
  ["500", "Rain", "light rain", "10d"],
  ["501", "Rain", "moderate rain", "10d"],
  ["502", "Rain", "heavy intensity rain", "10d"],
  ["503", "Rain", "very heavy rain", "10d"],
  ["504", "Rain", "extreme rain", "10d"],
  ["511", "Rain", "freezing rain", "13d"],
  ["520", "Rain", "light intensity shower rain", "09d"],
  ["521", "Rain", "shower rain", "09d"],
  ["522", "Rain", "heavy intensity shower rain", "09d"],
  ["531", "Rain", "ragged shower rain", "09d"],
  ["600", "Snow", "light snow", "13d"],
  ["601", "Snow", "snow", "13d"],
  ["602", "Snow", "heavy snow", "13d"],
  ["611", "Snow", "sleet", "13d"],
  ["612", "Snow", "light shower sleet", "13d"],
  ["613", "Snow", "shower sleet", "13d"],
  ["615", "Snow", "light rain and snow", "13d"],
  ["616", "Snow", "rain and snow", "13d"],
  ["620", "Snow", "light shower snow", "13d"],
  ["621", "Snow", "shower snow", "13d"],
  ["622", "Snow", "heavy shower snow", "13d"],
  ["701", "Mist", "mist", "50d"],
  ["711", "Smoke", "smoke", "50d"],
  ["721", "Haze", "haze", "50d"],
  ["731", "Dust", "sand/dust whirls","50d"],
  ["741", "Fog", "fog", "50d"],
  ["751", "Sand", "sand", "50d"],
  ["761", "Dust", "dust", "50d"],
  ["762", "Ash", "volcanic ash", "50d"],
  ["771", "Squall", "squalls", "50d"],
  ["781", "Tornado", "tornado", "50d"],
  ["800", "Clear", "clear sky", "01d"],
  ["801", "Clouds", "few clouds: 11-25%", "02d"],
  ["802", "Clouds", "scattered clouds: 25-50%", "03d"],
  ["803", "Clouds", "broken clouds: 51-84%", "04d"],
  ["804", "Clouds", "overcast clouds: 85-100%", "04d"]
]
const Icons = {
"11d" : "/images/11d_t.png", 
"09d" : "/images/09d_t.png", 
"10d" : "/images/10d_t.png", 
"13d" : "/images/13d_t.png", 
"01d" : "/images/01d_t.png", 
"01n" : "/images/01n_t.png", 
"02d" : "/images/02d_t.png", 
"02n" : "/images/02n_t.png", 
"03d" : "/images/03d_t.png", 
"03n" : "/images/03n_t.png", 
"04d" : "/images/04d_t.png", 
"04n" : "/images/04n_t.png",
"50d" : "/images/50d_t.png"  
}      
function Table({ name, weather }: { name: string; weather: any }) {
    const [showDate, setShowDate] = useState("");
    const daily = weather.daily;
    const detail = weather.detail;
    const dates = Object.keys(detail);
    var dailyarr = [];
     const showDetail = (date) => {
   setShowDate(date);
 };
      
     const hideDetail = () => {
       setShowDate("");
 } ;
 

    daily.forEach((item, date) => { 
      var icons = item.weather.map(x =>  (WeatherArray.find(y  => y[0] == x)[3]));
      icons = icons.filter((x, i) => icons.findIndex(y => x == y) == i);
      var imgs = icons.map((x, i)  => x == '50d'? (<img  key={`img-${i}`} className='down' src={Icons[x]}/>):((<img key={`img-${i}`} className='up' src={Icons[x]}/>)) ); 
     
                  
      dailyarr.push(
      [  <th key={date} className="border px-4 py-2 {date}" onClick={() => showDetail(date)}>
            {date}
         </th>,       
         <td key={`weather-${date}`} className="border px-4 py-2 {date}">
        <div className={icons.find(x => x == '50d')? "two" :"one"}>
          {imgs}
        </div>      
        </td>,
         <td key={`temp-${date}`} className="border px-4 py-2 {date}"> 
          { item.min?  `${item.min}-${item.max}` : `${item.temp}` }  
        </td>,
        <td key={`pop-${date}`} className="border px-4 py-2 {date}">
            { item.pop ? `${item.pop} ml` : 'No precipitation' }
        </td>  ] ) 
        } );
 
 const  DetailTable =  ( prop: {date :string} )  =>{
    const detarr = detail.get(prop.date);
    //console.log(date); 
    //console.log(detail.keys().next().value);
   // console.log(date == detail.keys().next().value);
    var jsxs = [];
  
    detarr.forEach(item => {
      var ws = [];
      item.weather.forEach( w => 
       w[1] == '50d'? ws.push(w) : ws.unshift(w)
      );

      jsxs.push(
      [  <th key={item.time} className="border px-4 py-2">
            {item.time}
         </th>,       
         <td key={`weather-${item.time}`} className="border px-4 py-2">
        {  ws.map((w, i) => (<img key={`img-${i}`}  className = "icon" src = { Icons[w[1]] } />) ) }            
        </td>,
         <td key={`temp-${item.time}`} className="border px-4 py-2"> 
          {` ${item.temp} `}  
        </td>,
        <td key={`pop-${item.time}`} className="border px-4 py-2">
            { item.pop ? `${item.pop} %  ${item.ml} ml` : 'No precipitation' }
        </td> ,
         <td key={`hum-${item.time}`} className="border px-4 py-2">
            {`${ item.humidity } %` }
        </td>,
        <td key={`wind-${item.time}`} className="border px-4 py-2">
            {` ${ item.ws }  m/s ${ item.wd } `}
        </td>  
      ] ) 
        }
      );
    

     return (
    <div className="p-6 detail">
      <div className="overflow-x-auto"><button onClick={hideDetail}>X {prop.date}</button> 
        <table className="min-w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Days</th>
              { jsxs.map(arr => arr[0]) }             
             </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-left">Weather</td>
              {jsxs.map(arr => arr[1])}
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">Temp</td>
              { jsxs.map(arr => arr[2]) }       
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">POP</td>
              { jsxs.map(arr => arr[3]) }
              
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">Humidity</td>
              { jsxs.map(arr => arr[4]) }
              
            </tr>
             <tr>
              <td className="border px-4 py-2 text-left">Wind</td>
              { jsxs.map(arr => arr[5]) }
              
            </tr>

          </tbody>
        </table>
      </div>
    </div>
    );
};
       


       



    return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{name}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Days</th>
              { dailyarr.map(arr => arr[0]) }             
             </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-left">Weather</td>
              {dailyarr.map(arr => arr[1])}
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">Temp</td>
              { dailyarr.map(arr => arr[2]) }       
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">POP</td>
              { dailyarr.map(arr => arr[3]) }
              
            </tr>
          </tbody>
        </table>
      </div>
      
     {showDate != ""?<DetailTable date={showDate} />: ""}
    </div>
    );
};

/*function DetailTable( date ) {
    const detarr = detail.get(date);
    var jsxs = [];
  
    detarr.forEach(item => {
      var ws = [];
      item.weather.forEach( w => 
       w[1] == '50d'? ws.push(w) : ws.unshift(w)
      );

      jsxs.push(
      [  <th key={item.time} className="border px-4 py-2">
            {item.time}
         </th>,       
         <td key={`weather-${item.time}`} className="border px-4 py-2">
        {  ws.map((w, i) => (<img key={`img-${i}`}  className = "icon" src = { Icons[w[1]] } />) ) }            
        </td>,
         <td key={`temp-${item.time}`} className="border px-4 py-2"> 
          ` ${item.temp} `  
        </td>,
        <td key={`pop-${item.time}`} className="border px-4 py-2">
            { item.pop ? `${item.pop} %  ${item.ml} ml` : 'No precipitation' }
        </td> ,
         <td key={`hum-${item.time}`} className="border px-4 py-2">
            `${ item.humidity } %`
        </td>,
        <td key={`wind-${item.time}`} className="border px-4 py-2">
            ` Speed ${ item.ws }  m/s Direction ${ item.wd } `
        </td>  
      ] ) 
        }
      );
    

     return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{name}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Days</th>
              { jsxs.map(arr => arr[0]) }             
             </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2 text-left">Weather</td>
              {jsxs.map(arr => arr[1])}
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">Temp</td>
              { jsxs.map(arr => arr[2]) }       
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">POP</td>
              { jsxs.map(arr => arr[3]) }
              
            </tr>
            <tr>
              <td className="border px-4 py-2 text-left">Humidity</td>
              { jsxs.map(arr => arr[3]) }
              
            </tr>
             <tr>
              <td className="border px-4 py-2 text-left">Wind</td>
              { jsxs.map(arr => arr[3]) }
              
            </tr>

          </tbody>
        </table>
      </div>
    </div>
    );
};

*/