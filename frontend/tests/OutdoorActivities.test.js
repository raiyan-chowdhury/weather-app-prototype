import { shallowMount } from '@vue/test-utils';
import OutdoorActivities from '../src/components/OutdoorActivities.vue';

describe('OutdoorActivities', () => {
  it('test_outdoor_activities_display', async () => {
    // Mock outdoor activities data response
    const mockOutdoorActivitiesData = {
      features: [
        {
          properties: {
            name: 'Activity 1',
            formatted: 'Address 1',
            categories: ['leisure'],
          },
        },
        {
          properties: {
            name: 'Activity 2',
            formatted: 'Address 2',
            categories: ['leisure'],
          },
        },
      ],
    };

    const wrapper = shallowMount(OutdoorActivities);

    // Set the component's selectedCategory to trigger the fetchActivitiesForCategory method
    wrapper.setData({
      selectedCategory: 'leisure',
    });

    // Mock the fetchActivities method and assign mockOutdoorActivitiesData to activityData
    jest.spyOn(wrapper.vm, 'fetchActivities').mockImplementation(async (placeId, category) => {
        // Simulate loading
        wrapper.vm.loading = true;

        // Map mock data to activities array
        wrapper.vm.activities = mockOutdoorActivitiesData.features.map(feature => ({
        name: feature.properties.name,
        address: feature.properties.formatted,
        categories: feature.properties.categories || [],
        }));

        // Simulate the end of loading
        wrapper.vm.loading = false;
    });

    // Wait for the next tick to ensure the component updates
    await wrapper.vm.$nextTick();

    // Simulate the completion of data fetching with a mock placeId (e.g., 1)
    await wrapper.vm.fetchActivities(1, 'leisure');

    // Ensure loading is set to false after data fetching is complete
    expect(wrapper.vm.loading).toBe(false);

    console.log(wrapper.html());

    // Select all activity information elements
    const activityElements = wrapper.findAll('.modal-body .mb-3');

    // Get activities array from the component's data
    const activities = wrapper.vm.activities;

    // Iterate through each activity element and make assertions
    activityElements.forEach((activityElement, index) => {
        const expectedActivity = activities[index];
    
        // Ensure activity name is displayed
        expect(activityElement.find('div:nth-child(1)').text()).toContain(`Name: ${expectedActivity.name}`);
    
        // Ensure activity address is displayed
        expect(activityElement.find('div:nth-child(2)').text()).toContain(`Address: ${expectedActivity.address}`);
    });

    // Ensure the correct number of activities are displayed
    expect(activityElements).toHaveLength(2);
  });
});
