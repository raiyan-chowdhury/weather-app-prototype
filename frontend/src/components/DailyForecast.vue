<template>
  <div>
    <h3 class="forecast-heading">Daily Forecast</h3>
    
    <div class="forecast-container">
      <div v-for="(forecast, index) in dailyForecasts" :key="index" class="forecast-item">
        <p class="time-text"><strong>{{ forecast.time }}</strong></p>
        <img :src="forecast.iconUrl" alt="Weather Icon">
        <p class="weather-text"><strong>{{ forecast.mainWeather }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dailyForecasts: [],
    };
  },
  mounted() {
    // Fetch daily forecast when component is mounted
    if (this.latitude !== null && this.longitude !== null) {
      this.fetchDailyForecast();
    }
  },
  watch: {
    latitude: 'fetchDailyForecast',
    longitude: 'fetchDailyForecast',
  },
  methods: {
    // Fetch daily forecast from OpenWeatherMap API
    async fetchDailyForecast() {
      if (this.latitude !== null && this.longitude !== null) {
        const apiKey = "8b5c4801c0233c9cfc2aae8f69b6cdba";
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${apiKey}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (response.ok) {
            this.processDailyForecast(data.list);
          } else {
            console.error(`OpenWeatherMap API error: ${data.message}`);
          }
        } catch (error) {
          console.error(`Error fetching daily forecast: ${error.message}`);
        }
      }
    },
    // Process forecast data and update dailyForecasts array
    processDailyForecast(forecastList) {
      // Pre-defined indices corresponding to the desired times observed from API response
      const timeIndices = [2, 4, 6];

      // Populate dailyForecasts array dynamically
      this.dailyForecasts = timeIndices.map(index => ({
        time: `${index * 3}h`, // Each index corresponds to a 6-hour interval - 6h, 12h and 18h
        iconUrl: `https://openweathermap.org/img/wn/${forecastList[index].weather[0].icon}@2x.png`,
        mainWeather: forecastList[index].weather[0].main,
      }));
    },
  },
};
</script>

<style scoped>
.forecast-heading {
  margin-left: 105px;
  margin-bottom: 20px;
}

.forecast-container {
  display: flex;
}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}

.forecast-item:not(:last-child) {
  border-right: 1px solid #ccc;
  padding-right: 20px;
}
</style>
