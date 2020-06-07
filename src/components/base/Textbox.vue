<template>
  <div class="textbox-container">
    <div :class="`${color} info small-text`"
         :style="opacity"
         v-if="!disableInfo">
      {{ placeholder }}
    </div>
    <input :type="type"
           :value="value"
           :placeholder="placeholder"
           ref="input"
           :class="borderColor"
           :maxlength="max"
           @input="updateValue"
           @change="$emit('change')"
           @blur="blur()"/>
    <div class="error color-red">
      {{ errors[0] }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    type: {
      type: String,
      default: 'text',
    },
    placeholder: String,
    validation: String,
    max: {
      type: Number,
      default: 30,
    },
    disableInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      blured: false,
    };
  },
  methods: {
    updateValue() {
      this.blured = false;
      this.$emit('input', this.$refs.input.value.trim());
    },
    blur() {
      this.$emit('blur');
      this.blured = true;
    },
  },
  computed: {
    color() {
      if (this.errors.length >= 1) return 'color-red';
      return 'color-primary';
    },
    borderColor() {
      if (this.errors.length >= 1) return 'border-red';
      return 'border-primary';
    },
    requirements() {
      if (this.validation) return this.validation.split(' ');
      return [];
    },
    opacity() {
      if (!this.value) return 'opacity: 0';
      return 'opacity: 1';
    },
    errors() {
      const errors = [];
      if (!this.blured) return errors;
      if (this.requirements.includes('not-empty') && !this.value) errors.push(`${this.placeholder} should not be empty`);
      if (this.requirements.includes('email') && !this.value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        errors.push('invalid email address');
      }
      if (this.requirements.includes('name') && !this.value.match(/^[a-zA-Z\s]*$/)) {
        errors.push(`${this.placeholder} can only contain white space and letters`);
      }
      if (this.requirements.includes('username') && !this.value.match(/^[a-zA-Z0-9]+(\.{1}[a-zA-Z0-9]+)*$/)) {
        errors.push(`${this.placeholder} can only contain letters, digits and dots`);
      }
      if (this.requirements.includes('phone') && !this.value.match(/\+{0,1}[0-9]+(\s{1}[0-9]+)*$/)) {
        errors.push(`${this.placeholder} can only contain digits, white space and +`);
      }
      if (this.requirements.includes('bio') && !this.value.match()) {
        errors.push(`${this.placeholder} `);
      }
      if (errors.length >= 1) this.$emit('error', errors);
      return errors;
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables.scss';

.textbox-container {
  margin-top: 7px;
  min-width: 200px;
}
input {
  width: 100%;
}

.border-primary {
  border-color: $primary;
}

.border-red {
  border-color: $red;
}

.error {
  font-size: 9px;
  height: 5px;
}
.info {
  transition: opacity 0.2s;
}
</style>
