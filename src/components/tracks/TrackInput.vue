<template>
  <div class="add-track">
    <input type="text"
           v-model="trackData.name"
           placeholder="Track name"
           @change="sendEdittingData"/>
    <input type="text"
           v-model="trackData.discription"
           placeholder="Discription"
           @change="sendEdittingData"/>
    <input type="text"
           v-model="trackData.place"
           placeholder="Creation place"
           @change="sendEdittingData"/>
    <input type="text"
           v-model="trackData.genre"
           placeholder="Genre"
           @change="sendEdittingData"/>
    <div v-if="!edittingTrack">
      Select track: <input type="file" @change="addTrack($event)"/>
    </div>
    Select image: <input type="file" @change="image = $event.target.files[0]"/>
    <div v-if="edittingTrack">
      <button @click="deleteTrack">Remove track</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edittingTrack: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      trackData: {
        name: '',
        discription: '',
        place: '',
        genre: '',
      },
      image: {},
    };
  },
  created() {
    if (this.edittingTrack) {
      this.$store.dispatch('getTrackById', this.edittingTrack)
        .then(() => {
          const trackData = this.$store.getters.getTrackById(this.edittingTrack).data;
          this.trackData.name = trackData.name;
          this.trackData.discription = trackData.discription;
          this.trackData.genre = trackData.genre;
          this.trackData.place = trackData.place;
        });
    }
  },
  methods: {
    sendEdittingData() {
      if (this.edittingTrack) {
        this.$emit('input', this.trackData);
      }
    },
    addTrack(event) {
      this.$emit('input', { trackData: { data: this.trackData }, file: event.target.files[0] });
    },
    deleteTrack() {
      this.$emit('removeClicked');
    },
  },
};
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 10px;
}
</style>
