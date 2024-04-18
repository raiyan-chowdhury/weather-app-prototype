import { defineStore } from 'pinia';

export const useFavouriteStore = defineStore('favouriteStore', {
    state: () => ({
    chosenLatitude: 0,
    chosenLongitude: 0,
  }),
  actions: {
    setChosenFavouriteLocation(location) {
        this.chosenLatitude = location.latitude;
        this.chosenLongitude = location.longitude;
    },
    clearChosenFavouriteLocation() {
        this.chosenLatitude = 0;
        this.chosenLongitude = 0;
    },
  },
});
