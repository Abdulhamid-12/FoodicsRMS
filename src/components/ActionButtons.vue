<template>
  <div class="flex justify-end rounded-b-lg">
    <BaseButton class="my-2" @click="onClose" :disabled="loading"
      >Close</BaseButton
    >
    <BaseButton
      class="my-2 mx-3"
      :color="'primary'"
      @click="onSave"
      :loading="loading"
      >Save</BaseButton
    >
  </div>
</template>

<script>
import BaseButton from "@/components/BaseButton.vue";

export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseButton,
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    onSave() {
      this.$emit("save");
    },
  },
};
</script>
