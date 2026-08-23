import {DetailType, fetchWeather,  getDaily  } from '../app/lib/data';

import  testdata from  './data/testweather.json';
//import fs from 'fs';
//import path from 'path';
//import '@testing-library/jest-dom'

// Mock fetch
//global.fetch '= jest.fn(() =>
//  Promise.resolve({
//    ok: true,
//    headers: { get: () => 'application/json' },
//    json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.resolve('public/testweather.json'), 'utf8')))
 // })
//) as jest.Mock;

describe('fetchWeather', () => {
  let result:Map<string,DetailType[]>;
    beforeAll(async () => {
      result = await  fetchWeather('','', 'english', testdata);
    } );
    
    it('It should return key of  dayly and  detail object', async () => {    
     expect(result).toBeDefined();
     expect(result.get('8/10 Sun')?.at(2)).toEqual( {
    "time": 21,
    "weather": [{       
       id: '804', 
       icon: '04n',
       desc: 'overcast clouds'
    }],
    "temp": 26,
    "pop": 0, 
    "humidity": 84,
    "ws": 0.53,
    "wd": 5
} );
    expect(result.get('8/10 Sun')?.length).toBe(3);
    expect(result.get('8/14 Thu')?.length).toBe(8);
    expect(result.get('8/15 Fri')?.length).toBe(5);
    
    });  
    it ('It suould return daily object', () => {
       let daily = getDaily(result);
    expect(daily.get('8/10 Sun'))?.toEqual({       
    "weather": [
        ['10d', 'light rain'],
        ['04d',  'overcast clouds'] 
    ],
    "temp": 26,
    "pop": 20,
    "ml": 0
    });
    
    expect(daily.size).toBe(6);

    expect(daily.get('8/15 Fri')).toBeDefined();    
    });
});
