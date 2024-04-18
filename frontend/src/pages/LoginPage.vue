<template>
  <div class="container mt-5">
    <!-- Login Form -->
    <form @submit.prevent="submitLoginForm" class="login-form mx-auto">
      <h1 class="text-center mb-4">{{ title }}</h1>

      <!-- Username Input -->
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <input v-model="loginForm.username" type="text" class="form-control login-input" placeholder="Username" required />
        </div>
      </div>

      <!-- Password Input -->
      <div class="mb-3 row">
        <div class="col-sm-9 mx-auto">
          <input v-model="loginForm.password" type="password" class="form-control login-input" placeholder="Password" required />
        </div>
      </div>

      <!-- Display error message if login failed -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <div class="mb-3 row text-center">
        <div class="col-sm-9 mx-auto">
          <button type="submit" class="btn btn-dark">Submit</button>
        </div>
      </div>

      <!-- Create Account Link -->
      <div class="mb-3 row text-center">
        <div class="col-sm-9 mx-auto">
          <button type="button" class="btn btn-link" @click="goToSignUp">Create Account</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Login",
      loginForm: {
        username: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    // Authenticate the user's details on the backend
    async submitLoginForm() {
      try {
        const response = await fetch("http://localhost:8000/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.loginForm),
        });

        if (response.ok) {
          sessionStorage.setItem('currentUsername', this.loginForm.username);
          
          this.errorMessage = "";

          this.$emit("updateAuthenticationStatus", true);

          this.$router.push({ name: 'Home Page' });
        } else {
          const responseData = await response.json();
          this.errorMessage = responseData.message;
          console.error("Login failed:", this.errorMessage);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    // Navigate to the sign up page
    goToSignUp() {
      this.$router.push({ name: 'Sign Up Page' });
    },
  },
};
</script>

<style scoped>
.login-form {
  background-color: rgb(233, 231, 231);
  padding: 20px;
  max-width: 400px;
  margin: auto;
  border-radius: 10px;
}

.login-input {
  border: 1px solid #555;
  border-radius: 5px;
}
</style>
