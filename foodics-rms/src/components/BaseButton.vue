<template>
  <button :class="['base-button', buttonColor]" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    color: {
      type: String,
      default: 'default'
    },
  },
  computed: {
    buttonColor() {
      return `base-button--${this.color}`;
    }
  }
}
</script>

<style scoped>
.base-button {
  @apply py-1 px-4 rounded border;
}

.base-button--default {
  background-color: white;
  color: black;
}

.base-button--primary {
  background-color: #5f27cd;
  color: white;
}

.base-button--secondary {
  background-color: gray;
  color: white;
}
</style>
