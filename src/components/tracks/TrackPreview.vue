<template>
  <div class="track-preview" @click="play" :class="border">
    <div class="track-image"
         :style="`background-image:url('${trackData.imageUrl}');
                  width:${imageSize};height:${imageSize}`">
    </div>
    {{ trackData.data.name }}
    <span class="small-text" v-if="oneLine">by {{ artistData.profile_data.name }}</span>
    <span v-if="editable"
          class="edit-button"
          @click="editClicked = true; $emit('editClicked')">
      <i class="fas fa-pen"></i>
    </span>
    <div class="small-text faded" style="float:right">
      <span v-if="!noPlays"><i class="fas fa-play"></i> {{ trackData.plays }}</span>
      <span @click="like" v-if="!noLike" style="margin-left:7px">
        <span id="like" :class="liked ? 'liked' : 'faded'">
          <i class="fas fa-heart"></i>
        </span>
        {{ trackData.likes.length }}
      </span>
      <slot></slot>
    </div>
    <div class="small-text" v-if="!oneLine">{{ artistData.profile_data.name }}</div>
    <div class="small-text faded" v-if="!noDescription" style="margin-top:10px;">
      {{ trackData.data.discription }}
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { setTimeout } from 'timers';
import EventBus from '../EventBus';

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
    noDescription: {
      default: false,
      type: Boolean,
    },
    noLike: {
      default: false,
      type: Boolean,
    },
    noPlays: {
      default: false,
      type: Boolean,
    },
    imageSize: {
      default: '70px',
      type: String,
    },
    noBorder: {
      default: false,
      type: Boolean,
    },
    noOwnTracks: {
      default: false,
      type: Boolean,
    },
    oneLine: {
      default: false,
      type: Boolean,
    },
    openOnClick: {
      default: true,
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
  watch: {
    trackData() {
      if (this.trackData.artist_id) this.$store.dispatch('people/getPersonalDataById', this.trackData.artist_id);
    },
  },
  methods: {
    play() {
      this.$emit('click');
      if (!this.editClicked && !this.likeClicked && this.openOnClick) {
        if (this.id !== this.currectTrackId) EventBus.$emit('trackSelected');
        this.$router.push(`${this.artistData.profile_data.username}/${this.id}`);
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
      return this.$store.getters['tracks/getTrackById'](this.id) || { data: {}, likes: [], artist_id: '' };
    },
    liked() {
      return this.trackData.likes.includes(this.auth.id);
    },
    artistData() {
      return this.$store.getters['people/getPersonalDataById'](this.trackData.artist_id) || { profile_data: {} };
    },
    isOwnTrack() {
      return this.trackData.artist_id === this.auth.auth.id;
    },
    border() {
      if (this.noBorder) return 'no-border';
      return '';
    },
    ...mapState({
      auth: state => state.auth.auth,
      currectTrackId: state => state.tracks.currentTrackId,
    }),
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

#like {
  cursor: pointer;
}
.liked {
  color: $primary;
}
.track-preview {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.no-border {
  border: 0;
}
.track-preview:hover {
  background: #fafafd;
}
.track-preview:hover .edit-button {
  display: initial;
}
.track-image {
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
