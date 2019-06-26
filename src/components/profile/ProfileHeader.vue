<template>
  <div class="header">
      <div class="header-content">
        <div class="profile-image" :style="profileImage">
        </div>
        <div class="info">{{ profileData.data.name }}</div>
        <button v-if="isOwnProfile"
                class="outlined"
                @click="editProfile">Edit profile</button>
        <button v-else class="outlined" @click="follow">Follow</button>
        <div class="abo">
          <div class="follow"
               style="border-right: 1px solid #ffffff"
               @click="showFollowing">
                  {{ profileData.following.length }}<br>
                  <span class="small-text">Following</span>
          </div>
          <div class="follow" @click="showFollowers">
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
    isOwnProfile: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    profileImage() {
      const image = new Image();
      image.src = `http://localhost:3000/images/profiles/${this.profileData.id}.jpg`;
      if (image.width === 0) {
        return 'background-image:url("./placeholders/profile.jpg")';
      }
      return `background-image:url('${image.src}')`;
    },
  },
  methods: {
    follow() {
      this.$store.dispatch('follow', {
        follower_id: this.$store.state.personalData.id,
        following_id: this.profileData.id,
      });
    },
    showFollowers() {

    },
    showFollowing() {

    },
    editProfile() {

    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

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
.profile-image {
  float: left;
  margin-right: 20px;
  height: 100px;
  width: 100px;
  background-size: 100%;
  border-radius: 50%;
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
