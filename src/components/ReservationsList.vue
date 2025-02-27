<template>
  <div>
    <div
      class="flex items-center justify-between py-4"
      style="background-color: var(--secondary-color)"
    >
      <h1 class="mx-3 text-4xl">Reservations</h1>
      <BaseButton
        class="my-2 mx-3"
        color="error"
        @click="onDisableReservations"
        :loading="loadingDisableBtn"
        >Disable Reservations</BaseButton
      >
    </div>
    <BaseDialog v-model="addDialog" title="Add Branches">
      <ReservationsListAdd
        :branches="branches"
        @close="addDialog = false"
        @update-table="onSaveAddBranches"
      />
    </BaseDialog>
    <ReservationsListTable
      :loadingTable="loadingTable"
      :acceptReservationsBranches="acceptReservationsBranches"
      :onAddBranchesClick="onAddBranchesClick"
      :onRowClick="onRowClick"
    />
    <BaseDialog
      v-model="editDialog"
      :title="`Edit ${selectedBranch?.name} (Branch reservations settings)`"
    >
      <ReservationsListEdit
        v-model="selectedBranch"
        @close="editDialog = false"
        @save-settings="onSaveSettings"
      />
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "@/components/BaseDialog.vue";
import BaseButton from "@/components/BaseButton.vue";
import ReservationsListAdd from "@/components/ReservationsListAdd.vue";
import ReservationsListEdit from "@/components/ReservationsListEdit.vue";
import ReservationsListTable from "@/components/ReservationsListTable.vue";
import apiServices from "@/services/apiServices";
import { alertService } from "@/services/alertServices";

export default {
  data() {
    return {
      addDialog: false,
      editDialog: false,
      loadingTable: false,
      loadingDisableBtn: false,
      branches: [],
      addBranchesItems: [],
      selectedBranch: null,
      snackbar: alertService,
    };
  },
  components: {
    BaseDialog,
    BaseButton,
    ReservationsListAdd,
    ReservationsListEdit,
    ReservationsListTable,
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
            apiServices.updateBranch(branch.id, { accepts_reservations: false })
          )
        );

        this.branches = this.branches.map((branch) => {
          if (branch.accepts_reservations) {
            branch.accepts_reservations = false;
          }

          return branch;
        });

        this.snackbar.success("Reservations disabled");
      } catch (error) {
        console.error("error disabling reservations:", error);
        this.snackbar.error(
          `Error disabling reservations: ${error.response.data.message}`
        );
      } finally {
        this.loadingTable = false;
        this.loadingDisableBtn = false;
      }
    },
    onAddBranchesClick: async function () {
      this.addDialog = true;
    },

    onRowClick(branch) {
      console.log("Row clicked:", branch);
      this.selectedBranch = branch;
      this.editDialog = true;
    },

    onSaveAddBranches(newTable) {
      this.branches = this.branches.map((branch) => {
        const activeBranch = newTable.find((item) => item.id === branch.id);
        branch.accepts_reservations = !!activeBranch;
        return branch;
      });
    },
    onSaveSettings(editedBranch) {
      // Update the table
      this.branches = this.branches.map((b) => {
        if (b.id === editedBranch.id) {
          b.reservation_duration = editedBranch.reservation_duration;
          b.reservation_times = editedBranch.reservation_times;
          b.sections = editedBranch.sections;
        }
        return b;
      });
    },
  },
  mounted: async function () {
    try {
      this.loadingTable = true;
      const response = await apiServices.getBranches();
      this.branches = [...response.data];

      this.snackbar.success("Branches loaded");
    } catch (error) {
      console.error(error);
      this.snackbar.error(
        `Error loading branches: ${error.response.data.message}`
      );
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
