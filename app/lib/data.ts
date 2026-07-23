type WeatherJson = {
  city: {
    timezone: number|string;
  };
  list: Weather[];
};
type Weather = {
  dt: number|string;  //The vakue should be changed from UTC to Hours of day
  main: { temp: number|string, humidity: number|string };
  weather: { id:  string, icon: string }[];
  wind: { speed: number|string, deg: number|string };
  pop: number|string;
  rain?: { "3h": number|string };
  snow?: { "3h": number|string };
};

export  type Detail = { 
  time: number;
  weather: {id: string, icon: string}[];
  temp: number;
  pop: number;
  ml? : number;
  humidity: number;
  ws: number;
  wd: number;
};

export type Daily = {
  weather: string[];
  pop: number;
  temp?: number;
  min?:  number;
  max?:  number;
  ml? : number;
}

export type WeatherResult = {
  daily: Map<string, Daily>;
  detail: Map<string, Detail[]>;
  };

function isWeather (obj: unknown): obj is Weather{
   return (
    typeof obj === 'object' && 
    obj != null &&
    "dt" in obj &&   
    "main" in obj &&
    "weather" in  obj  &&
    "wind" in obj &&
    "pop" in obj
    )
}
export function isWeatherJson (json: unknown): json is WeatherJson {
  return (
    typeof json == 'object' &&
    json != null &&
    "city" in json &&
    "timezone" in (json as any).city &&
    "list" in json &&
    Array.isArray((json as any).list) &&
    (json as any).list.filter((x: unknown) => isWeather(x)).length > 0 
  )
}
//ja  en   zh_cn  ar  ru  es fr
//onst url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=ja&appid=${API_KEY}`;

export async function fetchWeather(lat='', lon='', data:unknown):Promise<WeatherResult>{
  try {
    let json:unknown;
    if (lat != '' && lon != ''){
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dac6092827afc4e5557966b0e6b61c3f`;
      
    const res =  await fetch(url)  
    
      if(res && !res?.ok){
        throw new Error(`HTTP error! status: ${res?.status}`);
       }

    const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {  
        const text = await res?.text();
        throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 200)}`);
      }
    
    json = await res.json();
    } else {json = data;}
  if(isWeatherJson(json)){
  const daymap = getDayMap(json);
  const daily = getDaily(daymap);
  const detail = getDetail(daymap);
  const weather = { 'daily': daily, 'detail': detail };
  return weather;
    } else {throw new Error('Response Json is wrong');} 
  } catch(error) {
    throw error; 
  }
}

function getDayMap(weatherjson: WeatherJson): Map<string, Weather[]> {
  var dayMap = new Map();
  const tz = Number(weatherjson.city.timezone) / 60;
  (weatherjson['list']).forEach((entry: Weather) => {
    // UNIX timestamp を JST に変換
    let date = new Date(Number(entry.dt) * 1000);
    const tzo = date.getTimezoneOffset();
    date.setMinutes(tzo + tz);
    //  date.setHours(date.getHours() + 9); //C+9)
    let dateStr = `${date.getMonth() + 1}/${date.getDate()} ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}`;
    let dateStrHour = date.getHours();
    entry.dt = dateStrHour;
    if (!dayMap.has(dateStr)) {
      dayMap.set(dateStr, []);
    }
    (dayMap.get(dateStr)).push(entry);
  });
  return dayMap;
}

function getDetail(dayMap: Map<string, Weather[]>): Map<string, Detail[]> {
  const detailMap = new Map();
  dayMap.forEach((entry: Weather[], date: string) => {
    detailMap.set(date, []);
    entry.forEach((ent: Weather) => {
      
      const detobj:Detail = { 
        'time': Number(ent.dt), 
        'weather': ent.weather.map(x => ( {id: String(x.id), icon: x.icon} )),
        'temp': Math.round(Number(ent.main.temp) - 273.15),
        'pop': Math.round(Number(ent.pop) * 10) * 10,
        'humidity' : Number(ent.main.humidity),
        'ws' : Number(ent.wind.speed),
        'wd' : Number(ent.wind.deg) 
      };

      if (ent.rain) {
        detobj['ml'] = (Number(ent['rain']['3h']) / 3) >= 1 ? Math.round(Number(ent['rain']['3h']) / 3) : Math.round(Number(ent['rain']['3h']) / 3 * 10) / 10;
      }
      if (ent.snow) {
        detobj['ml'] = (Number(ent['snow']['3h']) / 3) >= 1 ? Math.round(Number(ent['snow']['3h']) / 3) : Math.round(Number(ent['snow']['3h']) / 3 * 10) / 10;
      }
           detailMap.get(date).push(detobj);
    });
  });
  return detailMap;
}


function getDaily(dayMap: Map<string, Weather[]>): Map<string, Daily>  {
  const dailyMap = new Map();
  dayMap.forEach((ent: Weather[], date: string) => {
    let dailyobj: any = {};
    const weathers = ent.map((ent1: Weather) => ent1.weather);
    console.log("libweatherpbj");

    switch (ent.length) {
      case 8:

        var rweather = weathers[3].concat(weathers[6]);
        var rids = rweather.map(ent => String(ent.id));
        rids = rids.filter((x , i) => rids.indexOf(x) == i);
        dailyobj['weather'] = rids;
        break;

      case 1:
        dailyobj['weather'] = weathers[0].map(x => String(x.id));
        break;
      case 2:
        dailyobj['weather'] = weathers[1].map(x => String(x.id));
        break;
      case 3:
        var rweather = weathers[0].concat(weathers[2]);
        var rids = rweather.map(x => String(x.id));
        rids = rids.filter((x, i) => rids.indexOf(x) == i);
        dailyobj['weather'] = rids;
        break;
      case 4:
        var rweather = weathers[1].concat(weathers[3]);
        var rids = rweather.map(x => String(x.id));
        rids = rids.filter((x, i) => rids.indexOf(x) == i);
        dailyobj['weather'] = rids;
        break;
      case 5:
        var rweather = weathers[1].concat(weathers[4]);
        var rids = rweather.map(x => String(x.id));
        rids = rids.filter((x, i) => rids.indexOf(x) == i)
        dailyobj['weather'] = rids;
        break;
      case 6:
        var rweather = weathers[2].concat(weathers[5]);
        var rids = rweather.map(x => String(x.id));
        rids = rids.filter((x, i) => rids.indexOf(x) == i)
        dailyobj['weather'] = rids;
        // var rids = (wids[2]).concat(wids[5]);
        break;
      case 7:
        var rweather = weathers[2].concat(weathers[6]);
        var rids = rweather.map(x => String(x.id));
        rids = rids.filter((x, i) => rids.indexOf(x) == i)
        dailyobj['weather'] = rids;

        // var rids = (wids[2]).concat(wids[6]); 
        break;
      default: console.log("something wrong");
    }

    let temps = ent.map((entry: Weather) => Math.round(Number(entry.main.temp) - 273.15));
    let min = Math.min(...temps);
    let max = Math.max(...temps);
    if (max == min) { dailyobj['temp'] = max; }
    else {
      dailyobj['min'] = min;
      dailyobj['max'] = max;
    }

    let pops = ent.map((entry: Weather) => Number(entry.pop));
    dailyobj['pop'] = (Math.round((Math.max(...pops) * 10))) * 10;

    if (dailyobj['pop'] != 0) {
      let mls = ent.map((entry: Weather) => {
        if (entry.rain) { if (entry['rain']['3h'] != '') { return Number(entry['rain']["3h"]); } else { return 0; } }
        else if (entry.snow) { if (entry['snow']['3h'] != '') { return Number(entry['snow']["3h"]); } else { return 0; } }

        else { return 0; }
      });

      dailyobj['ml'] = mls.reduce((a = 0, ml) => ml != null ? a += ml : a);
      dailyobj['ml'] = dailyobj['ml'] >= 1 ? Math.round(dailyobj['ml']) : Math.round(dailyobj['ml'] * 10) / 10;

    }
    dailyMap.set(date, dailyobj);


  });
  return dailyMap;


}



