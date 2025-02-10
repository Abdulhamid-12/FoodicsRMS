<template>
  <div>
    <div
      class="flex items-center justify-between py-4"
      style="background-color: var(--secondary-color)"
    >
      <h1 class="mx-3 text-4xl"><b>Reservations</b></h1>
      <BaseButton
        class="my-2 mx-3"
        :color="'primary'"
        @click="onDisableReservations"
        :loading="loadingDisableBtn"
        >Disable Reservations</BaseButton
      >
    </div>
    <ReservationsListTable
      :loadingTable="loadingTable"
      :acceptReservationsBranches="acceptReservationsBranches"
      :onAddBranches="onAddBranches"
      :onRowClick="onRowClick"
      :getTablesCount="getTablesCount"
    />
    <BaseDialog v-model="dialog" title="Add Branches">
      <AddBranches
        :branches="addBranchesItems"
        @close="dialog = false"
        @update-table="onTableUpdate"
      />
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/BaseDialog.vue";
import BaseButton from "@/components/BaseButton.vue";
import AddBranches from "@/components/ReservationsListAdd.vue";
import ReservationsListTable from "@/components/ReservationsListTable.vue";
import apiServices from "@/services/apiServices";

export default {
  data() {
    return {
      dialog: false,
      loadingTable: false,
      loadingDisableBtn: false,
      branches: [],
      addBranchesItems: [],
    };
  },
  components: {
    BaseDialog,
    BaseButton,
    AddBranches,
    ReservationsListTable
  },
  computed: {
    acceptReservationsBranches() {
      return this.branches.filter(
        (branch) => branch.accepts_reservations === true
      );
    },
    rejectReservationsBranches() {
      return this.branches.filter(
        (branch) => branch.accepts_reservations === false
      );
    },
  },
  methods: {
    onDisableReservations: async function () {
      this.loadingTable = true;
      this.loadingDisableBtn = true;

      try {
        await Promise.allSettled(
          this.acceptReservationsBranches.map((branch) =>
            apiServices.updateAcceptReservation(branch.id, false)
          )
        );

        this.branches = this.branches.map(branch => {
          if(branch.accepts_reservations){
            branch.accepts_reservations = false;
          }

          return branch;
        });

      } catch (error) {
        console.error("error disabling reservations:", error);
      } finally {
        this.loadingTable = false;
        this.loadingDisableBtn = false;
      }
    },
    onAddBranches: async function () {
      this.dialog = true;
    },
    getTablesCount(branch) {
      return branch.sections.reduce(
        (total, sec) => total + sec.tables.length,
        0
      );
    },
    onRowClick(branch) {
      console.log("Row clicked:", branch);
      // Add your logic here
    },
    onTableUpdate(newTable) {
      this.branches = this.branches.map((branch) => {
        const activeBranch = newTable.find((item) => item.id === branch.id);
        if (activeBranch) {
          branch.accepts_reservations = true;
        } else {
          branch.accepts_reservations = false;
        }
        return branch;
      });
    },
  },
  mounted: async function () {
    try {
      this.loadingTable = true;
      const response = await apiServices.getBranches();

      this.branches = [...response.data];

      this.addBranchesItems = response.data.map((branch) => ({
        name: `${branch.name} (${branch.reference})`,
        id: branch.id,
        accepts_reservations: branch.accepts_reservations,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingTable = false;
    }
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
