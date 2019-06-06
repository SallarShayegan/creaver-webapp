<template>
  <div class="layout">
    <div>
      <navbar>
        <div class="column-50">
          <router-link to="/">Musection</router-link>
        </div>
        <div class="column right">
          <div v-if="auth.token">
            <router-link to="/settings">Welcome {{ auth.data.first_name }}!</router-link>
          </div>
          <div v-else>
            <router-link to="/sign-up">Sign up</router-link>
            <router-link to="/login">Login</router-link>
          </div>
        </div>
      </navbar>
    </div>
    <div class="container">
      <slot></slot>
    </div>
    <div class="footer">
      <div>All rights reserved. Musection @2019</div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/base/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  computed: {
    auth() {
      return this.$store.state.personalData;
    },
  },
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: 100px auto 100px;
}
.container {
  min-height: 500px;
}
.footer {
  border-top: 1px solid #f0f0f0;
  padding: 10px;
  text-align: center;
  margin-top: 20px;
  color: #cccccc;
}
</style>
