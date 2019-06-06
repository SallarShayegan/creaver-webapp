<template>
  <div id="app">
    <default-layout>
      <router-view/>
    </default-layout>
  </div>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue';

export default {
  metaInfo: {
    meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    }],
  },
  components: {
    DefaultLayout,
  },
};
</script>

<style scoped>

</style>
