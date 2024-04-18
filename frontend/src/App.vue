<template>
  <div>
    <!-- Navigation Bar (visible when authenticated) -->
    <nav v-if="isAuthenticated" class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Navigation Links -->
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Home Page' }" v-bind:class="{ 'active': isActive('Home Page') }">
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Locations Page' }" v-bind:class="{ 'active': isActive('Locations Page') }">
                Locations
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'Profile Page' }" v-bind:class="{ 'active': isActive('Profile Page') }">
                Profile
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Logout Button -->
        <div class="ml-auto">
          <button @click="logout" class="btn btn-logout">Logout</button>
        </div>
      </div>
    </nav>

    <main class="container pt-4">
      <router-view @updateAuthenticationStatus="updateAuthenticationStatus" @authenticationChange="updateAuthenticationStatus" class="flex-shrink-0" />
    </main>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { useFavouriteStore } from './store'

export default defineComponent({
  components: { RouterView },
  data() {
    return {
      isAuthenticated: false,
      favouriteStore: useFavouriteStore(),
    };
  },
  methods: {
    updateAuthenticationStatus(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
      sessionStorage.setItem("isAuthenticated", isAuthenticated);
    },
    logout() {
      fetch("http://localhost:8000/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.isAuthenticated = false;
            sessionStorage.removeItem("isAuthenticated");

            this.favouriteStore.clearChosenFavouriteLocation();

            this.$router.push({ name: "Login Page" });
          } else {
            console.error("Logout failed:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    },
    isActive(routeName) {
      return this.$route.name === routeName;
    },
  },
  created() {
    // Check if the authentication status is stored in sessionStorage
    const storedAuthStatus = sessionStorage.getItem("isAuthenticated");
    if (storedAuthStatus) {
      this.isAuthenticated = JSON.parse(storedAuthStatus);
    }
  },
});
</script>

<style scoped>
.nav-link:hover,
.btn-logout:hover {
  background-color: #f0f0f0;
}

.nav-link.active {
  font-weight: bold;
}

.btn-logout {
  border: none;
}
</style>
