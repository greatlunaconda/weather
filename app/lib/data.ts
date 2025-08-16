import { WritableStreamDefaultWriter } from "node:stream/web";

type WeatherJson = Object;

export  async function  fetchWeather(lat: number, lon: number, url ='') {
  if (url == ''){
   url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dac6092827afc4e5557966b0e6b61c3f`;
  } 
  const res = await fetch(url)
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 200)}`);
  }
  
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
function getDaily(dayMap: DayMap)  {
  var dailyMap  = new  Map();  
  dayMap.forEach((ent, date) => {
    let  dailyobj = {};
    let wids = [];
    wids.push(ent.map(ent1 =>  ent1.weather.map(ent2 => ent2.id ) ) );
    
    }
    switch(ent.length){
      case 8: 
        
        rids = wids[3].concate(wids[6]);
        rids = rids.filter((x, i) => rids.indexOf(x) == i); 
        dailyobj['weather'] = rids; 
        
      break;

      case 1:  dailyobj['weather'] = wids[0]; break;
      case 2:  dailyobj['weather'] = wids[1]; break;
      case 3:  rids = wids[0].concate(wids[2]);
               rids = rids.filter((x, i) => rids.indexOf(x) == i); 
               dailyobj['weather'] = rids; 
               break;
      case 4:  rids = wids[1].concate(wids[3]);
               rids = rids.filter((x, i) => rids.indexOf(x) == i); 
               dailyobj['weather'] = rids;
      case 5:  rids = wids[1].concate(wids[4]);
               rids = rids.filter((x, i) => rids.indexOf(x) == i); 
               dailyobj['weather'] = rids;    
               break;
      case 6: rids = wids[2].concate(wids[5);
              rids = rids.filter((x, i) => rids.indexOf(x) == i); 
              dailyobj['weather'] = rids;
              break; 
      case 7: rids = wids[2].concate(wids[6]);
              rids = rids.filter((x, i) => rids.indexOf(x) == i); 
              dailyobj['weather'] = rids; 
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
     
      detobj['weather1'] = ent.weather.filter(elem => elem.icon != ('50d'||'50n'));
      detobj['weather2'] = ent.weather.filter(elem => elem.icon == ('50d'||'50n'));
    
      detobj['temp'] = Math.round(Number(ent.main.temp - 273.15)); 
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
