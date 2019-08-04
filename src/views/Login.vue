<template>
  <div class="container">
    <div class="login-container">
      <div class="center">
        <h1>Login</h1>
        <textbox v-model="username"
                 placeholder="Username / email"
                 disableInfo
                 validation="not-empty"
                 @input="error = false"
                 @error="error = true"/>
        <textbox type="password"
                 v-model="password"
                 placeholder="Password"
                 disableInfo
                 validation="not-empty"
                 @input="error = false"
                 @error="error = true"
                 style="margin:10px 0 20px"/>
        <button style="margin-right: 20px;" @click="login">Login</button>
        <router-link to="/">reset password</router-link> or
        <router-link to="/sign-up">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Textbox from '../components/base/Textbox.vue';

export default {
  components: {
    Textbox,
  },
  data() {
    return {
      username: '',
      password: '',
      error: false,
    };
  },
  methods: {
    login() {
      if (this.error) return this.$store.dispatch('sendNote', { message: 'Please correct marked fields.' });
      const data = {
        password: this.password,
      };
      if (this.username.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        data.email = this.username;
      } else data.username = this.username;
      return this.$store.dispatch('login', data);
    },
  },
  computed: {
    userRoute() {
      return this.$store.state.auth.auth.data.username;
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
  grid-gap: 0;
}
.center {
  grid-column: 2;
}

@media screen and (max-width: 600px) {
  .login-container {
    grid-template-columns: auto 300px auto;
  }
}
</style>
