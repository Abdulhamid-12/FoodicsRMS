<template>
  <transition name="fade">
    <div v-if="snackbar.open" class="snackbar" :style="{ background: snackbar.color }">
      <span>{{ snackbar.message }}</span>
      <button @click="snackbar.open = false">
        <Icon icon="mdi:close" width="20" />
      </button>
    </div>
  </transition>
</template>

<script>
import { Icon } from "@iconify/vue2";
import { useSnackbar } from '@/composables/snackbar';

export default {
  name: "SnackBar",
  data() {
    return {
      snackbar: useSnackbar().snackbar,
    };
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
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
