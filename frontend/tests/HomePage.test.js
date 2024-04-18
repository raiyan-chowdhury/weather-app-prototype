import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { shallowMount } from '@vue/test-utils';
import HomePage from '../src/pages/HomePage.vue';

describe('HomePage', () => {
  let pinia;

  beforeEach(async () => {
    pinia = createPinia();
    const app = createApp({});
    app.use(pinia);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('test_geolocation', async () => {
    // Mock geolocation with specific coordinates
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
        Promise.resolve(success({
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
        }))
      ),
    };

    // Apply the mock to the global navigator object
    global.navigator.geolocation = mockGeolocation;

    const wrapper = shallowMount(HomePage);

    // Ensure component is updated after completing the fetch function
    await wrapper.vm.$nextTick();

    // Ensure component state reflects the mocked geolocation data
    expect(wrapper.vm.latitude).toBe(37.7749);
    expect(wrapper.vm.longitude).toBe(-122.4194);
  });

  it('test_weather_display', async () => {
    // Mock weather data response
    const mockWeatherData = {
        city: {
            name: 'TestCity',
            country: 'US',
        },
        list: [
            {
                main: {
                    temp: 25,
                },
                pop: 0.5,
                wind: {
                    speed: 4.47,
                },
                weather: [
                    {
                        description: 'Cloudy',
                        icon: '01d',
                    },
                ],
            },
        ],
    };

    // Mock the fetch function
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockWeatherData),
    });

    const wrapper = shallowMount(HomePage);

    // Set the component's data with the mockWeatherData
    wrapper.setData({
        weatherInfo: {
            location: `${mockWeatherData.city.name}, ${mockWeatherData.city.country}`,
            temperature: Math.round(mockWeatherData.list[0].main.temp),
            precipitation: Math.round(mockWeatherData.list[0].pop * 100), // convert to percentage
            windSpeed: Math.round(mockWeatherData.list[0].wind.speed * 2.237), // convert m/s to mph
            weatherDescription: mockWeatherData.list[0].weather[0].description,
            icon: mockWeatherData.list[0].weather[0].icon, // icon code
        },
    });

    await wrapper.vm.$nextTick();

    console.log(wrapper.html());

    // Ensure weather information is displayed correctly
    expect(wrapper.find('.weather-main h1').text()).toBe('TestCity, US');
    expect(wrapper.find('.weather-main h3').text()).toBe('Cloudy');
    expect(wrapper.find('.weather-section .temperature').text()).toContain('25 °C');
    expect(wrapper.find('.weather-section .precipitation').text()).toContain('50 %');
    expect(wrapper.find('.weather-section .wind-speed').text()).toContain('10 mph');
  });
});
