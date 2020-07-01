<template>
  <div class="edit-profile">
    <h3>Edit profile</h3>
    <div style="float:left">
      <textbox
            v-model="editingData.profile_data.username"
            placeholder="Username"
            validation="not-empty username"
            :max="30"
            @input="error = false"
            @error="error = true"/>
      <textbox
            v-model="editingData.profile_data.bio"
            placeholder="Bio"
            validation="bio"
            :max="300"
            @input="error = false"
            @error="error = true"/>
      <textbox
            v-model="editingData.profile_data.name"
            placeholder="Name"
            validation="not-empty"
            :max="50"
            @input="error = false"
            @error="error = true"/>
      <textbox
            v-model="editingData.profile_data.email"
            placeholder="Email address"
            validation="not-empty email"
            :max="100"
            @input="error = false"
            @error="error = true"/>
      <textbox
            v-model="editingData.profile_data.phone"
            placeholder="Phone number"
            validation="phone"
            :max="20"
            @input="error = false"
            @error="error = true"/>
      <textbox
            type="date"
            v-model="editingData.profile_data.birth_date"
            placeholder="Date of birth"
            @input="error = false"
            @error="error = true"/>
      <textbox
            v-model="editingData.profile_data.city"
            placeholder="City"
            validation="name"
            @input="error = false"
            @error="error = true"/>
      <textbox
            v-model="editingData.profile_data.country"
            placeholder="Country"
            validation="name"
            @input="error = false"
            @error="error = true"/>
      <div class="column-100" style="float:right;margin-top:20px">
        <button @click="$emit('close')"
                class="background-red"
                style="margin-right: 10px;">Cancel</button>
        <button @click="saveChanges"
                class="margin-top">Save changes</button>
      </div>
      <div style="clear:right"></div>
    </div>
    <div style="float:right">
      <image-input @imageAdded="profileImage = $event"
                   @imageRemoved="removeImage"
                   :currentImage="editingData.imageUrl"
                   placeholder="./placeholders/profile.jpg"/>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import ImageInput from '@/components/base/image/ImageInput.vue';
import Textbox from '@/components/base/Textbox.vue';

export default {
  components: {
    ImageInput,
    Textbox,
  },
  data() {
    return {
      editingData: {},
      profileImage: null,
      deleteImage: false,
      error: false,
    };
  },
  methods: {
    saveChanges() {
      if (this.error) return this.$store.dispatch('sendNote', { message: 'Please correct marked fields.' });

      this.$store.dispatch('people/changePersonalData', {
        id: this.editingData.id,
        profile_data: this.editingData.profile_data,
        image: this.profileImage,
        deleteImage: this.deleteImage,
      });
      return this.$emit('close');
    },
    removeImage() {
      if (this.editingData.hasImage) this.deleteImage = true;
    },
  },
  created() {
    this.editingData = JSON.parse(JSON.stringify(this.$store.state.auth.auth));
  },
};
</script>

<style scoped>
.edit-profile {
  margin-bottom: 20px;
}
.margin-top {
  margin-top: 15px;
}
#canvas {
  display: none;
}
#border {
  border: 1px dotted #ffffff;
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;
  display: none;
}
#border:after {
  cursor: pointer;
}
#border:before {
  cursor: pointer;
}
</style>
