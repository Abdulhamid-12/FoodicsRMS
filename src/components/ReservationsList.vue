<template>
  <div style="background-color: #f8f9fa;">
    <div class="flex items-center justify-between py-4" style="background-color: var(--secondary-color);">
      <h1 class="mx-3 text-4xl">Reservations</h1>
      <BaseButton class="my-2 mx-3" :color="'primary'"
        >Disable Reservations</BaseButton
      >
    </div>
    <div class="w-full flex flex-col items-center my-20">
      <span class="w-5/6"><ProgressLinear v-model="loadingTable" /></span>
      <table class="w-5/6 bg-white rounded-lg mb-20 overflow-hidden">
        <tr>
          <BaseButton
            @click="onAddBranches"
            class="my-2 mx-3"
            :color="'secondary'"
            >Add Branches</BaseButton
          >
        </tr>
        <tr>
          <th>Branch</th>
          <th>Reference</th>
          <th>Number of Tables</th>
          <th>Reservation Duration</th>
        </tr>
        <tr v-for="branch in acceptReservationsBranches" :key="branch.id">
          <td>{{ branch.name }}</td>
          <td>{{ branch.reference }}</td>
          <td>{{ getTablesCount(branch) }}</td>
          <td>{{ branch.reservation_duration }}</td>
        </tr>
      </table>
    </div>
    <BaseDialog v-model="dialog" title="Add Branches" :loading="loading">
      <p class="mx-3 py-2">
        A button “Add Branches” will open a pop up allowing users to enable
        reservations for branches that have
        <span style="color: blueviolet">"accepts_reservations === false"</span>
        Saving this popup will update the branch with
        <span style="color: blueviolet">"accepts_reservations = true"</span>.
      </p>
      <section class="flex flex-col mx-3">
        <MultiSelect
          v-model="acceptReservationsBranches"
          :items="rejectReservationsBranches"
          item-text="name"
          item-value="id"
        />
      </section>
      <section class="flex justify-end">
        <BaseButton class="my-2" @click="dialog = false">Close</BaseButton>
        <BaseButton class="my-2 mx-3" :color="'primary'">Save</BaseButton>
      </section>
    </BaseDialog>
  </div>
</template>
<script>
import BaseDialog from "@/components/BaseDialog.vue";
import BaseButton from "@/components/BaseButton.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import ProgressLinear from "@/components/ProgressLinear.vue";
import apiServices from "@/services/apiServices";

export default {
  data() {
    return {
      dialog: false,
      loadingTable: false,
      loading: false,
      branches: [],
    };
  },
  components: {
    BaseDialog,
    BaseButton,
    MultiSelect,
    ProgressLinear,
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
    onAddBranches: async function () {
      this.dialog = true;
    },
    getTablesCount: function (branch) {
      return branch.sections.reduce((total, sec) => total + sec.tables.length, 0);
    },
  },
  mounted: async function () {
      try {
        this.loadingTable = true;
        const response = await apiServices.getBranches();
        this.branches = [...response.data];
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

th, td {
  padding: .5rem 1rem;
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

tr:nth-child(even){
  background-color: var(--secondary-color);
}
</style>
