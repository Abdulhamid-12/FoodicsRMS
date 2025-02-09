<template>
  <div class="progress-linear">
    <div :class="['progress-linear-bar', { 'is-moving': value }]" :style="getColor"></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressLinear',
  props: {
    color: {
      type: String,
      default: 'var(--primary-color)'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getColor() {
      return {
        backgroundColor: this.value ? this.color : ''
      };
    }
  }
}
</script>

<style scoped>
.progress-linear {
  position: relative;
  width: 99%;
  margin: 0 auto;
  height: 3px;
  overflow: hidden;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.progress-linear-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
}

.is-moving {
  animation: progress-linear-intermediate 1s infinite;
}

@keyframes progress-linear-intermediate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

</style>
