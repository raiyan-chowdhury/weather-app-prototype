<template>
  <div>
    <!-- Button to trigger the forecast modal -->
    <button 
    type="button" 
    class="btn btn-secondary" 
    data-bs-toggle="modal" 
    data-bs-target="#forecastModal"
    style="margin-left: 100px; margin-top: 25px;" 
    >
      View 5-Day Forecast 
    </button>

    <!-- Modal for displaying 5-day forecast -->
    <div
      class="modal fade"
      id="forecastModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="forecastModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="forecastModalLabel">5-Day Forecast</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
          </div>

          <div class="modal-body">
            <!-- Rows for displaying forecast data -->
            <div v-for="(day, index) in forecastData" :key="index" class="forecast-row">
              <div class="forecast-date">
                <div class="forecast-element">{{ day.day }}</div>
              </div>
              <div class="forecast-icon">
                <div class="forecast-element"><img :src="day.iconUrl" alt="Weather Icon"></div>
              </div>
              <div class="main-weather">
                <div class="forecast-element">{{ day.mainWeather }}</div>
              </div>
              <div class="forecast-temperature">
                <div class="forecast-element">{{ day.temperature }} °C</div>
              </div>
            </div>
          </div>
        </div>
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
      forecastData: [],
    };
  },
  watch: {
    latitude: 'fetchForecastData',
    longitude: 'fetchForecastData',
  },
  mounted() {
    // Fetch 5-day forecast data when both latitude and longitude are available
    if (this.latitude !== null && this.longitude !== null) {
      this.fetchForecastData();
    }
  },
  methods: {
    // Fetch 5-day forecast from OpenWeatherMap API
    async fetchForecastData() {
      if (this.latitude !== null && this.longitude !== null) {
        const apiKey = "8b5c4801c0233c9cfc2aae8f69b6cdba";
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${apiKey}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (response.ok) {
            this.processForecastData(data.list);
          } else {
            console.error(`OpenWeatherMap API error: ${data.message}`);
          }
        } catch (error) {
          console.error(`Error fetching daily forecast: ${error.message}`);
        }
      }
    },
    // Process forecast data and update forecastData array
    processForecastData(forecastList) {
      this.forecastData = forecastList
      // Take data every 24 hours (8 data points per day) and start from 2nd data point (next day)
      .filter((item, index) => index > 0 && (index % 8 === 0 || index === forecastList.length - 1))
        .map(item => ({
          day: this.formatDate(item.dt_txt),
          iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          mainWeather: item.weather[0].main,
          temperature: Math.round(item.main.temp),
        }));
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    },
  },
};
</script>

<style scoped>
.forecast-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #ccc;
  border-bottom: 1px solid #999;
  margin-bottom: 20px;
  border-radius: 10px;
  padding-left: 25px;
  padding-right: 25px;
}

.forecast-element {
  text-align: center;
}

.forecast-icon img {
  max-width: 50px;
}
</style>
