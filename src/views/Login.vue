<template>
  <div>
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
      if (this.username.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        data.email = this.username;
      } else data.username = this.username;
      this.$store.dispatch('logPersonIn', data);
    },
  },
};
</script>

<style scoped>
.login-container {
  padding-top: 20px;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: auto auto auto;
  grid-gap: 10px;
}
input, .center {
  display: block;
  grid-column-start: 2;
  grid-column-end: 3;
}

@media screen and (max-width: 600px) {
  .login-container {
    grid-template-columns: auto 300px auto;
  }
}
</style>
