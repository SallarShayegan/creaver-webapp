<template>
  <div class="container">
    <div class="before-header"></div>
    <profile-header :profileData="profileData"
                    @editClicked="editProfile"
                    @showFollowing="followView = true; followType = 'following'"
                    @showFollowers="followView = true; followType = 'followers'"/>
    <div class="after-header"></div>
    <div class="before-body"></div>
    <div class="profile-body">
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
    <div class="after-body"></div>
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
  destroyed() {
    this.$store.commit('people/RESET_PROFILE_DATA');
  },
  computed: {
    ...mapState({ profileData: state => state.people.profileData }),
    isOwnProfile() {
      if (this.$store.state.people.personalData.token) {
        return this.$route.params.username === this.authUsername;
      }
      return false;
    },
    authUsername() {
      return this.$store.state.people.personalData.data.userName;
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
  grid-template-columns: auto 1200px auto;
  grid-template-rows: 140px auto;
  min-height: 500px;
  padding: 0;
}

.profile-body {
  display: grid;
  grid-template-columns: auto 20px auto;
  // grid-gap: 20px;
}

.sidebar {
  background: #f4f4f4;
  grid-column: 3;
  padding: 30px 40px;
}

.mainbar {
  grid-column: 1;
  padding: 10px;
  min-width: 600px;
}

.before-header {
  grid-column: 1;
  background: $primary;
}

.after-header {
  grid-column: 3;
  background: $primary;
}

.before-body {
  grid-column: 1;
}

.after-body {
  grid-column: 3;
  background: #f4f4f4;
}

@media screen and (max-width: 800px) {
  .container {
    grid-template-columns: auto 750px auto;
  }

  .mainbar {
    min-width: 450px;
  }

  .sidebar {
    grid-column: 1;
    grid-row: 3;
  }
}

@media screen and (max-width: 450px) {
  .container {
    grid-template-columns: auto 450px auto;
  }

  .mainbar {
    min-width: 300px;
  }
}
</style>
