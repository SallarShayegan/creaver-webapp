<template>
  <div>
    {{ personsData.data.name }}
  </div>
</template>

<script>
export default {
  props: {
    id: String,
  },
  created() {
    this.$store.dispatch('people/getPersonalDataById', this.id);
  },
  computed: {
    personsData() {
      return this.$store.getters['people/getPersonalDataById'](this.id) || { data: {} };
    },
  },
};
</script>

<style>

</style>
