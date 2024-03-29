<template>
  <div class="audio-bar" v-if="currentTrackId">
    <div class="track-preview">
      <div class="thumbnail"
           :style="`background-image:url('${trackData.imageUrl}')`"
           @click="open">
      </div>
      <div class="track-detail">
        <div style="cursor:pointer;display:inline;margin-right:5px"
             @click="open">{{ trackData.data.name }}</div>
        <span class="small-text">by</span>
        <span class="small-text" @click="loadPersonalData">
          <router-link :to="`/${artistData.profile_data.username}`">
            {{ artistData.profile_data.name }}
          </router-link>
        </span>
      </div>
    </div>
    <track-player :file="trackUrl"
                  class="vue-audio"
                  autoPlay
                  ref="player"
                  @finished="playNext" />
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
      this.$store.dispatch('tracks/getTrackById', this.currentTrackId);
      return this.$store.getters['tracks/getTrackById'](this.currentTrackId) || { data: {}, likes: [] };
    },
    trackUrl() {
      return `http://localhost:3000/tracks/${this.currentTrackId}.mp3`;
    },
    currentTrackId: {
      get() {
        return this.$store.state.tracks.currentTrackId;
      },
      set(id) {
        this.$store.commit('tracks/SET_CURRENT_TRACK_ID', id);
      },
    },
    artistData() {
      if (this.trackData.artist_id) this.$store.dispatch('people/getPersonalDataById', this.trackData.artist_id);
      return this.$store.getters['people/getPersonalDataById'](this.trackData.artist_id) || { profile_data: {} };
    },
  },
  methods: {
    open() {
      this.$router.push(`/${this.artistData.profile_data.username}/${this.currentTrackId}`);
    },
    loadPersonalData() {
      this.$store.dispatch('people/loadProfileData', this.artistData.profile_data.username);
    },
    playNext() {
      const nextTracks = this.trackData.next_id;
      // choosing random next Track
      if (nextTracks) {
        const trackIndex = Math.floor(Math.random() * nextTracks.length);
        this.currentTrackId = nextTracks[trackIndex];
        this.$refs.player.play();
      }
    },
  },
};
</script>

<style scoped>
.audio-bar {
  background: #f0f0f0;
  border-top: 1px solid #cccccc;
  display: grid;
  grid-template-columns: auto 250px 600px auto;
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
.track-detail span, .track-detail a {
  color:#aaaaaa;
}
.track-detail a:hover {
  text-decoration: underline;
}
</style>
