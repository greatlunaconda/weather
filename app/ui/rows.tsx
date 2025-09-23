import { fetchWeather } from '../lib/data';
import './rows.css';
import Row from './row';

export default async function Rows() {
  
  
    const points = [{
      'name': 'test_place',
      'url':  '/api/mock-test',
      'lat': 190, 'lon': 190
    }];
    
    const data = await fetchWeather(points[0].lat, points[0].lon, points[0].url)
      .catch(err => console.error('Failed to fetch weather:', err));
    const weatherData =  { ...points[0], weather: data }
  
  if (!weatherData) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <Row name={weatherData.name} weather={weatherData.weather} />
    </div>
  );
}

