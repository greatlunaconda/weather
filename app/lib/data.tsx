import { WritableStreamDefaultWriter } from "node:stream/web";

type WeatherJson = Object;

export  async function  fetchWeather(lat: number, lon: number, url ='') {
  if (url == ''){
   url = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=dac6092827afc4e5557966b0e6b61c3f";
  } 
  const res = await fetch(url)
  const weatherjson = await res.json();
  const daymap =  getDayMap(weatherjson);
  const daily = getDaily(daymap);
  const detail = getDetail(daymap);
  const weather = {'daily':  daily, 'detail': detail};
  return weather;   
 }

function getDayMap(weatherjson: WeatherJson){
  var dayMap = new Map();
  const tz = weatherjson.city.timezone;
 (weatherjson['list']).forEach(entry => {  
  // UNIX timestamp を JST に変換
    let date = new Date(entry.dt * 1000);
      
    date.setHours(date.getHours() + 9); // JST (UTC+9)
    let dateStr = date.toISOString().split('T')[0]; // yyyy-mm-dd 形式
    let dateStrHour = (date.toISOString().split('T')[1]).split(':')[0];
    entry.time = dateStrHour;
    if (!dayMap.has(dateStr))  {
      dayMap.set(dateStr, []);
      }
     (dayMap.get(dateStr)).push(entry);
  });
    return dayMap;
}
function getDaily(dayMap: DayMap)  {
  var dailyMap  = new  Map();  
  dayMap.forEach((ent, date) => {
    let  dailyobj = {};    
    let weathers = ent.map( entry => entry.weather.filter(elem => elem.icon != '50d')[0]['icon']  );
    switch(weathers.length){
      case 8: if (weathers[0] == weathers[2]){dailyobj['weather'] =  [weathers[6]];}
               else {dailyobj['weather'] = [weathers[2],weathers[6]]; }
      break;

      case 1:  dailyobj['weather'] = weathers[0]; break;
      case 2:  dailyobj['weather'] = weathers[1]; break;
      case 3:  if (weathers[0] == weathers[2]){dailyobj['weather'] = weathers[0];}
              else { dailyobj['weather'] = [weathers[0],weathers[2]]; }
              break;
      case 4:  if (weathers[1] == weathers[3]){ dailyobj['weather'] = weathers[0];}
               else {dailyobj['weather'] = [weathers[1],weathers[3] ];}
               break;
      case 5:  if (weathers[1] == weathers[4]){ dailyobj['weather'] = weathers[0];}
               else {dailyobj['weather'] =  [weathers[1],weathers[4]]; }
               break;
      case 6: if (weathers[2] == weathers[5]){ dailyobj['weather'] = weathers[0];}
                else { dailyobj['weather'] = [weathers[2],weathers[5]]; }
      case 7: if (weathers[3] == weathers[6]) {dailyobj['weather'] = weathers[0];}
                else {dailyobj['weather'] = [weathers[3],weathers[6]]; }
                break;
        default: console.log("something wrong");        
        }
             
      let temps = dayMap.get(date).map( entry => Math.round(Number(entry.main.temp) - 273.15) );
      let min = Math.min(...temps);
      let max = Math.max(...temps);
      if (max == min) {dailyobj['temp'] =  max;} 
      else { dailyobj['min'] = min; 
        dailyobj['max'] = max; }
      
      let pops = dayMap.get(date).map(entry => Number(entry.pop));    
      dailyobj['pop'] = Math.max(...pops);
    
      let mls = dayMap.get(date).map( entry => entry.rain ? entry.rain["3h"] : ' ');
      dailyobj['ml'] = mls.reduce((a=0, ml) => ml != ' '? a+= ml : a );
      dailyMap.set(date, dailyobj);
      
      });
      return dailyMap;
      
    }  
    

    
function getDetail(dayMap: DayArray){
  var detailMap = new Map();
  dayMap.forEach((entry, date) => {
    detailMap.set(date, []); 
    entry.forEach(ent => {
      const detobj = {};  
      detobj['time'] = ent.time;
     
      detobj['weather1'] = ent.weather.filter(elem => elem.icon != '50d');
      detobj['weather2'] = ent.weather.filter(elem => elem.icon == '50d');
    
      detobj['temp'] = Math.round(Number(ent.main.temp)); 
      detobj['pop'] = ent.pop;
      if(ent.rain){
       detobj['ml'] = ent.rain['3h']/3;
      }
      detobj['humidity'] = ent.main.humidity;
      detobj['ws'] = ent.wind.speed;
      detobj['wd'] = ent.wind.deg;
      detailMap.get(date).push(detobj);
      });
    });
  return detailMap;
}  
    

    //object.keys(dailyTemps).sort().forEach(date => {
    //  const temps = dailyTemps[date];
    //  const min = Math.min(...temps);
    //  const max = Math.max(...temps);
      
    //  console.log(`${date} → 最低気温: ${min.toFixed(1)}℃, 最高気温: ${max.toFixed(1)}℃`);


          

/*
function getDaily (day){
  switch(day.length) {
    case 1:
      dayObj = {"date" :day[0]["date"],  "weather": day[0]["weather"][0]["id"],  "temp": day[0]["main"]["temp"], "pop" :day[0]["pop"]};
      dayObj["ml"] = day[0]['rain']["rain"]["3h"];

    break;
    case 2: 
      dayObj = {"date" :day[1]["date"]}; 
      dayObj["weather"] = [day[0]["weather"][0]["id"], day[1]["weather"][0]["id"]];
      dayObj["temp"] =   [day[0]["main"]["temp"], day[1]["main"]["temp"]];
      dayObj["pop"] =[ day[0]['pop'], day[1]['pop']]; 
      dayObj["ml"] = [[day[0]['rain']["3h"], day[1]['rain']['3h']]; 
  
    break;
    case 3:
      dayObj = {"date" : day[0]["date"] };
      dayObj["weather"] = [day[0]["weather"][0]["id"], day[1]["weather"][0]["id"]];
      dayObj["temp"] =   [day[0]["main"]["temp"], day[1]["main"]["temp"]];
      dayObj["pop"] =[ day[0]['pop'], day[1]['pop']]; 
      dayObj["ml"] = [[day[0]['rain']["3h"], day[1]['rain']['3h']]; 
  




  }
    
   } 
   }
*/
