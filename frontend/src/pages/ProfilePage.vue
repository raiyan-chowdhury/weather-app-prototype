<template>
  <div class="container mt-5">
    <form @submit.prevent="submitEditForm" class="custom-form mx-auto">
      <h1 class="text-center mb-4">{{ title }}</h1>

      <!-- Display current username -->
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <label for="currentUsername" class="form-label">Current Username:</label>
          <input id="currentUsername" v-model="currentUsername" class="form-control custom-border" disabled />
        </div>
      </div>

      <!-- Editable fields -->
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <label for="newUsername" class="form-label">New Username:</label>
          <input ref="newUsernameInput" id="newUsername" v-model="newUsername" type="text" class="form-control custom-border" />
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <label for="newPassword" class="form-label">New Password:</label>
          <input ref="newPasswordInput" id="newPassword" v-model="newPassword" type="password" class="form-control custom-border" />
        </div>
      </div>

      <!-- Display error message -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <div class="mb-3 row text-center">
        <div class="col-sm-9 mx-auto">
          <button type="submit" class="btn btn-dark">Update Details</button>
        </div>
      </div>

      <!-- Delete Account link -->
      <div class="mb-3 row text-center">
        <div class="col-sm-9 mx-auto">
          <button type="button" class="btn btn-link" @click="deleteAccount">Delete Account</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useFavouriteStore } from '../store'

export default {
  data() {
    return {
      title: "Edit Profile",
      currentUsername: "",
      newUsername: "",
      newPassword: "",
      errorMessage: "",
      favouriteStore: useFavouriteStore(),
    };
  },
  mounted() {
    // Clear chosen favourite location on component mount
    this.favouriteStore.clearChosenFavouriteLocation();
  },
  methods: {
    // Call backend to update user details
    async submitEditForm() {
      try {
        // Update user details
        const response = await fetch("http://localhost:8000/edit-user-details/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUsername: this.currentUsername,
            newUsername: this.newUsername,
            newPassword: this.newPassword,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          this.currentUsername = responseData.currentUsername;
          sessionStorage.setItem('currentUsername', this.currentUsername);

          // Clear the fields
          this.newUsername = "";
          this.newPassword = "";

          // Reset error message
          this.errorMessage = "";

          // Blur input fields to remove focus
          this.$refs.newUsernameInput.blur();
          this.$refs.newPasswordInput.blur();
        } else {
          const responseData = await response.json();
          this.errorMessage = responseData.message;
          console.error("User details update failed:", this.errorMessage);
        }
      } catch (error) {
          console.error("Error during user details update:", error);
      }
    },
    // Delete user account after confirmation
    async deleteAccount() {
      try {
        // Display a confirmation dialog
        const userConfirmed = window.confirm("Are you sure you want to delete your account?");

        if (!userConfirmed) {
          return;
        }

        // Delete user details from backend
        const response = await fetch("http://localhost:8000/delete-user-account/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.currentUsername,
          }),
        });

        if (response.ok) {
          sessionStorage.removeItem('currentUsername');
          sessionStorage.removeItem("isAuthenticated");
          this.$emit('authenticationChange', false);
          this.$router.push({ name: 'Login Page' });
        } else {
          const responseData = await response.json();
          this.errorMessage = responseData.message;
          console.error("User account deletion failed:", this.errorMessage);
        }
      } catch (error) {
        console.error("Error during user account deletion:", error);
      }
    },
  },
  created() {
    // Set the currentUsername from sessionStorage
    this.currentUsername = sessionStorage.getItem('currentUsername');
  },
};
</script>

<style scoped>
.custom-form {
  background-color: rgb(233, 231, 231);
  padding: 20px;
  max-width: 400px;
  margin: auto;
  border-radius: 10px;
  margin-top: -55px;
}

.custom-border {
  border: 1px solid #555;
  border-radius: 5px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
}
</style>
