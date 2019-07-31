<template>
  <div class="add-track">
    <div style="float:left">
      <input type="text"
            v-model="trackData.name"
            placeholder="Track name"
            @change="sendData"/>
      <input type="text"
            v-model="trackData.discription"
            placeholder="Discription"
            @change="sendData"/>
      <input type="text"
            v-model="trackData.place"
            placeholder="Creation place"
            @change="sendData"/>
      <input type="text"
            v-model="trackData.genre"
            placeholder="Genre"
            @change="sendData"/>
      <div v-if="!editingTrack">
        Select track: <input type="file" @change="addTrack($event)"/>
      </div>
    </div>
    <div style="float:right">
      <image-input @imageAdded="addImage($event)"
                   @imageRemoved="removeImage"
                   :currentImage="imageUrl"
                   placeholder="./placeholders/track.jpg"/>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import ImageInput from '@/components/base/image/ImageInput.vue';

export default {
  components: {
    ImageInput,
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
    };
  },
  watch: {
    editingTrack() {
      if (this.editingTrack) {
        this.trackData = JSON.parse(JSON.stringify(this.editingTrack.data));
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
      if (this.editingTrack.hasImage) this.$emit('imageRemoved');
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
