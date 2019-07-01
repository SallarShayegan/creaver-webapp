<template>
  <div class="navbar">
    <div class="logo-container">
      <div class="logo"></div>
    </div>
    <div class="brandname padding">
      <router-link to="/" style="color:#ffffff">MuteRave</router-link>
    </div>
    <div class="column right padding">
      <dropdown v-if="auth.token"
                :text="`Welcome ${auth.data.name}!`"
                class="float-right dropdown">
        <router-link to="/settings">Settings</router-link>
        <router-link :to="`/${auth.data.username}`">Profile</router-link>
      </dropdown>
      <div v-else class="float-right">
        <router-link to="/sign-up">Sign up</router-link>
        <router-link to="/login">Login</router-link>
      </div>
      <router-link to="/contact">Contact us</router-link>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/components/base/Dropdown.vue';

export default {
  components: {
    Dropdown,
  },
  computed: {
    auth() {
      return this.$store.state.people.personalData;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.navbar {
  display: grid;
  grid-template-columns: 50px auto 50%;
  background: $secondary;
  color: $tertiary;
}
.padding {
  padding: 20px;
}
.logo-container {
  padding-top: 7px;
  padding-left: 20px;
}
.logo {
  background-image: url('../../../public/logo.png');
  width: 50px;
  height: 50px;
  background-size: 100%;
  grid-column-start: 1;
  grid-column-end: 2;
}
.brandname {
  grid-column-start: 2;
  grid-column-end: 3;
}
.column {
  grid-column-start: 3;
  grid-column-end: 4;
}
a {
  color: $tertiary;
}
a:hover {
  color: #bbbbbb;
}
.right a, .dropdown {
  margin: 0 10px;
}
</style>
