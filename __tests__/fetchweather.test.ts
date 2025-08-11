import { fetchWeather } from '../app/lib/data';
import fs from 'fs';
import path from 'path';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.resolve('public/testweather.json'), 'utf8')))
  })
) as jest.Mock;

describe('fetchWeather', () => {
    test('It should return key of  dayly and  detail object', async () => {
    const result = await  fetchWeather(190, 190, '/api/mock-test');
    expect((result.daily).get('8/10 Sun')).toEqual({
    "weather": [
        "10d",
        "04n"
    ],
    "temp": 26,
    "pop": 0.2,
    "ml": 0.14
});
    expect(result.daily.size).toBe(6);

    expect(result.detail.get('8/10 Sun').at(2)).toEqual( {
    "time": 21,
    "weather1": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04n"
        }
    ],
    "weather2": [],
    "temp": 26,
    "pop": 0,
    "humidity": 84,
    "ws": 0.53,
    "wd": 5
} );
    expect((result.detail).get('8/10 Sun').length).toBe(3);
    expect((result.detail).get('8/14 Thu').length).toBe(8);
    expect((result.detail).get('8/15 Fri').length).toBe(5);
    
    });
});
