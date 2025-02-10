<template>
  <span>
    <section class="flex flex-col mx-3">
      <MultiSelect
        v-model="selectedItems"
        :items="remainingItems"
        item-text="name"
        item-value="id"
        label="Branches"
        @remove="addToItems"
      />
    </section>
    <ActionButtons :loading="loading" @close="onClose" @save="onSave" />
  </span>
</template>

<script>
import MultiSelect from "@/components/MultiSelect.vue";
import ActionButtons from "@/components/ActionButtons.vue";
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
    MultiSelect,
    ActionButtons
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

      try {
        await Promise.allSettled([
          ...inactiveBranches.map((branch) =>
            apiServices.updateAcceptReservation(branch.id, { 'accepts_reservations': true })
          ),
          ...activeBranches.map((branch) =>
            apiServices.updateAcceptReservation(branch.id, { 'accepts_reservations': false })
          ),
        ]);

        this.$emit("update-table", this.selectedItems);
        this.onClose();

      } catch (error) {
        console.error("Error adding branches:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
