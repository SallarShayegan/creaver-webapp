<template>
  <div>
    <h3>{{ name }}'s likes</h3>
    <track-preview v-for="track in likes" :id="track" :key="track"/>
  </div>
</template>

<script>
import TrackPreview from '@/components/tracks/TrackPreview.vue';

export default {
  components: {
    TrackPreview,
  },
  computed: {
    likes() {
      return this.$store.state.people.profileData.likes || [];
    },
    name() {
      return this.$store.state.people.profileData.data.name || 'kir';
    },
  },
};

</script>

<style>

</style>
