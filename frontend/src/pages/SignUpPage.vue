<template>
  <div class="container mt-5">
    <!-- Sign-Up Form -->
    <form @submit.prevent="submitSignUpForm" class="custom-form mx-auto">
      <h1 class="text-center mb-4">{{ title }}</h1>

      <!-- Username Input -->
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <input v-model="signupForm.username" type="text" class="form-control custom-border" placeholder="Username" required />
        </div>
      </div>

      <!-- Password Input -->
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <input v-model="signupForm.password" type="text" class="form-control custom-border" placeholder="Password" required />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mb-3 row text-center">
        <div class="col-sm-9 mx-auto">
          <button type="submit" class="btn btn-dark">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Sign Up",
      signupForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    // Add the user's details to the backend
    async submitSignUpForm() {
      try {
        const response = await fetch("http://localhost:8000/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.signupForm),
        });

        if (response.ok) {
          sessionStorage.setItem('currentUsername', this.signupForm.username);

          // Emit an event to update authentication status in App.vue
          this.$emit("updateAuthenticationStatus", true);

          this.$router.push({ name: 'Home Page' });
        } else {
          const responseData = await response.json();
          console.error("Registration failed:", responseData.message);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    },
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
}

.custom-border {
  border: 1px solid #555;
  border-radius: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
}
</style>
