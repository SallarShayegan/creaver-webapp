<template>
  <div>
    <h1>Sign up</h1>
    <div class="signup-container">
      <div class="column-100">
        <!-- stays invisible removed after closing //-->
        <alert v-for="error in errors" :key="error.index" :message="error.message"/>
      </div>
      <input class="column" type="text" v-model="firstName" placeholder="First name"/>
      <input class="column" type="text" v-model="lastName" placeholder="Last name"/>
      <input class="column-100"
             type="text"
             v-model="email"
             placeholder="Email address"
             @input="deleteError('email')"/>
      <input class="column-100"
             type="text"
             v-model="email2"
             placeholder="Email address (repeat)"
             @input="deleteError('email')"/>
      <input class="column"
             type="password"
             v-model="password"
             placeholder="Password"
             @input="deleteError('password')"/>
      <input class="column"
             type="password"
             v-model="password2"
             placeholder="Password (repeat)"
             @input="deleteError('password')"/>
      <div class="column-100"><button @click="sendData">Sign up</button></div>
    </div>
  </div>
</template>

<script>
import Alert from '../components/base/Alert.vue';

export default {
  components: {
    Alert,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      email2: '',
      password: '',
      password2: '',
      errors: [],
    };
  },
  methods: {
    sendData() {
      if (this.email !== this.email2 && !this.errors.find(e => e.name === 'email')) {
        this.errors.push({ name: 'email', message: 'Email addresses don\'t match.' });
      }
      if (this.password !== this.password2 && !this.errors.find(e => e.name === 'password')) {
        this.errors.push({ name: 'password', message: 'Passwords don\'t match.' });
      }
      if (this.errors.length === 0) {
        const data = {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          password: this.password,
        };
        this.$store.dispatch('addNewPerson', data)
          .then(() => {})
          .catch(err => this.errors.push({ message: err }));
      }
    },
    deleteError(errName) {
      this.errors.forEach((err, index) => {
        if (err.name === errName) this.errors.splice(index, 1);
      });
    },
  },
};
</script>

<style scoped>
.signup-container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}
.column-100 {
  grid-column-start: 1;
  grid-column-end: 3;
}
</style>
