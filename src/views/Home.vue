<template>
  <div class="container">
    <div class="left-bar">
      <h2>People</h2>
      <div v-for="person in people" :key="person.id">
        <profile-preview :profile="person"/>
      </div>
    </div>
    <div class="right-bar">
      <h2>Recent Tracks</h2>
      <div v-for="track in tracks" :key="track.id">
        <track-preview :id="track.id" />
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePreview from '@/components/profile/ProfilePreview.vue';
import TrackPreview from '@/components/tracks/TrackPreview.vue';

export default {
  components: {
    ProfilePreview,
    TrackPreview,
  },
  created() {
    this.$store.dispatch('people/getAllPersonalData');
  },
  computed: {
    people() {
      return this.$store.state.people.people.slice(0, 6);
    },
    tracks() {
      return this.$store.state.tracks.tracks.slice(0, 6);
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 500px;
  grid-auto-columns: auto 300px 300px auto;
}
.left-bar {
  width:400px;
  grid-column: 2;
}
.right-bar {
  width:400px;
  grid-column: 3;
}
</style>
