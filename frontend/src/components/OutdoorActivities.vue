<template>
  <div>
    <h3 class="d-flex justify-content-center" style="margin-bottom: 20px;"> Outdoor Activities near {{ cityName }} </h3>
    
    <!-- Buttons for each category -->
    <div v-for="(category, index) in categories" :key="index" class="d-flex justify-content-center mb-3">
      <button 
        class="btn btn-dark w-50"
        data-bs-toggle="modal"
        data-bs-target="#categoryModal"
        @click="showCategoryModal(category)" 
      >
        {{ buttonLabels[index] }}
      </button>
    </div>

    <!-- Modal for displaying activities of a selected category -->
    <div
      class="modal fade"
      id="categoryModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="categoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="categoryModalLabel">{{ buttonLabels[categories.indexOf(selectedCategory)] }} Activities</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body" style="padding: 20px;">
            <template v-if="loading">
              <!-- Loading screen -->
              <div class="text-center">
                <p>Loading...</p>
              </div>
            </template>
            <template v-else>
              <!-- Display activity information -->
              <template v-if="activities.length > 0">
                <div v-for="(activity, index) in activities.slice(0, 5)" :key="index" class="mb-3">
                  <div>
                    <strong>Name:</strong> {{ activity.name }}
                  </div>
                  <div>
                    <strong>Address:</strong> {{ activity.address }}
                  </div>
                  <hr class="my-2" style="border-top: 2px dashed black">
                </div>
              </template>
              <template v-else>
                <!-- Display a message when there are no activities for the category -->
                <p>No Activities Found</p>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const apiKey = "55554058ac4d4628b8a670d116aafab5";

export default {
  props: {
    cityName: {
      type: String,
      default: null,
    },
    countryName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      categories: ['leisure', 'natural', 'sport', 'tourism', 'entertainment'],
      buttonLabels: ['Leisure', 'Nature', 'Sport', 'Tourism', 'Entertainment'],
      selectedCategory: '',
      activities: [],
      loading: false,
    };
  },
  watch: {
    cityName: 'fetchActivitiesForCategory',
    countryName: 'fetchActivitiesForCategory',
  },
  methods: {
    // Fetch activities for a specific category
    fetchActivitiesForCategory(category) {
      this.loading = true; // Set loading to true before fetching

      const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?city=${this.cityName}&country=${this.countryName}&apiKey=${apiKey}`;

      fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const placeId = data.features[0].properties.place_id;
            this.fetchActivities(placeId, category);
          } else {
            console.error("Location not found");
            this.activities = [];
          }
        })
        .catch(error => {
          console.error("Error fetching place ID: " + error);
        });
    },
    // Fetch outdoor activities based on placeId and category
    fetchActivities(placeId, category) {
      const apiUrl = `https://api.geoapify.com/v2/places?categories=${category}&conditions=named&filter=place:${placeId}&lang=en&limit=10&apiKey=${apiKey}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const uniqueActivities = [];
            
            data.features.forEach(feature => {
              const name = feature.properties.name;
              
              // Check if the activity with the same name is not already in the uniqueActivities array
              if (!uniqueActivities.some(activity => activity.name === name)) {
                uniqueActivities.push({
                  name: name,
                  address: feature.properties.formatted ? feature.properties.formatted.replace(name + ", ", "") : 'Address not available',
                  categories: feature.properties.categories || [],
                });
              }
            });
            this.activities = uniqueActivities;
          } else {
            this.activities = [];
          }
        })
        .catch(error => {
          console.error("Error fetching outdoor activities: " + error);
        })
        .finally(() => {
          this.loading = false; // Set loading to false after fetching
        });
    },
    // Display activities for a selected category
    showCategoryModal(category) {
      this.selectedCategory = category;
      this.fetchActivitiesForCategory(category);
    },
  },
};
</script>

<style scoped>
</style>
