import { fetchWeather } from '../app/lib/data';
//import {describe, expect, test, toEqual } from 'jest';

describe('fetchWeather', () => {
    test('It should return key of  dayly and  detail object', async () => {
    const result = await fetchWeather(190, 190, '/api/mock-test');
    expect((result.daily).get('2025-05-13')).toEqual({
        "weather": [
            "03d",
            "04n"
        ],
        "min": 20,
        "max": 25,
        "pop": 0,
        "ml": " "
    });
    expect(result.daily.size).toBe(6);

    expect((result.detail).get('2025-5-13')[2]).toEqual({
    "time": "21",
    "weather1": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04n"
        }
    ],
    "weather2": [],
    "temp": 293,
    "pop": 0,
    "humidity": 60,
    "ws": 3.87,
    "wd": 181
});
    expect((result.detail).get('2025-5-13').length).toBe(3);
    expect((result.detail).get('2025-5-18').length).toBe(5);
    expect((result.detail).get('2025-5-17').length).toBe(8);
    });
});

