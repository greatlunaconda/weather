import { fetchWeather } from '../app/lib/data';

declare global {
  var fetch: jest.MockedFunction<typeof globalThis.fetch>;
}

global.fetch = jest.fn();

describe('data.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('fetchWeather', () => {
    const mockWeatherData = {
      city: {
        name: 'Tokyo',
        timezone: 32400
      },
      list: [
        {
          dt: 1640995200,
          main: { temp: 283.15, humidity: 65 },
          weather: [{ id: 800, icon: '01d' }],
          pop: 0.1,
          wind: { speed: 2.5, deg: 180 }
        }
      ]
    };

    it('should fetch and process weather data', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(mockWeatherData)
      });

      const result = await fetchWeather(35.6762, 139.6503);
      
      expect(result).toHaveProperty('daily');
      expect(result).toHaveProperty('detail');
    });

    it('should use custom URL', async () => {
      const customUrl = 'https://custom-api.com/weather';
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve(mockWeatherData)
      });

      await fetchWeather(35.6762, 139.6503, customUrl);
      
      expect(fetch).toHaveBeenCalledWith(customUrl);
    });

    it('should throw error for failed response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404
      });

      await expect(fetchWeather(35.6762, 139.6503)).rejects.toThrow('HTTP error! status: 404');
    });
  });
});