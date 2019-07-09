<template>
  <div class="container">
    <div>
      <h1>Home</h1>
      <h2>People</h2>
      <div v-for="person in people" :key="person.id">
        <profile-preview :profile="person"/>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePreview from '@/components/profile/ProfilePreview.vue';

export default {
  components: {
    ProfilePreview,
  },
  created() {
    this.$store.dispatch('people/getAllPersonalData');
  },
  computed: {
    people() {
      return this.$store.state.people.people;
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 500px;
}
</style>
