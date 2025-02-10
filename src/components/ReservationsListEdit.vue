<template>
  <span>
    <section class="flex flex-col mx-3">
      <h1 class="py-2 px-1 my-4 bg-blue-100 border-t border-b border-blue-500">
        Branch working hours are {{ value.opening_from }} -
        {{ value.opening_to }}
      </h1>
      <BaseInput
        v-model="reservationDuration"
        type="number"
        label="Reservation Duration (minutes)"
        :required="true"
        class="mb-2"
      />
      <MultiSelect
        label="Tables"
        v-model="selectedTables"
        :items="remainingTables"
        item-text="name"
        item-value="id"
        @remove="addToItems"
      />
      <CustomTimeInput v-model="timeInput" />
    </section>
    <ActionButtons :loading="loading" @close="onClose" @save="onSave" />
  </span>
</template>
<script>
import ActionButtons from "@/components/ActionButtons.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import BaseInput from "@/components/BaseInput.vue";
import CustomTimeInput from "@/components/CustomTimeInput.vue";
import apiServices from "@/services/apiServices";

export default {
  data() {
    return {
      loading: false,
      reservationDuration: this.value.reservation_duration,
      selectedTables: [],
      remainingTables: [],
      initialSelectedTables: [],
      initialRemainingTables: [],
      timeInput: "00:00",
    };
  },
  props: {
    value: Object,
  },
  components: {
    ActionButtons,
    MultiSelect,
    BaseInput,
    CustomTimeInput,
  },
  computed: {},
  methods: {
    getTables() {
      return this.value.sections
        .map((section) => {
          const sectionName = section.name;
          const tables = section.tables.map((table) => {
            return {
              ...table,
              name: `${sectionName} - ${table.name}`,
            };
          });

          return tables;
        })
        .flat();
    },
    addToItems(table) {
      this.remainingTables.push(table);
    },
    onClose() {
      this.$emit("close");
    },
    onSave: async function () {
      this.loading = true;

      // get new added tables (previously inactive)
      const inactiveTables = this.initialRemainingTables.filter((table) =>
        this.selectedTables.includes(table)
      );

      // get newly removed tables (previously active)
      const activeTables = this.initialSelectedTables.filter(
        (table) => !this.selectedTables.includes(table)
      );

      const raw = {};
      try {
        // await apiServices.updateBranch(this.value.id, raw);
        this.$emit("save");
      } catch (error) {
        console.error("Error editing a branch:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.tables = [...this.getTables()];
    const filtered = this.tables.filter(
      (table) => table.accepts_reservations === true
    );
    this.selectedTables = [...filtered];
    this.initialSelectedTables = [...filtered];

    const other = this.tables.filter(
      (table) => table.accepts_reservations === false
    );
    this.remainingTables = [...other];
    this.initialRemainingTables = [...other];
  },
};
</script>
