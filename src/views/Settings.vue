<template>
  <div v-if="signedIn">
    <h1>Edit profile</h1>
    <div class="settings-container">
      <input class="column-100"
             type="text"
             v-model="editingData.data.username"
             placeholder="Username"/>
      <input class="column"
             type="text"
             v-model="editingData.data.first_name"
             placeholder="First name"/>
      <input class="column"
             type="text"
             v-model="editingData.data.last_name"
             placeholder="Last name"/>
      <input class="column-100"
             type="text"
             v-model="editingData.data.email"
             placeholder="Email address"/>
      <input class="column-100"
             type="text"
             v-model="editingData.data.phone"
             placeholder="Phone number"/>
      <input class="column-100"
             type="text"
             v-model="editingData.data.birth_date"
             placeholder="Date of birth"/>
      <input class="column-100"
             type="text"
             v-model="editingData.data.city"
             placeholder="City"/>
      <input class="column-100"
             type="text"
             v-model="editingData.data.country"
             placeholder="Country"/>
      <div class="column-100">
        <button @click="saveChanges" class="margin-top">Save changes</button>
      </div>
    </div>
  </div>
  <div v-else>
    <login/>
  </div>
</template>

<script>
import Login from './Login.vue';

export default {
  components: {
    Login,
  },
  data() {
    return {
      editingData: {},
    };
  },
  methods: {
    saveChanges() {
      this.$store.dispatch('changePersonalData', this.editingData);
    },
  },
  computed: {
    signedIn() {
      if (this.$store.state.personalData.token != null) {
        this.editingData = JSON.parse(JSON.stringify(this.$store.state.personalData));
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
</style>
