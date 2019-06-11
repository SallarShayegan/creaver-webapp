<template>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <div class="profile-image"
             :style="`background-image:url('http://localhost:3000/images/profiles/${profileData.id}.jpg'`">
        </div>
        {{ profileData.data.username }}
      </div>
    </div>
    <div class="mainbar">
      <div class="tracks">
        <h3 class="float-left">
          {{ (uploadView) ? 'Add your track' : 'Resent tracks' }}
        </h3>
        <div class="float-right" style="margin-top:20px" v-if="isOwnProfile">
          <button v-if="uploadView" @click="upload">Done</button>
          <button v-else @click="uploadView = true">+ Add track</button>
        </div>
        <div style="clear:both"></div>
        <div v-if="uploadView">
          <add-track @trackAdded="track = $event"/>
        </div>
        <div v-else>
          <track-preview/>
        </div>
      </div>
    </div>
    <div class="sidebar">
      Monthly Listeners
    </div>
  </div>
</template>

<script>
import TrackPreview from '../components/tracks/TrackPreview.vue';
import AddTrack from '../components/tracks/AddTrack.vue';

export default {
  components: {
    TrackPreview,
    AddTrack,
  },
  data() {
    return {
      uploadView: false,
      track: {},
    };
  },
  mounted() {
    // this.$store.dispatch('loadProfileData', this.$route.params.username);
  },
  computed: {
    profileData() {
      return this.$store.state.profileData;
    },
    isOwnProfile() {
      if (this.$store.state.personalData.token) {
        return this.$route.params.username === this.$store.state.personalData.data.username;
      }
      return false;
    },
  },
  methods: {
    upload() {
      this.uploadView = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../style/variables';

.container {
  display: grid;
  grid-template-columns: auto 30%;
  grid-template-rows: 120px auto;
  min-height: 500px;
  padding: 0;
}
.header {
  background: $primary;
  grid-column-start: 1;
  grid-column-end: 3;
  display: grid;
  grid-template-columns: auto 600px auto;
}
.header-content {
  padding: 20px;
  grid-column-start: 2;
  grid-column-end: 3;
}
.sidebar {
  background: #f4f4f4;
  grid-column-start: 2;
  grid-column-end: 3;
  padding: 30px 40px;
}
.mainbar {
  grid-column-start: 1;
  grid-column-end: 2;
  display: grid;
  grid-template-columns: auto 500px auto;
}
.profile-image {
  float: left;
  margin-right: 20px;
  height: 60px;
  width: 60px;
  background-size: 100%;
  border-radius: 50%;
}
</style>
