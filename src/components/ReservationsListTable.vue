<template>
  <div class="w-full flex flex-col items-center my-20">
    <span class="w-5/6"><ProgressLinear v-model="loadingTable" /></span>
    <table class="w-5/6 bg-white rounded-lg mb-20 overflow-hidden shadow-lg">
      <tr>
        <BaseButton
          @click="onAddBranchesClick"
          class="my-2 mx-3"
          :color="'secondary'"
          :disabled="loadingTable"
          :prepend-icon="'gridicons:add-outline'"
          >Add Branches</BaseButton
        >
      </tr>
      <tr>
        <th>Branch</th>
        <th>Reference</th>
        <th>Number of Tables</th>
        <th>Reservation Duration</th>
      </tr>
      <tr
        v-for="branch in acceptReservationsBranches"
        :key="branch.id"
        class="clickable-row"
        @click="onRowClick(branch)"
      >
        <td>{{ branch.name }}</td>
        <td>{{ branch.reference }}</td>
        <td>{{ getTablesCount(branch) }}</td>
        <td>{{ branch.reservation_duration }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import BaseButton from "@/components/BaseButton.vue";
import ProgressLinear from "@/components/ProgressLinear.vue";

export default {
  props: {
    loadingTable: Boolean,
    acceptReservationsBranches: Array,
    onAddBranchesClick: Function,
    onRowClick: Function,
    getTablesCount: Function
  },
  components: {
    BaseButton,
    ProgressLinear
  }
};
</script>

<style scoped>
.custom-button {
  @apply text-white py-1 px-4 rounded;
}

th,
td {
  padding: 0.5rem 1rem;
}
th {
  text-align: left;
  font-weight: bold;
}

tr {
  border-bottom: 1px solid #74737394;
}
tr:last-child {
  border-bottom: none;
}

tr:nth-child(even) {
  background-color: var(--secondary-color);
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #e2e2e2;
}
</style>
