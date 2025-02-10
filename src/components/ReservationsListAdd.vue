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
import { alertService } from "@/services/alertServices";

export default {
  data() {
    return {
      loading: false,
      selectedItems: [],
      remainingItems: [],
      initialActiveItems: [],
      initialInactiveItems: [],
      snackbar: alertService,
    };
  },
  props: {
    branches: Array,
    default: [],
  },
  components: {
    MultiSelect,
    ActionButtons,
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
    this.initialInactiveItems = [...other];
  },
  methods: {
    onClose() {
      this.$emit("close");
    },
    addToItems(item) {
      this.remainingItems.push(item);
    },
    async onSave() {
      this.loading = true;
      // get new added branches (previously inactive)
      const inactiveBranches = this.initialInactiveItems.filter((branch) =>
        this.selectedItems.includes(branch)
      );

      // get newly removed branches (previously active)
      const activeBranches = this.initialActiveItems.filter(
        (branch) => !this.selectedItems.includes(branch)
      );

      try {
        await Promise.allSettled([
          ...inactiveBranches.map((branch) =>
            apiServices.updateBranch(branch.id, { accepts_reservations: true })
          ),
          ...activeBranches.map((branch) =>
            apiServices.updateBranch(branch.id, { accepts_reservations: false })
          ),
        ]);

        this.$emit("update-table", this.selectedItems);

        setTimeout(() => {
          this.onClose();
        }, 200);

        this.snackbar.success("Branches updated");

      } catch (error) {
        console.error("Error adding branches:", error);
        this.snackbar.error("Error adding branches");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
