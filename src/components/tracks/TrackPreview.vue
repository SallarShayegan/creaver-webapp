<template>
  <div class="track-preview" @click="play">
    <div class="thumbnail"
         :style="`background-image:url('${trackData.imageUrl}')`"></div>
    {{ trackData.data.name }}
    <span v-if="editable"
          class="edit-button"
          @click="editClicked = true; $emit('editClicked')">
      <i class="fas fa-pen"></i>
    </span>
    <div class="small-text" style="float:right">
      {{ trackData.plays }} plays | {{ trackData.likes.length }} likes |
      <span id="like" :class="liked ? 'liked' : 'faded'" @click="like">
        <i class="fas fa-heart"></i>
      </span>
    </div>
    <div class="small-text" style="margin-top:10px;">{{ trackData.data.discription }}</div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { setTimeout } from 'timers';

export default {
  props: {
    id: {
      default: '',
      type: String,
    },
    editable: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      editClicked: false,
      likeClicked: false,
    };
  },
  created() {
    this.$store.dispatch('tracks/getTrackById', this.id);
  },
  methods: {
    play() {
      if (!this.editClicked && !this.likeClicked) {
        window.location = `http://localhost:3000/tracks/${this.id}.mp3`;
      }
    },
    like() {
      this.likeClicked = true;
      if (!this.liked) this.$store.dispatch('tracks/like', this.id);
      else this.$store.dispatch('tracks/dislike', this.id);
      setTimeout(() => { this.likeClicked = false; }, 10);
    },
  },
  computed: {
    trackData() {
      return this.$store.getters['tracks/getTrackById'](this.id) || { data: {}, likes: [] };
    },
    liked() {
      return this.trackData.likes.includes(this.auth.id);
    },
    ...mapState({ auth: state => state.auth.auth }),
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

#like {
  cursor: pointer;
}
.faded {
  color: #cccccc;
}
.liked {
  color: $primary;
}
.track-preview {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.track-preview:hover {
  background: #fafafd;
}
.track-preview:hover .edit-button {
  display: initial;
}
.thumbnail {
  background: #f0f0f0;
  background-size: 100%;
  width: 70px;
  height: 70px;
  margin-right: 10px;
  float: left;
}
.edit-button {
  display: none;
  cursor: pointer;
  z-index: 1000;
  font-size: 12px;
  color: #cccccc;
}
</style>
