<template>
  <span>
    <p class="mx-3 py-2">
      A button “Add Branches” will open a pop up allowing users to enable
      reservations for branches that have
      <span style="color: blueviolet">"accepts_reservations === false"</span>
      Saving this popup will update the branch with
      <span style="color: blueviolet">"accepts_reservations = true"</span>.
    </p>
    <section class="flex flex-col mx-3">
      <MultiSelect
        v-model="enabledBranches"
        :items="disabledBranches"
        item-text="name"
        item-value="id"
      />
    </section>
    <section class="flex justify-end">
      <BaseButton class="my-2" @click="onClose()">Close</BaseButton>
      <BaseButton class="my-2 mx-3" :color="'primary'">Save</BaseButton>
    </section>
  </span>
</template>
<script>
import MultiSelect from "@/components/MultiSelect.vue";
import BaseButton from "@/components/BaseButton.vue";

export default {
  data() {
    return {
      loading: false,
    };
  },
  props: {
    branches: Array,
    default: [],
  },
  components: {
    BaseButton,
    MultiSelect,
  },
  computed: {
    enabledBranches() {
      return this.branches.filter(
        (branch) => branch.accepts_reservations === true
      );
    },
    disabledBranches() {
      return this.branches.filter(
        (branch) => branch.accepts_reservations === false
      );
    },
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
  },
};
</script>
