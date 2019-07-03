<template>
  <div>
    <h3 style="float:left">{{ profileData.data.name }}'s {{ type }}</h3>
    <div class="float-right" style="margin-top:20px">
      <button @click="$emit('close')"
              class="background-red"
              style="margin-right: 10px;">close</button>
    </div>
    <div style="clear:both"></div>
    <div v-for="person in list" :key="person">
      <profile-preview :id="person" @click="showProfile($event)"/>
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
  methods: {
    showProfile(username) {
      this.$emit('close');
      this.$store.dispatch('people/loadProfileData', username)
        .then(() => this.$router.push(`/${username}`));
    },
  },
};
</script>

<style scoped>

</style>
