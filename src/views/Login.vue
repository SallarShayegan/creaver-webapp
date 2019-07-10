<template>
  <div class="container">
    <div class="login-container">
      <div class="center">
        <h1>Login</h1>
      </div>
      <input type="text" v-model="username" placeholder="Username / email"/>
      <input type="password" v-model="password" placeholder="Password"/>
      <div class="center">
        <button style="margin-right: 20px;" @click="login">Login</button>
        <router-link to="/">reset password</router-link> or
        <router-link to="/sign-up">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      const data = {
        password: this.password,
      };
      if (this.username.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        data.email = this.username;
      } else data.username = this.username;
      this.$store.dispatch('people/logPersonIn', data);
    },
  },
  computed: {
    userRoute() {
      return this.$store.state.people.personalData.data.username;
    },
  },
};
</script>

<style scoped>
.container {
  min-height: auto;
}
.login-container {
  padding: 20px 0 200px 0;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-gap: 10px;
}
input, .center {
  grid-column-start: 2;
  grid-column-end: 3;
}

@media screen and (max-width: 600px) {
  .login-container {
    grid-template-columns: auto 300px auto;
  }
}
</style>
