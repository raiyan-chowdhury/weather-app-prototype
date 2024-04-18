import { shallowMount } from '@vue/test-utils';
import ForecastModal from '../src/components/ForecastModal.vue';

describe('ForecastModal', () => {
  it('test_5_day_forecast_display', async () => {
    // Generate mock 5-day forecast data with 8 data points per day
    const mock5DayForecastData = {
      list: [],
    };

    // Specify the start date and number of days
    const startDate = new Date('2024-02-10 12:00:00');
    const numberOfDays = 5;
    const dataPointsPerDay = 8;

    for (let day = 0; day < numberOfDays; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
      
        for (let dataPoint = 0; dataPoint < dataPointsPerDay; dataPoint++) {
          const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
      
          // Generate a new data point for each iteration
          mock5DayForecastData.list.push({
            dt_txt: formattedDate,
            weather: [
              {
                icon: `0${dataPoint + 1}d`,
                main: 'Weather Condition', // Replace with actual weather condition
              },
            ],
            main: {
              temp: 20 + dataPoint, // Replace with actual temperature logic
            },
          });
      
          currentDate.setHours(currentDate.getHours() + 3); // Add 3 hours for each data point
        }
    }

    // Mock the fetch function
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mock5DayForecastData),
    });

    const wrapper = shallowMount(ForecastModal);

    // Ensure component is updated after completing the fetch function
    await wrapper.vm.$nextTick();

    // Call the processForecastData method with mock5DayForecastData
    await wrapper.vm.processForecastData(mock5DayForecastData.list);

    // Ensure component is updated after processing the forecast data
    await wrapper.vm.$nextTick();

    console.log(wrapper.html());

    // Select all forecast rows
    const forecastRows = wrapper.findAll('.forecast-row');

    // Ensure there are exactly 5 forecast rows
    expect(forecastRows).toHaveLength(5);

    // Get the processed forecast data directly from the component
    const forecastData = wrapper.vm.forecastData;

    // Iterate through each forecast row and validate the data
    forecastRows.forEach((row, dayIndex) => {
        const dayData = forecastData[dayIndex];
    
        // Validate day name
        expect(row.find('.forecast-row div:nth-child(1)').text()).toBe(dayData.day);
    
        // Validate weather icon
        expect(row.find('.forecast-row div:nth-child(2) img').attributes('src')).toContain(dayData.iconUrl);
    
        // Validate main weather condition
        expect(row.find('.forecast-row div:nth-child(3)').text()).toBe(dayData.mainWeather);
    
        // Validate temperature
        expect(row.find('.forecast-row div:nth-child(4)').text()).toBe(`${dayData.temperature} °C`);
    });  

    // Ensure there are no additional rows beyond the expected total
    expect(forecastRows).toHaveLength(5);
  });
});
