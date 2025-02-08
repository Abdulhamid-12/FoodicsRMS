<template>
  <div class="bg-gray-200">
    <div class="flex items-center justify-between py-4 bg-blue-100">
      <h1 class="mx-3">Reservations</h1>
      <BaseButton class="my-2 mx-3" :color="'primary'"
        >Disable Reservations</BaseButton
      >
    </div>
    <div class="w-full flex">
      <table class="w-full m-10 bg-white rounded-lg">
        <tr>
          <BaseButton
            @click="dialog = true"
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
        <tr>
          <td>Branch 1</td>
          <td>B01</td>
          <td>0</td>
          <td>30 Minutes</td>
        </tr>
      </table>
    </div>
    <Dialog v-model="dialog">
      <div class="flex flex-col bg-white max-w-4xl rounded-lg">
        <section class="flex justify-between bg-blue-100 py-2 rounded-t-lg">
          <h1 class="mx-3">Add Branches</h1>
        </section>
        <p class="mx-3 py-2">
          A button “Add Branches” will open a pop up allowing users to enable
          reservations for branches that have
          <span style="color: blueviolet"
            >"accepts_reservations === false"</span
          >
          Saving this popup will update the branch with
          <span style="color: blueviolet">"accepts_reservations = true"</span>.
        </p>
        <section class="flex flex-col mx-3">
          <MultiSelect
            v-model="selectedBranches"
            :items="['A01', 'A02', 'A03']"
          />
        </section>
        <section class="flex justify-end">
          <BaseButton class="my-2" @click="dialog = false">Close</BaseButton>
          <BaseButton class="my-2 mx-3" :color="'primary'">Save</BaseButton>
        </section>
      </div>
    </Dialog>
  </div>
</template>
<script>
import Dialog from "@/components/Dialog.vue";
import BaseButton from "@/components/BaseButton.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import apiServices from "@/services/apiServices";

export default {
  data() {
    return {
      dialog: false,
      selectedBranches: ['b', 'c'],
    };
  },
  components: {
    Dialog,
    BaseButton,
    MultiSelect,
  },
  mounted: async function () {
    console.log("mounted");
    try {
      const branches = await apiServices.getBranches();
    } catch (error) {
      console.error(error);
    }
  },
};
</script>
<style scoped>
.custom-button {
  @apply text-white py-1 px-4 rounded;
}

th {
  text-align: left;
  font-weight: bold;
}

tr {
  border-bottom: 1px solid #747373;
}
</style>
