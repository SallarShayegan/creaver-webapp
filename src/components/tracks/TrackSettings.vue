<template>
  <div>
    <h3>Edit track</h3>
    <track-input @input="editedData = $event"
                 :editingTrack="currentData"
                 @removeClicked="deleteTrack"
                 @imageRemoved="deleteImage = true"/>
    <div style="margin-top:20px">
      <div class="float-left">
        <button @click="deleteTrack" class="background-red">Remove track</button>
      </div>
      <div class="float-right">
        <button @click="$emit('close')"
                class="background-red"
                style="margin-right: 10px;">Cancel</button>
        <button @click="editTrack">Save changes</button>
      </div>
      <div style="clear:both"></div>
    </div>
  </div>
</template>

<script>
import TrackInput from '@/components/tracks/TrackInput.vue';

export default {
  components: {
    TrackInput,
  },
  props: {
    id: String,
  },
  data() {
    return {
      editedData: {},
      currentData: {},
      deleteImage: false,
    };
  },
  created() {
    if (this.id) {
      this.$store.dispatch('tracks/getTrackById', this.id)
        .then(() => {
          this.currentData = this.$store.getters['tracks/getTrackById'](this.id);
          this.editedData.trackData = this.currentData.data;
        });
    }
  },
  methods: {
    editTrack() {
      this.$store.dispatch('tracks/editTrack', {
        id: this.id,
        newData: this.editedData.trackData,
        image: this.editedData.image,
        deleteImage: this.deleteImage,
      })
        .then(() => this.$emit('close'));
    },
    deleteTrack() {
      this.$store.dispatch('tracks/deleteTrack', { id: this.id })
        .then(() => this.$emit('close'));
    },
  },
};
</script>

<style>

</style>
