<template>
  <div class="edit-profile">
    <h3>Edit profile</h3>
    <div style="float:left">
      <input
            type="text"
            v-model="editingData.data.username"
            placeholder="Username"/>
      <input
            type="text"
            v-model="editingData.data.name"
            placeholder="Name"/>
      <input
            type="text"
            v-model="editingData.data.email"
            placeholder="Email address"/>
      <input
            type="text"
            v-model="editingData.data.phone"
            placeholder="Phone number"/>
      <input
            type="date"
            v-model="editingData.data.birth_date"
            placeholder="Date of birth"/>
      <input
            type="text"
            v-model="editingData.data.city"
            placeholder="City"/>
      <input
            type="text"
            v-model="editingData.data.country"
            placeholder="Country"/>
      <div class="column-100" style="float:right;margin-top:20px">
        <button @click="$emit('close')"
                class="background-red"
                style="margin-right: 10px;">Cancel</button>
        <button @click="saveChanges" class="margin-top">Save changes</button>
      </div>
      <div style="clear:right"></div>
    </div>
    <div style="float:right">
      <image-input @imageAdded="profileImage = $event"
                   :currentImage="editingData.profileImage"
                   placeholder="./placeholders/profile.jpg"/>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import ImageInput from '@/components/base/ImageInput.vue';

export default {
  components: {
    ImageInput,
  },
  data() {
    return {
      editingData: {},
      profileImage: null,
    };
  },
  methods: {
    saveChanges() {
      if (this.profileImage) this.editingData.data.hasImage = true;
      this.$store.dispatch('people/changePersonalData', this.editingData);
      if (this.profileImage) {
        this.$store.dispatch('people/changeProfileImage', {
          id: this.editingData.id,
          profileImage: this.profileImage,
        });
      }
      this.$emit('close');
    },
    removeImage() {
      this.$store.dispatch('people/removeImage', { id: this.editingData.id });
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
input {
  display: block;
  margin-top:10px;
  min-width: 200px;
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
