<template>
  <BaseOverlay v-model="value">
    <div
      class="dialog"
      :style="{
        width: dialogWidth,
        height: dialogHeight,
        minWidth: dialogMinWidth,
        minHeight: dialogMinHeight,
      }"
    >
      <section
        class="flex justify-between py-2 rounded-t-lg"
        style="background-color: var(--secondary-color)"
      >
        <h1 class="mx-3">
          <b>{{ title }}</b>
        </h1>
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
    width: {
      type: String,
      default: "auto",
    },
    height: {
      type: String,
      default: "auto",
    },
    minWidth: {
      type: String,
      default: "min(100vw, 800px)",
    },
    minHeight: {
      type: String,
      default: "auto",
    },
  },
  computed: {
    dialogWidth() {
      return this.width;
    },
    dialogHeight() {
      return this.height;
    },
    dialogMinWidth() {
      return this.minWidth;
    },
    dialogMinHeight() {
      return this.minHeight;
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
