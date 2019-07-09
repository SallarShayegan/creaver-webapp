<template>
  <div class="header">
      <div class="header-content">
        <div class="profile-image"
             :style="`background-image:url('${profileData.data.imageUrl}')`"></div>
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
                @click="$emit('editClicked')">Edit profile</button>
        <button v-else class="outlined" @click="follow">
          Follow{{ (followed) ? 'ed' : '' }}
        </button>
        <div class="abo">
          <div class="follow"
               style="border-right: 1px solid #ffffff"
               @click="$emit('showFollowing')">
                  {{ profileData.following.length }}<br>
                  <span class="small-text">Following</span>
          </div>
          <div class="follow" @click="$emit('showFollowers')">
            {{ profileData.followers.length }}<br>
            <span class="small-text">Followers</span>
          </div>
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
</template>

<script>

export default {
  props: {
    profileData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {

    };
  },
  computed: {
    followed() {
      return this.profileData.followers.filter(id => this.auth.id === id).length !== 0;
    },
    auth() {
      return this.$store.state.people.personalData;
    },
    isOwnProfile() {
      if (this.$store.state.people.personalData.token) {
        return this.$route.params.username === this.auth.data.username;
      }
      return false;
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
}
.abo {
  float: right;
}
.follow {
  display: inline-block;
  color: #f0f0f0;
  text-align: center;
  padding: 0 20px;
  cursor: pointer;
}
.follow:hover {
  color: #ffffff;
}
.info {
  margin-bottom: 20px;
}
</style>
