<template>
  <div v-if="signedIn" class="container">
    <div>
      <h1>Settings</h1>
      <div class="settings-container">
      </div>
    </div>
  </div>
  <div v-else>
    <login/>
  </div>
</template>

<script>
import Login from '@/views/Login.vue';

export default {
  components: {
    Login,
  },
  data() {
    return {
      editingData: {},
      profileImage: null,
    };
  },
  computed: {
    signedIn() {
      if (this.$store.state.people.personalData.token != null) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.settings-container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}
.column-100 {
  grid-column-start: 1;
  grid-column-end: 3;
}
.margin-top {
  margin-top: 15px;
}
#canvas {
  display: none;
}
#border {
  border: 1px dotted #ffffff;
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;
}
#border:after {
  cursor: pointer;
}
#border:before {
  cursor: pointer;
}
</style>
