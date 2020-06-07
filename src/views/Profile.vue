<template>
  <div class="container">
    <div class="before-header"></div>
    <profile-header :profileData="profileData"
                    ref="header"
                    @editClicked="viewPort = 'editProfile';"
                    @showTracks="viewPort = 'tracks'"
                    @showLikes="viewPort = 'likes'"
                    @showFollowing="viewPort = 'connection'; followType = 'following'"
                    @showFollowers="viewPort = 'connection'; followType = 'followers'"
    />
    <div class="after-header"></div>
    <div class="before-body"></div>
    <div class="profile-body">
      <div class="mainbar">
        <div class="tracks" v-if="viewPort === 'tracks'">
          <h3 class="float-left">Resent tracks</h3>
          <div class="float-right" style="margin-top:20px" v-if="isOwnProfile">
            <button @click="viewPort = 'upload'">+ Add track</button>
          </div>
          <div style="clear:both"></div>
          <div>
            <div v-for="track in profileData.tracks" :key="track">
              <track-preview :id="track"
                            @editClicked="viewPort = 'editTrack'; editingTrack = track"
                            :editable="isOwnProfile"/>
            </div>
            <div v-if="!profileData.tracks || profileData.tracks.length < 1">
              {{ profileData.data.name }} hasn't added any tracks yet!
            </div>
          </div>
        </div>
        <profile-likes v-if="viewPort === 'likes'"/>
        <track-upload v-if="viewPort === 'upload'"
                      @close="viewPort = 'tracks'"/>
        <track-settings v-if="viewPort === 'editTrack'"
                    :id="editingTrack"
                    @close="viewPort = 'tracks'"/>
        <profile-edit v-if="viewPort === 'editProfile'"
                      @close="viewPort = 'tracks'; $refs.header.activateTab('Tracks')"/>
        <profile-connection v-if="viewPort === 'connection'"
                            :type="followType"
                            :profileData="profileData"
                            @close="viewPort = 'tracks'; $refs.header.activateTab('Tracks')"/>
      </div>

      <div class="sidebar">
        <div class="bio">{{ profileData.data.bio }}</div>
        <h3>Recent likes</h3>
        <track-preview v-for="track in recentLikes"
                       :key="track"
                       :id="track"
                       noDescription
                       noLike
                       imageSize="50px"/>
        <span v-if="recentLikes.length < 1">
          {{ profileData.data.name }} hasn't liked any tracks yet.
        </span>
      </div>

    </div>
    <div class="after-body"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TrackPreview from '@/components/tracks/TrackPreview.vue';
import TrackUpload from '@/components/tracks/TrackUpload.vue';
import TrackSettings from '@/components/tracks/TrackSettings.vue';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import ProfileEdit from '@/components/profile/ProfileEdit.vue';
import ProfileConnection from '@/components/profile/ProfileConnection.vue';
import ProfileLikes from '@/components/profile/ProfileLikes.vue';

export default {
  components: {
    TrackPreview,
    TrackUpload,
    TrackSettings,
    ProfileHeader,
    ProfileEdit,
    ProfileConnection,
    ProfileLikes,
  },
  data() {
    return {
      viewPort: 'tracks',
      editingTrack: '',
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
    ...mapState({ auth: state => state.auth.auth }),
    isOwnProfile() {
      if (this.auth.token) {
        return this.$store.state.people.profileData.id === this.auth.id;
      }
      return false;
    },
    profileData() {
      if (this.isOwnProfile) return this.auth;
      return this.$store.state.people.profileData;
    },
    recentLikes() {
      const { likes } = this.profileData;
      if (!likes) return [];
      return likes.slice(-4, likes.length).reverse();
    },
    username() {
      return this.$route.params.username;
    },
  },
  watch: {
    profileData() {
      this.viewPort = 'tracks';
      this.$refs.header.activateTab('Tracks');
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
  grid-template-columns: 350px 20px auto;
}

.sidebar {
  background: #f4f4f4;
  grid-column: 1;
  grid-row: 1;
  padding: 30px 60px 30px 0;
}

.bio {
  margin-bottom: 40px;
}

.mainbar {
  grid-column: 3;
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
  background: #f4f4f4;
  grid-column: 1;
}

.after-body {
  grid-column: 3;
}

@media screen and (max-width: 800px) {
  .container {
    grid-template-columns: auto 750px auto;
  }

  .profile-body {
    grid-template-columns: 100%;
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
