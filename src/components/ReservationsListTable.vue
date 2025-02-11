<template>
  <div class="w-full flex flex-col items-center my-20">
    <span class="w-5/6"><ProgressLinear v-model="loadingTable" /></span>
    <table class="w-5/6 bg-white rounded-lg mb-20 overflow-hidden shadow-lg">
      <tr>
        <BaseButton
          @click="onAddBranchesClick"
          class="my-2 mx-3"
          color="primary"
          :disabled="loadingTable"
          :prepend-icon="'gridicons:add-outline'"
          >Add Branches</BaseButton
        >
      </tr>
      <tr>
        <th v-for="(header, index) in colDefs" :key="header.name">
          {{ header.title }}
          <BaseButton
            @click="reorderRows(index)"
            :icon="orderIcon[header.sortOrder]"
          >
          </BaseButton>
        </th>
      </tr>
      <tr
        v-for="branch in sortedBranches"
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
import { Icon } from "@iconify/vue2";

export default {
  props: {
    loadingTable: Boolean,
    acceptReservationsBranches: Array,
    onAddBranchesClick: Function,
    onRowClick: Function,
  },
  data() {
    return {
      colDefs: [
        {
          name: "name",
          title: "Branch",
          sortOrder: "normal",
        },
        {
          name: "reference",
          title: "Reference",
          sortOrder: "normal",
        },
        {
          name: "tables",
          title: "Number of Tables",
          sortOrder: "normal",
        },
        {
          name: "reservation_duration",
          title: "Reservation Duration",
          sortOrder: "normal",
        },
      ],
      orderIcon: {
        normal: "famicons:filter",
        ascending: "ic:baseline-arrow-upward",
        descending: "ic:baseline-arrow-downward",
      },
      currentSortHeader: null,
    };
  },
  computed: {
    sortedBranches() {
      if (!this.currentSortHeader) {
        return this.acceptReservationsBranches;
      }

      const header = this.currentSortHeader;
      let new_array = this.acceptReservationsBranches.map((branch) => ({
        ...branch,
        tables: this.getTablesCount(branch),
      }));

      new_array.sort((a, b) => {
        if (a[header.name] === null) {
          a[header.name] = "";
        }
        // concatenate string to make the sort work for both string and number
        return (a[header.name]+"").localeCompare(b[header.name]);
      });

      if (header.sortOrder === "ascending") {
        return new_array;
      } else if (header.sortOrder === "descending") {
        return new_array.reverse();
      } else {
        return this.acceptReservationsBranches;
      }
    },
  },
  methods: {
    reorderRows(headerIndex) {
      // track the current header
      this.currentSortHeader = this.colDefs[headerIndex];

      const headerOrders = ["normal", "ascending", "descending"];

      // go through the sorting cycle
      let nextOrder =
        headerOrders.indexOf(this.colDefs[headerIndex].sortOrder) + 1;
      if (nextOrder === headerOrders.length) {
        nextOrder = 0;
      }
      this.colDefs[headerIndex].sortOrder = headerOrders[nextOrder];
    },
    getTablesCount(branch) {
      return branch.sections.reduce(
        (total, sec) => total + sec.tables.length,
        0
      );
    },
  },
  components: {
    BaseButton,
    ProgressLinear,
    Icon,
  },
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
  border-bottom: 1px solid #a0a0a094;
}
tr:last-child {
  border-bottom: none;
}

tr:nth-child(even):not(:nth-child(2)) {
  background-color: var(--secondary-color);
}

tr:nth-child(2) {
  background-color: #dbcdff;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #e2e2e2;
}
</style>
