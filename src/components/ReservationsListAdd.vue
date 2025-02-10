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
        v-model="selectedItems"
        :items="remainingItems"
        item-text="name"
        item-value="id"
        @remove="addToItems"
      />
    </section>
    <section class="flex justify-end">
      <BaseButton class="my-2" @click="onClose()" :disabled="loading"
        >Close</BaseButton
      >
      <BaseButton
        class="my-2 mx-3"
        :color="'primary'"
        @click="onSave()"
        :loading="loading"
        >Save</BaseButton
      >
    </section>
  </span>
</template>
<script>
import MultiSelect from "@/components/MultiSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import apiServices from "@/services/apiServices";

export default {
  data() {
    return {
      loading: false,
      selectedItems: [],
      remainingItems: [],
      initialActiveItems: [],
      initialInctiveItems: [],
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
  mounted() {
    const filtered = this.branches.filter(
      (branch) => branch.accepts_reservations === true
    );
    this.selectedItems = [...filtered];
    this.initialActiveItems = [...filtered];

    const other = this.branches.filter(
      (branch) => branch.accepts_reservations === false
    );
    this.remainingItems = [...other];
    this.initialInctiveItems = [...other];
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    addToItems(item){
      this.remainingItems.push(item);
    },
    async onSave() {

      this.loading = true;
      // get new added branches (previously inactive)
      const inactiveBranches = this.initialInctiveItems.filter(
        (branch) => this.selectedItems.includes(branch)
      );

      // get newly removed branches (previously active)
      const activeBranches = this.initialActiveItems.filter(
        (branch) => !this.selectedItems.includes(branch)
      );

      // console.log("previously inactive:", inactiveBranches);
      // console.log("previously active:", activeBranches);

      try {
        await Promise.allSettled([
          ...inactiveBranches.map((branch) =>
            apiServices.updateAcceptReservation(branch.id, true)
          ),
          ...activeBranches.map((branch) =>
            apiServices.updateAcceptReservation(branch.id, false)
          ),
        ]);

        this.$emit("update-table", this.selectedItems);

      } catch (error) {
        console.error("Error adding branches:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
