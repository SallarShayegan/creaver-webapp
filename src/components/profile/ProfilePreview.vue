<template>
  <div class="profile-preview" @click="emitClick">
    <div class="profile-image" :style="profileImage"></div>
    {{ personsData.data.name }}
    <div class="abo" v-if="authId !== personsData.id">
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
  },
  data() {
    return {
      followClicked: false,
    };
  },
  created() {
    this.$store.dispatch('people/getPersonalDataById', this.id);
  },
  methods: {
    follow() {
      this.followClicked = true;
      if (!this.authId) {
        console.log('First sign in.'); // Error handling
        return;
      }
      if (this.followed) {
        this.$store.dispatch('people/unfollow', {
          follower_id: this.authId,
          following_id: this.personsData.id,
        });
      } else {
        this.$store.dispatch('people/follow', {
          follower_id: this.authId,
          following_id: this.personsData.id,
        });
      }
    },
    emitClick() {
      if (!this.followClicked) this.$emit('click', this.personsData.data.username)
    }
  },
  computed: {
    personsData() {
      return this.$store.getters['people/getPersonalDataById'](this.id) || { data: {} };
    },
    followed() {
      return this.personsData.followers.filter(id => this.authId === id).length !== 0;
    },
    authId() {
      return this.$store.state.people.personalData.id;
    },
    profileImage() {
      if (!this.id) {
        return '';
      }
      const src = `http://localhost:3000/images/profiles/${this.id}.jpg`;
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
    }
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
