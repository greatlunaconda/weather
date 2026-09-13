import { Language } from "./cookies";
    

type WeatherJson = {
  city: {
    timezone: number | string;
    name: string; 
  };
  list: WeatherType[];
};
type WeatherType = {
  dt: number | string;  //The vakue should be changed from UTC to Hours of day
  main: { temp: number | string, humidity: number | string };
  weather: { id: string, icon: string, description: string }[];
  wind: { speed: number | string, deg: number | string };
  pop: number | string;
  rain?: { "3h": number | string };
  snow?: { "3h": number | string };
};

export type DetailType = {
  time: number;
  weather: { id: string, icon: string, desc: string }[];
  temp: number;
  pop: number;
  ml?: number;
  humidity: number;
  ws: number;
  wd: number;
};

export type DailyType = {
  weather: string[][];
  pop: number;
  temp?: number;
  min?: number;
  max?: number;
  ml?: number;
}

function isWeather(obj: unknown): obj is WeatherType {
  return (
    typeof obj === 'object' &&
    obj != null &&
    "dt" in obj &&
    "main" in obj &&
    "weather" in obj &&
    "wind" in obj &&
    "pop" in obj
  )
}
export function isWeatherJson(json: unknown): json is WeatherJson {
  return (
    typeof json == 'object' &&
    json != null &&
    "city" in json &&
    "timezone" in (json as any).city &&
    "name" in (json as any).city &&
    "list" in json &&
    Array.isArray((json as any).list) &&
    (json as any).list.filter((x: unknown) => isWeather(x)).length > 0
  )
}
//ja  en   zh_cn  ar  ru  es fr
//onst url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=ja&appid=${API_KEY}`;

export async function fetchWeather(lat = '', lon = '', lang: Language = "en", data: unknown = ""): Promise<{name:string, details:Map<string, DetailType[]>}>  {
  try {
    let json: unknown;
    if (lat != '' && lon != '') {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=dac6092827afc4e5557966b0e6b61c3f&lang=${lang}`;

      const res = await fetch(url);

      if (res && !res?.ok) {
        throw new Error(`HTTP error! status: ${res?.status}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res?.text();
        throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 200)}`);
      }

      json = await res.json();
    } else { json = data; }
    if (isWeatherJson(json)) {
      const name = json.city.name;
      const daymap = getDayMap(json);
      const detail = getDetail(daymap);
      return {name: name, details: detail};
    } else { throw new Error('Response Json is wrong'); }
  } catch (error) {
    throw error;
  }
}
//let dateStr = `${date.getMonth() + 1}/${date.getDate()} ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}`;
function getDayMap(weatherjson: WeatherJson): Map<string, WeatherType[]> {
  var dayMap = new Map();
  const tz = Number(weatherjson.city.timezone) / 60;
  (weatherjson['list']).forEach((entry: WeatherType) => {
    // UNIX timestamp を JST に変換に変に変換換
    let date = new Date(Number(entry.dt) * 1000);
    const tzo = date.getTimezoneOffset();
    date.setMinutes(tzo + tz);
    //  date.setHours(date.getHours() + 9); //C+9)
    let dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getDay()}`;
    let dateStrHour = date.getHours();
    entry.dt = dateStrHour;
    if (!dayMap.has(dateStr)) {
      dayMap.set(dateStr, []);
    }
    (dayMap.get(dateStr)).push(entry);
  });
  return dayMap;
}

function getDetail(dayMap: Map<string, WeatherType[]>): Map<string, DetailType[]> {

  const detailMap = new Map();
  dayMap.forEach((entry: WeatherType[], date: string) => {
    detailMap.set(date, []);
    entry.forEach((ent: WeatherType) => {
      let ml:undefined | number;
      if (ent.rain) {
        ml = (Number(ent['rain']['3h']) / 3) >= 1 ? Math.round(Number(ent['rain']['3h']) / 3) : Number((Number(ent['rain']['3h']) / 3).toFixed(1));
      }
      if (ent.snow) {
        if(ent.rain && ml){
          ml += (Number(ent['snow']['3h']) / 3) >= 1 ? Math.round(Number(ent['snow']['3h']) / 3) : Number((Number(ent['snow']['3h']) / 3).toFixed(1));
        }
        ml = (Number(ent['snow']['3h']) / 3) >= 1 ? Math.round(Number(ent['snow']['3h']) / 3) : Number((Number(ent['snow']['3h']) / 3).toFixed(1));
      }
           
      let weather = ent.weather.map(x => ({ id: String(x.id), icon: x.icon, desc: x.description }));
      weather.forEach((w, i) => w.icon == '50d' && weather.push(weather.splice(i, 1)[0]))
      const detobj: DetailType = {
        'time': Number(ent.dt),
        'weather': weather,
        'temp': Math.round(Number(ent.main.temp) - 273.15),
        'pop': Math.round(Number(ent.pop) * 10) * 10,
        'humidity': Number(ent.main.humidity),
        'ws': Number(ent.wind.speed),
        'wd': Number(ent.wind.deg)
      };
       ml && (detobj['ml'] = ml);    
      detailMap.get(date).push(detobj);
    });
  });
  return detailMap;
}


function makeWeather(weathers: DetailType['weather'][]): string[][]{ 

  const weatherCell = ( weathers:DetailType['weather'][], start:number, end:number  ): string[][] => {

    let atweather = start==end ? weathers[start] : weathers[start].concat(weathers[end]);
    let ids = atweather.map(x => x.id);
    atweather =  atweather.filter((x, i) => ids.indexOf(x.id)  == i);

    const icons: string[][] = [];
    atweather.forEach((elem , num) => {
      
      let icon = elem.icon.replace("n", "d");
      let ind = icons.findIndex(x => x[0] == icon);
      if (ind != -1) {
        icons[ind].push(elem.desc);
      } else {
        icons.push([icon, elem.desc]);
      }
  });
  icons.forEach((x, ind) => {
    if (x[0] == '50d') {
      icons.push(icons.splice(ind, 1)[0]);
    } 

  });
  return icons;

};
    
  switch (weathers.length) {
      case 8:
        return weatherCell(weathers,  3, 6 );
     
      case 1:
        return weatherCell(weathers, 0, 0)
        break;
      case 2:
        return weatherCell(weathers, 1, 1);
        break;
      case 3:
        return weatherCell(weathers, 0, 2);
        break;
      case 4:
        return weatherCell(weathers, 1, 3);
        break;
      case 5:
        return weatherCell(weathers, 1, 4);
      case 6:
        return weatherCell(weathers, 2, 5);
        break;
      case 7:
        return weatherCell(weathers, 2, 6); 
        break;
      default:  throw( new Error("something wrong") );
      
  }
}

export function getDaily(dailys:  Map<string, DetailType[]>): Map<string, DailyType> {
  const dailyMap = new Map();
  dailys.forEach((ent: DetailType[], date: string) => {
    let dailyobj: any = {};
    const weathers = ent.map((e: DetailType) => e.weather);
    dailyobj['weather'] = makeWeather(weathers);
    

    let min = Math.min(...ent.map(e => e.temp));
    let max = Math.max(...ent.map(e => e.temp));
    if (max == min) { dailyobj['temp'] = max; }
    else {
      dailyobj['min'] = min;
      dailyobj['max'] = max;
    }

    dailyobj['pop'] = Math.max(...ent.map(e => e.pop));
    
    let ml =  ent.reduce((a, e) => e.ml != null ? a + e.ml*3 : a, 0); 

    dailyobj['ml'] = Math.round(ml);
        
    dailyMap.set(date, dailyobj);
  
  });
  return dailyMap;
};
