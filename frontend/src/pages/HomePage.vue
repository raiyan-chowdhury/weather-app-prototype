<template>
  <div class="container">
    <div class="row">
      <!-- Weather display -->
      <div class="col-md-7">
        <div v-if="weatherInfo" class="weather-main">
          <h1>{{ weatherInfo.location }}</h1>
          <h3>{{ weatherInfo.weatherDescription }}</h3>
          <img :src="weatherIconUrl" alt="Weather Icon">
        </div>
      </div>

      <!-- Weather details -->
      <div class="col-md-3">
        <div v-if="weatherInfo" class="weather-section">
          <div>
            <img src="../assets/home_page/temp_icon.png" alt="Temperature Icon" class="weather-icon"/>
            <p class="temperature"><strong> {{ weatherInfo.temperature }} °C </strong></p>
          </div>
          <div>
            <img src="../assets/home_page/rain_icon.png" alt="Rain Icon" class="weather-icon"/>
            <p class="precipitation"><strong> {{ weatherInfo.precipitation }} % </strong></p>
          </div>
          <div>
            <img src="../assets/home_page/wind_icon.png" alt="Wind Icon" class="weather-icon"/>
            <p class="wind-speed"><strong> {{ weatherInfo.windSpeed }} mph </strong></p>
          </div>
        </div>
      </div>

      <!-- Go Back button -->
      <div class="col-md-2">
        <button 
          v-if="isFavouriteLocationSet" 
          @click="goBack" 
          class="btn btn-danger"
          style="position: absolute; right: 50px; top: 100px;"
        >
          Go Back
        </button>
      </div>
    </div>

    <div v-if="showContent" class="row" style="margin-bottom: 25px;">
      <div class="col-md-6">
        <!-- Daily Forecast component -->
        <div class="daily-forecast">
          <daily-forecast :latitude="latitude" :longitude="longitude" />
        </div>
        <!-- Forecast Modal component -->
        <div class="forecast-modal">
          <forecast-modal :latitude="latitude" :longitude="longitude" />
        </div>
      </div>

      <div class="col-md-6">
        <!-- Outdoor Activities component -->
        <div class="outdoor-activities">
          <outdoor-activities :cityName="currentCity" :countryName="currentCountry"/>
        </div>
      </div>
    </div>

    <!-- Error message display -->
    <div v-if="error">
      <p>Error fetching weather information: {{ error }}</p>
    </div>
  </div>
</template>
  
<script>
import DailyForecast from '../components/DailyForecast.vue';
import ForecastModal from '../components/ForecastModal.vue';
import OutdoorActivities from '../components/OutdoorActivities.vue'

import { useFavouriteStore } from '../store'

export default {
  components: {
    DailyForecast,
    ForecastModal,
    OutdoorActivities,
  },
  data() {
    return {
      title: "Home Page",
      showContent: false,
      weatherInfo: null,
      error: null,
      latitude: null,
      longitude: null,
      currentCity: "",
      currentCountry:"",
      favouriteStore: useFavouriteStore(),
    };
  },
  computed: {
    // Generate a weather icon URL
    weatherIconUrl() {
      if (this.weatherInfo && this.weatherInfo.icon) {
        return `https://openweathermap.org/img/wn/${this.weatherInfo.icon}@2x.png`;
      } else {
        return '';
      }
    },
    // Check if favourite location's coordinates are set
    isFavouriteLocationSet() {
      return (
        this.favouriteStore.chosenLatitude !== 0 &&
        this.favouriteStore.chosenLongitude !== 0
      );
    },
  },
  mounted() {
    // Check if latitude and longitude are set in the favourite store
    const { chosenLatitude, chosenLongitude } = this.favouriteStore;
    
    if (chosenLatitude !== 0 && chosenLongitude !== 0) {
      // Use the favourite location's coordinates
      this.latitude = chosenLatitude;
      this.longitude = chosenLongitude;
      this.getWeatherData(this.latitude, this.longitude);
    } else {
      // Use geolocation if favourite location's coordinates are not set
      this.fetchWeatherInformation();
    }
  },
  methods: {
    // Fetch weather information using geolocation
    fetchWeatherInformation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.latitude = latitude;
            this.longitude = longitude;
            this.getWeatherData(latitude, longitude);
          },
          () => {
            // Handle geolocation error, e.g., user denied access
            this.getWeatherDataDefaultCity();
          }
        );
      } else {
        // Geolocation not supported
        this.getWeatherDataDefaultCity();
      }
    },
    // Fetch weather information for the default city (London)
    async getWeatherDataDefaultCity() {
      const defaultLatitude = 51.5085; // London's latitude
      const defaultLongitude = -0.1257; // London's longitude
      this.latitude = defaultLatitude;
      this.longitude = defaultLongitude;
      this.currentCity = 'London';
      this.currentCountry = 'GB';
      this.getWeatherData(defaultLatitude, defaultLongitude);
    },
    // Fetch weather information from the OpenWeatherMap API
    async getWeatherData(latitude, longitude) {
      const apiKey = "8b5c4801c0233c9cfc2aae8f69b6cdba"; // personal OpenWeatherMap API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
          this.currentCity = data.city.name;
          this.currentCountry = `${data.city.country}`;
          const countryName = this.getCountryName(data.city.country);

          this.weatherInfo = {
            location: `${data.city.name}, ${countryName}`,
            temperature: Math.round(data.list[0].main.temp),
            precipitation: Math.round(data.list[0].pop * 100), // convert to percentage
            windSpeed: Math.round(data.list[0].wind.speed * 2.237), // convert m/s to mph
            weatherDescription: data.list[0].weather[0].description,
            icon: data.list[0].weather[0].icon, // icon code
          };
        } else {
          this.error = `OpenWeatherMap API error: ${data.message}`;
        }
      } catch (error) {
        this.error = `Error fetching weather information`;
      }
      this.showContent = true;
    },
    // Get the country name based on the country code
    getCountryName(countryCode) {
      const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
      return countryNames.of(countryCode);
    },
    // Navigate back to the Locations Page and clear the chosen favourite location in the store
    goBack() {
      this.favouriteStore.clearChosenFavouriteLocation();
      this.$router.push({ name: 'Locations Page' });
    },
  },
};
</script>
  
<style scoped>
.weather-icon {
  width: 60px;
  height: 60px;
}

.weather-section {
  margin-top: 55px;
  margin-left: -40px;
  display: flex;
  text-align: center;
}

.weather-section div:not(:last-child) {
  margin-right: 100px;
}

.weather-section p {
  margin-top: 10px;
}

.daily-forecast {
  margin-top: 25px;
}

.outdoor-activities {
  margin-top: 25px;
}
</style>
