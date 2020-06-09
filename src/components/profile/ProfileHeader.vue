<template>
  <div class="header">
      <div class="header-content">
        <div class="profile-image"
             :style="`background-image:url('${profileData.imageUrl}')`"
             @click="showAvatar = true"></div>
        <modal :title="`${profileData.data.name}'s picture`"
               :visible="showAvatar"
               :formHeight="420"
               :formWidth="420"
               @close="showAvatar = false">
          <div class="profile-image-big"
             :style="`background-image:url('${profileData.imageUrl}')`"></div>
        </modal>
        <div class="info">
          <span style="color:#ffffff">{{ profileData.data.name }}</span>
          <span class="small-text" style="margin-left:20px;">
            {{ (profileData.data.city || '')
            + (profileData.data.city ? ', ' : '')
            + (profileData.data.country || '') }}
          </span>
        </div>
        <button v-if="isOwnProfile"
                class="outlined"
                @click="$emit('editClicked'); activeTab=''">Edit profile</button>
        <button v-else class="outlined" @click="follow">
          Follow{{ (followed) ? 'ed' : '' }}
        </button>
        <div class="abo2">
          <div class="tab" :style="tabStyle.tracks" @click="activeTab = 'Tracks'">Tracks</div>
          <div class="tab" :style="tabStyle.likes" @click="activeTab = 'Likes'">Likes</div>
          <div class="tab"
               :style="tabStyle.following"
               @click="activeTab = 'Following'">Following</div>
          <div class="tab"
               :style="tabStyle.followers + ';border-right:0'"
               @click="activeTab = 'Followers'">Followers</div>
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
</template>

<script>
import Modal from '@/components/base/Modal.vue';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      tabStyle: { tracks: 'color:white;font-weight:bold' },
      activeTab: 'Tracks',
      showAvatar: false,
    };
  },
  props: {
    profileData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    followed() {
      return this.profileData.followers.filter(id => this.auth.id === id).length !== 0;
    },
    auth() {
      return this.$store.state.auth.auth;
    },
    isOwnProfile() {
      if (this.auth.token) {
        return this.$store.state.people.profileData.id === this.auth.id;
      }
      return false;
    },
  },
  watch: {
    activeTab(val) {
      const style = 'color:white;font-weight:bold';
      switch (val) {
        case 'Tracks':
          this.tabStyle = { tracks: style };
          break;
        case 'Likes':
          this.tabStyle = { likes: style };
          break;
        case 'Following':
          this.tabStyle = { following: style };
          break;
        case 'Followers':
          this.tabStyle = { followers: style };
          break;
        default: this.tabStyle = {};
      }
      this.$emit(`show${val}`);
    },
  },
  methods: {
    follow() {
      if (this.followed) {
        this.$store.dispatch('people/unfollow', {
          follower_id: this.auth.id,
          following_id: this.profileData.id,
        });
      } else {
        this.$store.dispatch('people/follow', {
          follower_id: this.auth.id,
          following_id: this.profileData.id,
        });
      }
      this.$store.dispatch('people/loadProfileData', this.profileData.data.username);
    },
    activateTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.header {
  background: $primary;
  grid-column: 2;
}
.header-content {
  padding: 20px;
}
.profile-image {
  box-shadow: 0px 0px 10px white;
  cursor: pointer;
}
.profile-image-big {
  width: 400px;
  height: 400px;
  background-repeat: no-repeat;
  display: inline-block;
  background-position: center;
}
.abo {
  float: right;
}
.abo2 {
  position: relative;
  top: 15px;
  left: 200px;
}
.tab {
  display: inline-block;
  color: #f0f0f0;
  text-align: center;
  padding: 0 20px;
  cursor: pointer;
  border-right: 1px solid #ffffff;
}
.follow:hover {
  color: #ffffff;
}
.info {
  margin-bottom: 20px;
}
</style>
