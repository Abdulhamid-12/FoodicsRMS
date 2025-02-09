<template>
  <div :class="['progress-linear', color]">
    <div :class="['progress-linear-bar', { 'is-moving': value }]" :style="barStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressLinear',
  data() {
    return {
      inActiveColor: '#3b82f680'
    };
  },
  props: {
    color: {
      type: String,
      default: '#5f27cd'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    barStyle() {
      return {
        backgroundColor: this.value ? this.color : this.inActiveColor
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
  background-color: #e0e0e0;
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
