<template>
  <div>
    Next tracks:
    <track-preview v-for="track in nextTracks"
                   :key="track"
                   :id="track"
                   noDescription
                   imageSize="25px"
                   noLike
                   noPlays
                   oneLine
                   :openOnClick="false">
      <span class="remove" @click="remove(track)">
        <i class="fas fa-times"></i>
      </span>
    </track-preview>
    <button @click="showModal = true">Add</button>
    <div v-if="remainingNum > 0" class="small-text">
      Please pick at least {{ remainingNum }} tracks.
    </div>
    <modal title="Pick next tracks"
           :visible="showModal"
           :formWidth="400"
           @close="showModal = false">
      <div class="modal-container">
        <span>Recent likes
          <span class="faded" v-if="selected.length > 0">({{ selected.length }} selected)</span>
        </span>
        <track-preview v-for="like in likes"
                       :key="like"
                       :id="like"
                       noDescription
                       imageSize="25px"
                       noLike
                       noPlays
                       noOwnTracks
                       oneLine
                       @click="selectLike(like)"
                       :openOnClick="false">
          <span class="check" v-if="isSelected(like)">
            <i class="fas fa-check"></i>
          </span>
        </track-preview>
        <div v-if="likes.length == 0" class="faded small-text">
          no tracks avaliable
        </div>
        <div style="float:right;margin-top:40px">
          <button @click="addSelectedTracks">Add</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/base/Modal.vue';
import TrackPreview from './TrackPreview.vue';

export default {
  components: {
    TrackPreview,
    Modal,
  },
  data() {
    return {
      showModal: false,
      selected: [],
      nextTracks: [],
    };
  },
  props: {
    id: {
      type: String,
    },
    currentNext: {
      type: Array,
      required: true,
    },
  },
  computed: {
    remainingNum() {
      return 3 - this.nextTracks.length;
    },
    likes() {
      return this.$store.state.auth.auth.likes
        .filter(like => this.nextTracks.indexOf(like) === -1
          && like !== this.id) || [];
    },
  },
  methods: {
    isSelected(id) {
      return this.selected.indexOf(id) !== -1;
    },
    selectLike(id) {
      const list = this.selected;
      if (this.isSelected(id)) {
        list.splice(list.indexOf(id), 1);
      } else {
        list.push(id);
      }
    },
    addSelectedTracks() {
      this.nextTracks = this.nextTracks.concat(this.selected);
      this.selected = [];
      this.showModal = false;
      this.$emit('tracksAdded', this.nextTracks);
    },
    remove(id) {
      this.nextTracks.splice(this.nextTracks.indexOf(id), 1);
      this.$emit('tracksAdded', this.nextTracks);
    },
  },
  watch: {
    currentNext(list) {
      this.nextTracks = list;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.modal-container {
  padding: 10px;
}
.check {
  color: $primary;
}
.remove {
  margin-left: 50px;
  font-size: 15px;
}
.remove:hover {
  color: $red;
}
</style>
