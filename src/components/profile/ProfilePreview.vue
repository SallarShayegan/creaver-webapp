<template>
  <div class="profile-preview" @click="showProfile">
    <div class="profile-image"
         :style="`background-image:url('${profileData.imageUrl}')`"></div>
    {{ profileData.profile_data.name }}
    <div class="abo" v-if="auth.id !== profileData.id">
      <button @click="follow" @blur="followClicked = false">
        Follow{{ (followed) ? 'ed' : '' }}
      </button>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    profile: Object,
  },
  data() {
    return {
      followClicked: false,
    };
  },
  created() {
    if (this.id) this.$store.dispatch('people/getPersonalDataById', this.id);
  },
  methods: {
    follow() {
      this.followClicked = true;
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
    showProfile() {
      const { username } = this.profileData.profile_data;
      if (!this.followClicked) {
        this.$store.dispatch('people/loadProfileData', username)
          .then(() => {
            this.$router.push(`/${username}`);
            this.$emit('click');
          });
      }
    },
  },
  computed: {
    profileData() {
      if (this.profile) return this.profile;
      return this.$store.getters['people/getPersonalDataById'](this.id) || { profile_data: {} };
    },
    followed() {
      if (this.auth.following) return this.auth.following.includes(this.profileData.id);
      return false;
    },
    auth() {
      return this.$store.state.auth.auth;
    },
  },
};
</script>

<style scoped>
.profile-preview {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.profile-preview:hover {
  background: #fafafd;
}
.profile-image {
  height: 60px;
  width: 60px;
}
.abo {
  float: right;
  padding: 15px 0;
}
</style>
