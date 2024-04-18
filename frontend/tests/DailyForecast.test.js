import { shallowMount } from '@vue/test-utils';
import DailyForecast from '../src/components/DailyForecast.vue';

describe('DailyForecast', () => {
  it('test_daily_forecast_display', async () => {
    // Mock daily forecast data response
    const mockDailyForecastData = {
      list: [
        {
          weather: [
            {
              icon: '01d',
              main: 'Clear',
            },
          ],
        },
        {
          weather: [
            {
              icon: '02d',
              main: 'Partly Cloudy',
            },
          ],
        },
        {
          weather: [
            {
              icon: '03d',
              main: 'Cloudy',
            },
          ],
        },
        {
            weather: [
              {
                icon: '01d',
                main: 'Clear',
              },
            ],
          },
          {
            weather: [
              {
                icon: '02d',
                main: 'Partly Cloudy',
              },
            ],
          },
          {
            weather: [
              {
                icon: '03d',
                main: 'Cloudy',
              },
            ],
          },
          {
            weather: [
              {
                icon: '01d',
                main: 'Clear',
              },
            ],
          },
      ],
    };

    // Mock the fetch function
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockDailyForecastData),
    });

    const wrapper = shallowMount(DailyForecast);

    // Call the processDailyForecast method with mockDailyForecastData
    wrapper.vm.processDailyForecast(mockDailyForecastData.list);

    // Ensure component is updated after completing the fetch function
    await wrapper.vm.$nextTick();

    console.log(wrapper.html());

    // Select all forecast items
    const forecastItems = wrapper.findAll('.forecast-item');

    // Ensure there are exactly 3 forecast items
    expect(forecastItems).toHaveLength(3);
    
    // First forecast item
    expect(forecastItems[0].find('.time-text').text()).toContain('6h');
    expect(forecastItems[0].find('.weather-text').text()).toBe('Cloudy');
    expect(forecastItems[0].find('img').attributes('src')).toContain('03d@2x.png');
    
    // Second forecast item
    expect(forecastItems[1].find('.time-text').text()).toContain('12h');
    expect(forecastItems[1].find('.weather-text').text()).toBe('Partly Cloudy');
    expect(forecastItems[1].find('img').attributes('src')).toContain('02d@2x.png');
    
    // Third forecast item
    expect(forecastItems[2].find('.time-text').text()).toContain('18h');
    expect(forecastItems[2].find('.weather-text').text()).toBe('Clear');
    expect(forecastItems[2].find('img').attributes('src')).toContain('01d@2x.png');    
  });
});
