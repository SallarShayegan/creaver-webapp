<template>
  <div class="container">
    <div>
      <h1>Home</h1>
      <h2>People</h2>
      <div v-for="person in people" :key="person.id">
        <router-link :to="`/${person.data.username}`">
          {{ person.data.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('getAllPersonalData');
  },
  computed: {
    people() {
      return this.$store.state.people;
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 500px;
}
</style>
