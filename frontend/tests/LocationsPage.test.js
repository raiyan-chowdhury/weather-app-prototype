import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { shallowMount } from '@vue/test-utils';
import LocationsPage from '../src/pages/LocationsPage.vue';

describe('LocationsPage', () => {
  let pinia;

  beforeEach(async () => {
    pinia = createPinia();
    const app = createApp({});
    app.use(pinia);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('test_add_location', async () => {
    const newLocation = {
      name: 'NewCity, Country',
      latitude: 40.7128,
      longitude: -74.0060,
      temperature: 22,
      weatherIconUrl: 'https://example.com/weather-icon.png',
    };

    // Mock the fetch function
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ favourite_locations: [newLocation.name] }),
    });

    const wrapper = shallowMount(LocationsPage);

    const fetchFavouriteLocationsSpy = jest.spyOn(wrapper.vm, 'fetchFavouriteLocations');
    const addFavouriteLocationSpy = jest.spyOn(wrapper.vm, 'addToFavouriteLocations');

    // Mock the fetchWeatherInfo method
    jest.spyOn(wrapper.vm, 'fetchWeatherInfo').mockResolvedValue({
      name: `${newLocation.name}, Country`,
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      temperature: newLocation.temperature,
      weatherIconUrl: newLocation.weatherIconUrl,
    });

    // Simulate the behavior of fetchFavouriteLocations when called
    fetchFavouriteLocationsSpy.mockImplementation(async () => {
      wrapper.vm.favouriteLocations = [newLocation];
    });

    // Trigger click on a location
    await wrapper.setData({ searchQuery: 'NewCity' });
    await wrapper.vm.$nextTick();
    await wrapper.setData({ searchResults: [newLocation] });
    await wrapper.vm.$nextTick();
    const newLocationListItem = wrapper.find('li');
    await newLocationListItem.trigger('click');

    console.log(wrapper.html());

    // Ensure addToFavouriteLocations method is called with the correct parameters
    expect(addFavouriteLocationSpy).toHaveBeenCalledWith(newLocation);

    // Ensure fetchFavouriteLocations method is called
    expect(fetchFavouriteLocationsSpy).toHaveBeenCalled();

    // Ensure addToFavouriteLocations method is called with the correct parameters
    expect(wrapper.vm.favouriteLocations).toHaveLength(1);
    expect(wrapper.vm.favouriteLocations[0]).toEqual(expect.objectContaining(newLocation));
  });

  it('test_remove_location', async () => {
    const newLocation = {
      name: 'NewCity, Country',
      latitude: 40.7128,
      longitude: -74.0060,
      temperature: 22,
      weatherIconUrl: 'https://example.com/weather-icon.png',
    };

    // Mock the fetch function
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ favourite_locations: [newLocation.name] }),
    });

    const wrapper = shallowMount(LocationsPage);

    const fetchFavouriteLocationsSpy = jest.spyOn(wrapper.vm, 'fetchFavouriteLocations');
    const removeFavouriteLocationSpy = jest.spyOn(wrapper.vm, 'removeFavouriteLocation');

    // Mock the fetchWeatherInfo method
    jest.spyOn(wrapper.vm, 'fetchWeatherInfo').mockResolvedValue({
      name: `${newLocation.name}, Country`,
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      temperature: newLocation.temperature,
      weatherIconUrl: newLocation.weatherIconUrl,
    });

    // Simulate the behavior of fetchFavouriteLocations when called
    fetchFavouriteLocationsSpy.mockImplementation(async () => {
      wrapper.vm.favouriteLocations = [newLocation];
    });

    // Trigger click on a location
    await wrapper.setData({ searchQuery: 'NewCity' });
    await wrapper.vm.$nextTick();
    await wrapper.setData({ searchResults: [newLocation] });
    await wrapper.vm.$nextTick();
    const newLocationListItem = wrapper.find('li');
    await newLocationListItem.trigger('click');

    // Simulate clicking the options icon
    const optionsIcon = wrapper.find('.options-element .options-icon');
    await optionsIcon.trigger('click');

    console.log(wrapper.html());

    // Ensure selectedOption is set correctly
    expect(wrapper.vm.selectedOption).toBe(0);

    // Simulate the behavior of removeFavouriteLocation when called
    removeFavouriteLocationSpy.mockImplementation(async () => {
      wrapper.vm.favouriteLocations = [];
    });

    // Locate the remove icon within the options dropdown (2nd image)
    const removeIcon = wrapper.find('.options-dropdown img:nth-child(2)');
    await removeIcon.trigger('click');

    // Ensure options dropdown is closed
    expect(wrapper.vm.selectedOption).toBeNull();

    console.log(wrapper.html());

    // Ensure removeFavouriteLocation method is called with the correct parameters
    expect(removeFavouriteLocationSpy).toHaveBeenCalledWith(newLocation);

    // Ensure fetchFavouriteLocations method is called
    expect(fetchFavouriteLocationsSpy).toHaveBeenCalled();

    // Ensure removeFavouriteLocation method removes the location
    expect(wrapper.vm.favouriteLocations).toHaveLength(0);
  });
});
