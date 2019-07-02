<template>
  <div class="header">
      <div class="header-content">
        <div class="profile-image" :style="profileImage">
        </div>
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
    isOwnProfile: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      image: '',
    };
  },
  computed: {
    profileImage() {
      if (!this.profileData.id) {
        return '';
      }
      const src = `http://localhost:3000/images/profiles/${this.profileData.id}.jpg`;
      /*
      this.imageExists(src, function(imageExists) {
        if(imageExists === true) {
          return `background-image:url('${src}')`;
        } else {
          return 'background-image:url("./placeholders/profile.jpg")';
        }
      }); */
      const img = new Image();
      img.src = src;
      if (img.width === 0) {
        return 'background-image:url("./placeholders/profile.jpg")';
      }
      return `background-image:url('${src}')`;
    },
    followed() {
      return this.profileData.followers.filter(id => this.authId === id).length !== 0;
    },
    authId() {
      return this.$store.state.people.personalData.id;
    },
  },
  methods: {
    imageExists(imageUrl, callBack) {
      const imageData = new Image();
      imageData.onload = function () {
        this.image = callBack(true);
        console.log(this.image);
      };
      imageData.onerror = function () {
        this.image = callBack(false);
        console.log(this.image);
      };
      imageData.src = imageUrl;
    },
    follow() {
      if (!this.authId) {
        console.log('First sign in.'); // Error handling
        return;
      }
      if (this.followed) {
        this.$store.dispatch('people/unfollow', {
          follower_id: this.authId,
          following_id: this.profileData.id,
        });
      } else {
        this.$store.dispatch('people/follow', {
          follower_id: this.authId,
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
