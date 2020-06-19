<template>
  <div class="add-track">
    <div style="float:left">
      <textbox
            v-model="trackData.name"
            placeholder="Track name"
            @change="sendData"
            validation="not-empty"/>
      <textbox
            v-model="trackData.discription"
            placeholder="Discription"
            @change="sendData"/>
      <textbox
            v-model="trackData.place"
            placeholder="Creation place"
            @change="sendData"/>
      <textbox
            v-model="trackData.genre"
            placeholder="Genre"
            @change="sendData"/>
      <div v-if="!editingTrack" style="margin-top:20px">
        Select track: <input type="file" @change="addTrack($event)"/>
      </div>
      <track-next :currentNext="nextTracks"
                  style="margin-top:30px"
                  :id="editingId"
                  @tracksAdded="nextTracks = $event; sendData" />
    </div>
    <div style="float:right">
      <image-input @imageAdded="addImage($event)"
                   @imageRemoved="removeImage"
                   :currentImage="imageUrl"
                   placeholder="./placeholders/track.png"/>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import ImageInput from '@/components/base/image/ImageInput.vue';
import Textbox from '@/components/base/Textbox.vue';
import TrackNext from './TrackNext.vue';

export default {
  components: {
    ImageInput,
    Textbox,
    TrackNext,
  },
  props: {
    editingTrack: {
      type: Object,
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
      image: null,
      imageUrl: '',
      trackFile: {},
      nextTracks: [],
    };
  },
  watch: {
    editingTrack() {
      if (this.editingTrack) {
        this.trackData = JSON.parse(JSON.stringify(this.editingTrack.data));
        this.nextTracks = this.editingTrack.next_id || [];
        this.imageUrl = this.editingTrack.imageUrl;
      }
    },
  },
  methods: {
    sendData() {
      // [Validation]
      const result = {
        trackData: this.trackData,
        image: this.image,
        nextTracks: this.nextTracks,
      };
      if (!this.editingTrack) result.trackFile = this.trackFile;
      this.$emit('input', result);
    },
    addTrack(event) {
      [this.trackFile] = event.target.files;
      this.sendData();
    },
    addImage(image) {
      this.image = image;
      this.sendData();
    },
    removeImage() {
      if (this.editingTrack && this.editingTrack.hasImage) this.$emit('imageRemoved');
    },
  },
  computed: {
    editingId() {
      if (this.editingTrack) return this.editingTrack.id;
      return null;
    },
  },
};
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 10px;
  min-width: 200px;
}
</style>
