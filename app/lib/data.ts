'use server'
import { WritableStreamDefaultWriter } from "node:stream/web";

type WeatherJson = {
  city: {
    timezone: number;
  };
  list: any[];
};

export  async function  fetchWeather(lat: number, lon: number, url ='') {
  if (url == ''){
   url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dac6092827afc4e5557966b0e6b61c3f`;
  } 
  
  console.log("url = " + url);
  const res = await fetch(url).catch((err: any)=> console.log("something wrong", err));
  
  if (!res?.ok) {
    throw new Error(`HTTP error! status: ${res?.status}`);
  }
  
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res?.text();
    throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 200)}`);
  }
  
  const weatherjson = await res.json();
  console.log(weatherjson.city.name);
  
  const daymap =  getDayMap(weatherjson);
  const daily = getDaily(daymap);
  const detail = getDetail(daymap);
  const weather = {'daily':  daily, 'detail': detail};
  return weather;   
 }

function getDayMap(weatherjson: WeatherJson){
  var dayMap = new Map();
  const tz = weatherjson.city.timezone / 60;
 (weatherjson['list']).forEach((entry: any) => {  
  // UNIX timestamp を JST に変換
    let date = new Date(entry.dt * 1000);
    const tzo = date.getTimezoneOffset();
    date.setMinutes(tzo + tz);  
  //  date.setHours(date.getHours() + 9); //C+9)
    let dateStr =  `${date.getMonth() + 1}/${ date.getDate() } ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] [date.getDay()] }`;
    let dateStrHour = date.getHours(); 
    entry.time = dateStrHour;
    if (!dayMap.has(dateStr))  {
      dayMap.set(dateStr, []);
      }
     (dayMap.get(dateStr)).push(entry);
  });
    return dayMap;
}
function getDaily(dayMap: any)  {
  var dailyMap  = new  Map();  
  dayMap.forEach((ent: any, date: string) => {
    let  dailyobj: any = {};
    const weathers = ent.map((ent1: any) => ent1.weather);

    
    switch(ent.length){
      case 8: 
        
        var rweather = weathers[3].concat(weathers[6]);
        var rids = rweather.map((ent: any) => ent.id);
        rids = rids.filter((x: any, i: number) => rids.indexOf(x) == i);
        dailyobj['weather'] = rids; 
        
      break;

      case 1:
        dailyobj['weather'] = weathers[0].map((x: any) => x.id) ;
      break;
      case 2:  
        dailyobj['weather'] = weathers[1].map((x: any) => x.id); 
      break;
      case 3: 
        var rweather = weathers[0].concat(weathers[2]);
        var rids = rweather.map((x: any) => x.id);
        rids = rids.filter((x: any, i: number) => rids.indexOf(x) == i); 
        dailyobj['weather'] = rids; 
      break;
      case 4:
        var rweather = weathers[1].concat(weathers[3]);
        var rids = rweather.map((x: any) => x.id)
        rids = rids.filter((x: any, i: number) => rids.indexOf(x) == i); 
        dailyobj['weather'] = rids;
      break;
      case 5:  
        var rweather = weathers[1].concat(weathers[4]);
        var rids = rweather.map((x: any) => x.id);
        rids = rids.filter((x: any, i: number) => rids.indexOf(x) == i) 
        dailyobj['weather'] = rids;  
      break;
      case 6: 
       var rweather = weathers[2].concat(weathers[5]);
       var rids = rweather.map((x: any) => x.id);
        rids = rids.filter((x: any, i: number) => rids.indexOf(x) == i) 
        dailyobj['weather'] = rids;  

       // var rids = (wids[2]).concat(wids[5]);
      break; 
      case 7:
        var rweather = weathers[2].concat(weathers[6]);
        var rids = rweather.map((x: any) => x.id);
        rids = rids.filter((x: any, i: number) => rids.indexOf(x) == i) 
        dailyobj['weather'] = rids;  
 
       // var rids = (wids[2]).concat(wids[6]); 
      break;
      default: console.log("something wrong");        
        }
             
      let temps = dayMap.get(date).map((entry: any) => Math.round(Number(entry.main.temp) - 273.15) );
      let min = Math.min(...temps);
      let max = Math.max(...temps);
      if (max == min) {dailyobj['temp'] =  max;} 
      else { dailyobj['min'] = min; 
        dailyobj['max'] = max; }
      
      let pops = dayMap.get(date).map((entry: any) => Number(entry.pop));    
      dailyobj['pop'] = (Math.round((Math.max(...pops) *10))) * 10;
      
      if(dailyobj['pop'] != 0) {
      let mls = dayMap.get(date).map((entry: any) => { if (entry.rain) {if(entry['rain']['3h'] != '') { return entry['rain']["3h"];} else {return 0;} }  
                                                  else if (entry.snow) {if(entry['snow']['3h'] != '') { return entry['snow']["3h"];} else {return 0;} }  

                                                  else {return 0;} });
      
      dailyobj['ml'] = mls.reduce((a: number = 0, ml: any) => ml != null ? a+= ml : a );
      dailyobj['ml'] = dailyobj['ml'] >= 1 ? Math.round(dailyobj['ml']): Math.round(dailyobj['ml']*10)/10;
      
                }
      dailyMap.set(date, dailyobj);
      
      
    });
      return dailyMap;
      
    
  }  
    

    
function getDetail(dayMap: any){
  var detailMap = new Map();
  dayMap.forEach((entry: any, date: string) => {
    detailMap.set(date, []); 
    entry.forEach((ent: any) => {
      const detobj: any = {};  
      detobj['time'] = ent.time;
     
      detobj['weather'] = ent.weather.map((x: any) => [x.id, x.icon]);
    
      detobj['temp'] = Math.round(Number(ent.main.temp - 273.15)); 
      detobj['pop'] = Math.round(ent.pop*10)*10;
  
      if(ent.rain){
        detobj['ml'] = (ent['rain']['3h']/3) >= 1 ? Math.round(ent['rain']['3h']/3): Math.round(ent['rain']['3h']/3*10)/10;
      }
      if (ent.snow){
       detobj['ml'] = (ent['snow']['3h']/3) >= 1 ? Math.round(ent['snow']['3h']/3): Math.round(ent['snow']['3h']/3*10)/10;
      }
      detobj['humidity'] = ent.main.humidity;
      detobj['ws'] = ent.wind.speed;
      detobj['wd'] = ent.wind.deg;
      detailMap.get(date).push(detobj);
      });
    });
  return detailMap;
}  
    