<template>
  <button
    :class="['base-button', buttonColor, { 'base-button--disabled': disabled }]"
    :style="{ cursor: loading || disabled ? 'not-allowed' : 'pointer' }"
    @click="handleClick"
    :disabled="disabled || loading"
  >
    <template v-if="!loading">
      <div class="flex items-center">
        <Icon v-if="prependIcon" :icon="prependIcon" width="20" style="display: inline; margin-right: 5px"/>
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <Icon icon="line-md:loading-loop" width="25" />
    </template>
  </button>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "BaseButton",
  props: {
    color: {
      type: String,
      default: "default",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    prependIcon: {
      type: String,
      default: "",
    }
  },
  components: {
    Icon,
  },
  computed: {
    buttonColor() {
      return `base-button--${this.color}`;
    },
  },
  methods: {
    handleClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
.base-button {
  @apply py-1 px-4 rounded border;
  transition: filter 0.3s;
}

.base-button--default {
  background-color: white;
  color: black;
}

.base-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.base-button--secondary {
  background-color: gray;
  color: white;
}

.base-button--disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

.base-button:hover:not(.base-button--disabled) {
  filter: invert(1);
}
</style>
