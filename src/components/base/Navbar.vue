<template>
  <div class="navbar">
    <div class="logo-container">
      <router-link to="/"><div class="logo"></div></router-link>
    </div>
    <div class="brandname padding">
      <!--<router-link to="/" style="color:#ffffff">MuteRave</router-link>//-->
    </div>
    <div class="column right padding">
      <dropdown v-if="auth.token"
                :text="`Yo ${auth.data.name}!`"
                class="float-right dropdown">
        <router-link to="/settings">Settings</router-link>
        <router-link :to="`/${auth.data.username}`">
          <div @click="loadPersonalData">Profile</div>
        </router-link>
        <router-link to="/login">
          <div @click="logout">Logout</div>
        </router-link>
      </dropdown>
      <div v-else class="float-right">
        <router-link to="/sign-up">Sign up</router-link>
        <router-link to="/login">Login</router-link>
      </div>
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
      return this.$store.state.auth.auth;
    },
  },
  methods: {
    loadPersonalData() {
      this.$store.dispatch('people/loadProfileData', this.auth.data.username);
    },
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.navbar {
  display: grid;
  grid-template-columns: 200px auto 50%;
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
  background: url('../../../public/logo.png') no-repeat;
  width: 200px;
  height: 50px;
  background-size: contain;
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
