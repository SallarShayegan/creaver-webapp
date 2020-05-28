<template>
  <div class="audio-bar" v-if="currentTrackId">
    <div class="track-preview">
      <div class="thumbnail"
           :style="`background-image:url('${trackData.imageUrl}')`"
           @click="open">
      </div>
      <div class="track-detail">
        {{ trackData.data.name }}
        <span class="small-text" style="color:#aaaaaa">by {{ artistData.data.name }}</span>
      </div>
    </div>
    <track-player :file="trackUrl" class="vue-audio" autoPlay />
  </div>
</template>

<script>
import TrackPlayer from '@/components/tracks/TrackPlayer.vue';

export default {
  components: {
    TrackPlayer,
  },
  computed: {
    trackData() {
      return this.$store.getters['tracks/getTrackById'](this.currentTrackId) || { data: {}, likes: [] };
    },
    trackUrl() {
      return `http://localhost:3000/tracks/${this.currentTrackId}.mp3`;
    },
    currentTrackId() {
      return this.$store.state.tracks.currentTrackId;
    },
    artistData() {
      return this.$store.getters['people/getPersonalDataById'](this.trackData.artist_id) || { data: {} };
    },
  },
  methods: {
    open() {
      this.$router.push(`${this.artistData.data.username}/${this.currentTrackId}`);
    },
  },
};
</script>

<style scoped>
.audio-bar {
  background: #f0f0f0;
  border-top: 1px solid #cccccc;
  display: grid;
  grid-template-columns: auto 250px 500px auto;
  padding: 5px 0;
}
.vue-audio {
  margin-left: 10px;
  grid-column: 3;
  padding-top: 5px;
}
.track-preview {
  grid-column: 2;
  display: grid;
  grid-column: 50px auto;
  column-gap: 10px;
  max-width: 250px;
}
.thumbnail {
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-size: 50px 50px;
  grid-column: 1;
}
.track-detail {
  grid-column: 2;
  padding-top: 10px;
  min-width: 200px;
}
</style>
