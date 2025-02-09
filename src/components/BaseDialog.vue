<template>
  <BaseOverlay v-model="value">
    <div class="dialog">
      <section class="flex justify-between py-2 rounded-t-lg" style="background-color: var(--secondary-color);">
        <h1 class="mx-3">{{ title }}</h1>
      </section>
      <slot></slot>
      <ProgressLinear v-model="loading" />
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from "@/components/BaseOverlay.vue";
import ProgressLinear from "@/components/ProgressLinear.vue";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Dialog",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseOverlay,
    ProgressLinear,
  },
};
</script>

<style scoped>
.dialog {
  @apply flex flex-col bg-white max-w-4xl rounded-lg;
}
</style>
