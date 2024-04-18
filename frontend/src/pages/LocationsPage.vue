<template>
  <div>
    <h2 style="text-align: center;">Favourite Locations</h2>

    <div class="search-container">
      <div>
        <label for="search" class="search-label">Add Favourite Location</label>
      </div>
      
      <!-- Search Bar -->
      <div class="search-bar">
        <input type="search" id="search" v-model="searchQuery" @input="handleSearch" placeholder="Search for cities"/>
        <img src="../assets/locations_page/search_icon.png" alt="Search Icon" class="search-icon" />
      </div>
      
      <!-- Search Results -->
      <ul v-if="searchResults.length > 0">
        <li v-for="(result, index) in searchResults" :key="index" @click="addToFavouriteLocations(result)">
          {{ result.name }}, {{ result.country }}
        </li>
      </ul>
    </div>

    <!-- Favourite Locations List -->
    <div v-if="favouriteLocations.length > 0" class="favourite-locations">
      <div v-for="(location, index) in favouriteLocations" :key="index" class="location-bar">
        <div class="location-name">
          <h4>{{ location.name }}</h4>
        </div>
        
        <div class="weather-icon">
          <img :src="location.weatherIconUrl" alt="Weather Icon" />
        </div>
        
        <div class="weather-temp">
          <p>{{ location.temperature }} °C</p>
        </div>
        
        <div class="options-element" tabindex="0">
          <img src="../assets/locations_page/options_icon.png" alt="Options Icon" @click="toggleOptions(index)" class="options-icon" />
          
          <!-- Options Dropdown -->
          <div v-if="selectedOption === index" class="options-dropdown">
            <img src="../assets/locations_page/eye_icon.png" alt="View Icon" @click="viewFavouriteLocation(location); this.selectedOption = null;" class="action-icon" />
            <img src="../assets/locations_page/bin_icon.png" alt="Remove Icon" @click="removeFavouriteLocation(location); this.selectedOption = null;" class="action-icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useFavouriteStore } from '../store'

const apiKey = "8b5c4801c0233c9cfc2aae8f69b6cdba";

export default {
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      favouriteLocations: [],
      selectedOption: ref(null),
      favouriteStore: useFavouriteStore(),
    };
  },
  async mounted() {
    this.favouriteStore.clearChosenFavouriteLocation();
    // Fetch and populate favourite locations on component mount
    await this.fetchFavouriteLocations();
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.length > 2) {
        this.fetchCityNames();
      } else {
        this.searchResults = [];
      }
    },
    // Fetch city names from OpenWeatherMap API based on search query
    async fetchCityNames() {
      const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${this.searchQuery}&limit=5&appid=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
          // a Set to keep track of unique results
          const uniqueResults = new Set();
          this.searchResults = data.map((result) => {
            const key = `${result.name}-${result.country}`;
            if (!uniqueResults.has(key)) {
              uniqueResults.add(key);
              return {
                name: result.name,
                country: result.country,
                latitude: result.lat,
                longitude: result.lon,
              };
            }
            return null; // Skip duplicates
          }).filter(Boolean);
        } else {
          console.error(`OpenWeatherMap API error: ${data.message}`);
        }
      } catch (error) {
        console.error(`Error fetching city names: ${error.message}`);
      }
    },
    // Fetch weather information for the selected location from the OpenWeatherMap API
    async fetchWeatherInfo(location) {
      const [city, country] = location.name.split(',').map(part => part.trim());
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
          return {
            name: `${location.name}, ${country}`,
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            temperature: Math.round(data.main.temp),
            weatherIconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          };
        } else {
          console.error(`OpenWeatherMap API error: ${data.message}`);
          return {
            name: `${location.name}, ${country}`,
            temperature: 'N/A',
            weatherIconUrl: 'N/A',
          };
        }
      } catch (error) {
        console.error(`Error fetching weather information: ${error.message}`);
        return {
          name: `${location.name}, ${country}`,
          temperature: 'N/A',
          weatherIconUrl: 'N/A',
        };
      }
    },
    // Call the backend to fetch the user's favourite locations
    async fetchFavouriteLocations() {
      const username = sessionStorage.getItem('currentUsername');
      const backendUrl = `http://localhost:8000/list-favourite-locations/`;

      try {
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          const updatedFavouriteLocations = await Promise.all(
            data.favourite_locations.map(async (location) => {
              const weatherInfo = await this.fetchWeatherInfo(location);
              return {
                name: location.name,
                latitude: weatherInfo.latitude,
                longitude: weatherInfo.longitude,
                temperature: weatherInfo.temperature,
                weatherIconUrl: weatherInfo.weatherIconUrl,
              };
            })
          );

          this.favouriteLocations = updatedFavouriteLocations;
        } else {
          console.error(`Error fetching favourite locations: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching favourite locations: ${error.message}`);
      }
    },
    // Add a location to user's favourite locations in backend
    async addToFavouriteLocations(location) {
      const username = sessionStorage.getItem('currentUsername');
      const backendUrl = `http://localhost:8000/add-favourite-location/`;

      try {
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            name: `${location.name}, ${location.country}`,
          }),
        });

        if (response.ok) {
          await this.fetchFavouriteLocations();
          this.searchQuery = "";
          this.searchResults = "";
        } else {
          console.error(`Error adding favourite location: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error adding favourite location: ${error.message}`);
      }
    },
    // Removes a location from the user's favourite locations in backend
    async removeFavouriteLocation(location) {
      const username = sessionStorage.getItem('currentUsername');
      const backendUrl = `http://localhost:8000/delete-favourite-location/`;

      try {
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            name: `${location.name}`,
          }),
        });

        if (response.ok) {
          await this.fetchFavouriteLocations();
        } else {
          console.error(`Error removing favourite location: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error removing favourite location: ${error.message}`);
      }
    },
    // Toggles the options dropdown for a location
    toggleOptions(index) {
      if (this.selectedOption === index) {
        // If the dropdown is currently open, close it
        this.selectedOption = null;
      } else {
        // If the dropdown is currently closed, open it
        this.selectedOption = index;
      }
    },
    // View the weather details for a chosen favourite location
    viewFavouriteLocation(location) {
      // Set the chosen favourite location's latitude and longitude in the store
      this.favouriteStore.setChosenFavouriteLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      this.$router.push({ name: 'Home Page'});
    },
  },
};
</script>

<style scoped>
.search-label {
  margin-left: 25px;
  margin-bottom: 10px;
  font-weight: bold;
}

.search-bar {
  position: relative;
}

.search-bar input {
  padding-right: 30px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 190px;
  transform: translateY(-50%);
  max-width: 20px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 215px;
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

li {
  padding: 10px;
  cursor: pointer;
}

li:hover {
  background-color: #f5f5f5;
}

.favourite-locations {
  margin-top: -40px;
  margin-left: 250px;
  width: 650px;
  align-items: center;
}

.location-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ccc;
  margin-bottom: 25px;
  border-radius: 5px;
  padding-left: 20px;
  padding-right: 20px;
}

.location-name {
  margin-right: 10px;
}

.weather-icon {
  width: 100px;
  margin-right: 10px;
}

.weather-temp {
  font-size: 20px;
  margin-top: 25px;
}

.options-element {
  display: flex;
  align-items: center;
  position: relative;
}

.options-element:hover {
  display: flex;
}

.options-icon {
  max-width: 30px;
  cursor: pointer;
  margin-left: 10px;
  position: relative;
  border-radius: 50%;
}

.options-icon:hover {
  background-color: #888;
}

.options-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1;
}

.options-element:hover .options-dropdown,
.options-element:focus-within .options-dropdown {
  display: flex;
}

.action-icon {
  max-width: 40px;
  cursor: pointer;
  margin: 5px;
  transition: transform 0.3s ease-in-out;
}

.action-icon:hover {
  transform: scale(1.2);
}
</style>
