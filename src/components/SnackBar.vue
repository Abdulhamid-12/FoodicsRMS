<template>
  <transition name="fade">
    <div v-if="visible" class="snackbar" :class="snackbarColor">
      <span>{{ message }}</span>
      <button @click="closeSnackbar" class="snackbar-close">
        <Icon icon="mdi:close" width="20" />
      </button>
    </div>
  </transition>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "SnackBar",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "default",
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      visible: this.value,
    };
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.startTimeout();
      }
    },
  },
  computed: {
    snackbarColor() {
      return `snackbar--${this.color}`;
    },
  },
  methods: {
    startTimeout() {
      setTimeout(() => {
        this.closeSnackbar();
      }, this.timeout);
    },
    closeSnackbar() {
      this.visible = false;
      this.$emit("input", false);
    },
  },
  components: {
    Icon,
  },
};
</script>

<style scoped>
.snackbar {
  @apply fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg flex items-center justify-between;
  min-width: 300px;
  max-width: 500px;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.snackbar--default {
  background-color: #323232;
  color: white;
}

.snackbar--success {
  background-color: #4caf50;
  color: white;
}

.snackbar--error {
  background-color: #f44336;
  color: white;
}

.snackbar--warning {
  background-color: #ff9800;
  color: white;
}

.snackbar--info {
  background-color: #2196f3;
  color: white;
}

.snackbar-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
