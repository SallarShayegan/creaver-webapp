<template>
  <div class="container">
    <profile-header :profileData="profileData" :isOwnProfile="isOwnProfile"/>
    <div class="mainbar">
      <div class="tracks">
        <h3 class="float-left">
          {{ (uploadView)       ? 'Add your track'
           : (edittingTrack.id) ? 'Edit track'
           :                      'Resent tracks'
          }}
        </h3>
        <div class="float-right" style="margin-top:20px" v-if="isOwnProfile">
          <button v-if="uploadView || edittingTrack.id"
                  @click="uploadView = false; edittingTrack.id = ''"
                  style="background: #ff6666; margin-right: 10px;">cancel</button>
          <button v-if="uploadView" @click="upload">Done</button>
          <button v-if="edittingTrack.id" @click="editTrack">Save changes</button>
          <button v-if="!uploadView && !edittingTrack.id"
                  @click="uploadView = true">+ Add track</button>
        </div>
        <div style="clear:both"></div>
        <div v-if="uploadView">
          <track-input @input="newTrack = $event"/>
        </div>
        <div v-if="!uploadView && !edittingTrack.id">
          <div v-for="track in profileData.tracks" :key="track">
            <track-preview :id="track"
                           @editClicked="edittingTrack.id = track"
                           :editable="isOwnProfile"/>
          </div>
          <div v-if="!profileData.tracks || profileData.tracks.length < 1">
            {{ profileData.data.first_name }} hasn't added any tracks yet!
          </div>
        </div>
        <div v-if="edittingTrack.id">
          <track-input @input="edittingTrack.newData = $event"
                       :edittingTrack="edittingTrack.id"
                       @removeClicked="deleteTrack"/>
        </div>
      </div>
    </div>
    <div class="sidebar">
      0 monthly listeners
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TrackPreview from '@/components/tracks/TrackPreview.vue';
import TrackInput from '@/components/tracks/TrackInput.vue';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';

export default {
  components: {
    TrackPreview,
    TrackInput,
    ProfileHeader,
  },
  data() {
    return {
      uploadView: false,
      newTrack: {
        trackData: {
          artist_id: '',
          data: {},
        },
      },
      edittingTrack: { id: '' },
    };
  },
  beforeCreate() {
    this.$store.dispatch('people/loadProfileData', this.$route.params.username);
  },
  computed: {
    ...mapState({ profileData: state => state.people.profileData }),
    isOwnProfile() {
      if (this.$store.state.people.personalData.token) {
        return this.$route.params.username === this.$store.state.people.personalData.data.username;
      }
      return false;
    },
  },
  methods: {
    upload() {
      this.uploadView = false;
      const data = new FormData();
      data.append('track', this.newTrack.trackFile);
      this.newTrack.trackData.artist_id = this.profileData.id;
      data.append('trackData', JSON.stringify(this.newTrack.trackData));
      const image = new FormData();
      image.append('image', this.newTrack.image);
      this.$store.dispatch('tracks/uploadTrack', { data, image });
    },
    editTrack() {
      this.$store.dispatch('tracks/editTrack', this.edittingTrack)
        .then(() => {
          this.edittingTrack = { id: '' };
        });
    },
    deleteTrack() {
      this.$store.dispatch('tracks/deleteTrack', { id: this.edittingTrack.id })
        .then(() => {
          this.edittingTrack = { id: '' };
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../style/variables';

.container {
  display: grid;
  grid-template-columns: auto 30%;
  grid-template-rows: 140px auto;
  min-height: 500px;
  padding: 0;
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
</style>
