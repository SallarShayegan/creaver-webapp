<template>
  <div>
    <h3 style="float:left">{{ profileData.data.name }}'s {{ type }}</h3>
    <div class="float-right" style="margin-top:20px">
      <button @click="$emit('close')"
              class="background-red"
              style="margin-right: 10px;">Close</button>
    </div>
    <div style="clear:both"></div>
    <span v-if="list.length < 1">{{ profileData.data.name }} hasn't got any {{ type }} yet.</span>
    <div v-for="person in list" :key="person">
      <profile-preview :id="person" @click="$emit('close');"/>
    </div>
  </div>
</template>

<script>
import ProfilePreview from '@/components/profile/ProfilePreview.vue';

export default {
  components: {
    ProfilePreview,
  },
  props: {
    profileData: Object,
    type: String,
  },
  computed: {
    list() {
      if (this.type === 'followers') return this.profileData.followers;
      if (this.type === 'following') return this.profileData.following;
      return [];
    },
  },
};
</script>

<style scoped>

</style>
