<template>
  <div class="container">
    <profile-header :profileData="profileData"
                    :isOwnProfile="isOwnProfile"
                    @editClicked="editProfile"
                    @showFollowing="followView = true; followType = 'following'"
                    @showFollowers="followView = true; followType = 'followers'"/>
    <div class="mainbar">
      <div class="tracks" v-if="tracksView">
        <h3 class="float-left">Resent tracks</h3>
        <div class="float-right" style="margin-top:20px" v-if="isOwnProfile">
          <button @click="uploadView = true">+ Add track</button>
        </div>
        <div style="clear:both"></div>
        <div>
          <div v-for="track in profileData.tracks" :key="track">
            <track-preview :id="track"
                           @editClicked="editingTrack = track"
                           :editable="isOwnProfile"/>
          </div>
          <div v-if="!profileData.tracks || profileData.tracks.length < 1">
            {{ profileData.data.name }} hasn't added any tracks yet!
          </div>
        </div>
      </div>
      <upload-track v-if="uploadView"
                    :artistId="profileData.id"
                    @close="uploadView = false"/>
      <edit-track v-if="editingTrack"
                  :id="editingTrack"
                  @close="editingTrack = ''"/>
      <edit-profile v-if="editProfileView" @close="editProfileView = false"/>
      <people v-if="followView"
              :type="followType"
              :profileData="profileData"
              @close="followView = false"/>
    </div>
    <div class="sidebar">
      0 monthly listeners
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TrackPreview from '@/components/tracks/TrackPreview.vue';
import UploadTrack from '@/components/profile/UploadTrack.vue';
import EditTrack from '@/components/profile/EditTrack.vue';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import EditProfile from '@/components/profile/EditProfile.vue';
import People from '@/components/profile/People.vue';

export default {
  components: {
    TrackPreview,
    UploadTrack,
    EditTrack,
    ProfileHeader,
    EditProfile,
    People,
  },
  data() {
    return {
      uploadView: false,
      editingTrack: '',
      editProfileView: false,
      followView: false,
      followType: '',
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
    tracksView() {
      return !this.uploadView
             && !this.editingTrack
             && !this.editProfileView
             && !this.followView;
    },
  },
  methods: {
    editProfile() {
      this.editProfileView = true;
      this.uploadView = false;
      this.editingTrack = '';
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
