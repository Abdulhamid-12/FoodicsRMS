<template>
  <button
    :class="['base-button', getBtnClass(), { 'base-button--disabled': disabled }]"
    :style="{ cursor: loading || disabled ? 'not-allowed' : 'pointer' }"
    @click="handleClick"
    :disabled="disabled || loading"
  >
    <template v-if="!loading && !icon">
      <div class="flex items-center">
        <Icon v-if="prependIcon" :icon="prependIcon" width="20" style="display: inline; margin-right: 5px"/>
        <slot></slot>
      </div>
    </template>
    <template v-else-if="icon">
      <Icon :icon="icon"/>
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
    },
    icon: {
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
    },
    getBtnClass() {
      if(this.icon){
        return "base-button--icon";
      } else {
        return `base-button--${this.color}`;
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

.base-button--icon {
  @apply p-2 rounded-full;
  transition: filter 0.3s;
  border: none;
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
  background-color: rgb(179, 177, 255);
  border-color: black;
  color: rgb(0, 0, 0);
}

.base-button--error {
  background-color: rgb(175, 0, 0);
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
