import { fetchWeather } from '../lib/data';
import styles from './row.module.css';
import Row from './row';
import { getPlaceFromCookie } from '../lib/cookies';

export default async function RowData({ name, lat, lng, url }: { name: string; lat: number; lng: number; url: string }) {
   
  const  data =  await fetchWeather(lat, lng, url)
      .catch(err => console.error('Failed to fetch weather:', err));
      
  if (!data) {
    return <div>Loading...</div>;
  }
  const weatherData = {name: name, data: data}; 
  
  return (
    <div>
      <Row name={weatherData.name} weather={weatherData.data} />
    </div>
  );
}

