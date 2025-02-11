<template>
  <span class="bg-gray-100 rounded-b-lg">
    <section class="flex flex-col px-3 overflow-auto mb-1" style="max-height: 70vh">
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
      <div v-for="(dayTimes, key) in reservationTimes" :key="key" class="my-1">
        <div class="flex justify-between py-2">
          <div>
            {{ key.charAt(0).toUpperCase() + key.slice(1) }}
          </div>
          <button v-if="key === 'saturday'" @click="applyOnAllDays">
            <span style="color: var(--primary-color)">Apply on all days</span>
          </button>
        </div>
        <div
          class="flex justify-between items-center rounded-md p-2 bg-white"
          style="border: 1px solid #ccc"
        >
          <div class="flex gap-3">
            <span
              v-for="(time, index) in dayTimes"
              :key="index"
              class="flex items-center justify-between gap-2 p-1 rounded-md"
              :style="{
                border: editMode[key][index]
                  ? '2px solid blue'
                  : '1px solid var(--primary-color)',
              }"
            >
              <template v-if="editMode[key][index]">
                <CustomTimeInput
                  v-model="time[0]"
                  @blur="onCustomTimeBlur(key, index)"
                />
                -
                <CustomTimeInput
                  v-model="time[1]"
                  @blur="onCustomTimeBlur(key, index)"
                />
              </template>
              <template v-else>
                <button @click="editTimeSlot(key, index)">
                  {{ time[0] }} - {{ time[1] }}
                </button>
              </template>
              <button
                v-if="!editMode[key][index]"
                @click.stop="removeTimeSlot(key, index)"
                class="invert-on-hover"
              >
                <Icon
                  icon="lets-icons:close-round-duotone"
                  width="20"
                  color="var(--primary-color)"
                />
              </button>
            </span>
          </div>
          <BaseButton @click="addTimeSlot(key)">
            <Icon icon="ic:baseline-more-time" width="25"></Icon>
          </BaseButton>
        </div>
      </div>
    </section>
    <ActionButtons
      :loading="loading"
      @close="onClose"
      @save="onSave"
      class="bg-white"
    />
  </span>
</template>
<script>
import ActionButtons from "@/components/ActionButtons.vue";
import MultiSelect from "@/components/MultiSelect.vue";
import BaseInput from "@/components/BaseInput.vue";
import CustomTimeInput from "@/components/CustomTimeInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { Icon } from "@iconify/vue2";
import apiServices from "@/services/apiServices";
import { alertService } from "@/services/alertServices";

export default {
  data() {
    return {
      loading: false,
      reservationDuration: this.value.reservation_duration ?? 0,
      reservationTimes: this.reorderDays(this.value.reservation_times),
      selectedTables: [],
      remainingTables: [],
      // initialSelectedTables: [],
      // initialRemainingTables: [],
      editMode: {
        sunday: [false, false, false],
        monday: [false, false, false],
        tuesday: [false, false, false],
        wednesday: [false, false, false],
        thursday: [false, false, false],
        friday: [false, false, false],
        saturday: [false, false, false],
      },
      startTime: "00:00",
      endTime: "00:00",
      snackbar: alertService,
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
    BaseButton,
    Icon,
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
    addTimeSlot(dayTimes) {
      if (this.reservationTimes[dayTimes].length < 3) {
        this.reservationTimes[dayTimes].push(["00:00", "00:00"]);
      }
    },
    removeTimeSlot(dayTimes, index) {
      this.reservationTimes[dayTimes].splice(index, 1);
    },
    editTimeSlot(day, index) {
      Object.keys(this.editMode).forEach((day) => {
        this.editMode[day] = this.editMode[day].map(() => false);
      });
      // this.startTime = this.reservationTimes[day][index][0];
      // this.endTime = this.reservationTimes[day][index][1];
      this.$set(this.editMode[day], index, true);
    },
    onCustomTimeBlur(day, index) {
      this.$set(this.editMode[day], index, false);
    },
    addToItems(table) {
      this.remainingTables.push(table);
    },
    onClose() {
      this.$emit("close");
    },
    validateReservationTimes() {
      // TODO: add time slots conflict per day
      for (const day in this.reservationTimes) {
        for (const time of this.reservationTimes[day]) {
          const [hours, minutes] = time[0].split(':');
          const startTime = hours * 60 + minutes;
          const [hours2, minutes2] = time[1].split(':');
          const endTime = hours2 * 60 + minutes2;
          const timeSlot = endTime - startTime;

          if (timeSlot < this.reservationDuration) {
            this.snackbar.warning(
              `${day}: Time slot must be longer than reservation duration`
            );
            return false;
          }
        }
      }

      return true;
    },
    onSave: async function () {
      if (!this.reservationDuration) {
        this.snackbar.warning("Please select Reservation Duration");
        return;
      }

      // Time slot must be longer than reservation duration.
      if (!this.validateReservationTimes()) {
        return;
      }

      this.loading = true;

      // get new added tables (previously inactive)
      // const activeTables = this.initialRemainingTables.filter((table) =>
      //   this.selectedTables.find((item) => item.id === table.id)
      // );

      // console.log({activeTables});
      // console.log(activeTables)

      // get newly removed tables (previously active)
      // const inactiveTables = this.initialSelectedTables.filter(
      //   (table) => !this.selectedTables.includes(table)
      // );

      const sections = this.value.sections.map((section) => {
        const updatedTables = section.tables.map((table) => {
          if (this.selectedTables.find((t) => t.id === table.id)) {
            return { ...table, accepts_reservations: true };
          } 
          return { ...table, accepts_reservations: false };
        });
        return { ...section, tables: updatedTables };
      });

      const raw = {
        reservation_duration: this.reservationDuration,
        reservation_times: this.reservationTimes,
        sections: sections,
      };


      try {
        await apiServices.updateBranch(this.value.id, raw);
        this.$emit("save-settings", {
          id: this.value.id,
          reservation_duration: this.reservationDuration,
          reservation_times: this.reservationTimes,
          sections: sections,
        });

        setTimeout(() => {
          this.onClose();
        }, 200);

        this.snackbar.success("Branch settings are updated");
      } catch (error) {
        console.error("Error editing a branch:", error);
        this.snackbar.error(
          `Error editing a branch: ${error.response.data.message}`
        );
      } finally {
        this.loading = false;
      }
    },
    reorderDays(reservationTimes) {
      if (!reservationTimes) {
        return {
          saturday: [],
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        };
      }
      const orderedDays = [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ];
      const reordered = {};
      orderedDays.forEach((day) => {
        if (reservationTimes[day]) {
          reordered[day] = reservationTimes[day];
        } else {
          reordered[day] = [];
        }
      });
      return reordered;
    },
    applyOnAllDays() {
      const saturdayTimes = JSON.parse(
        JSON.stringify(this.reservationTimes.saturday)
      );
      Object.keys(this.reservationTimes).forEach((day) => {
        this.reservationTimes[day] = JSON.parse(JSON.stringify(saturdayTimes));
      });
    },
  },
  mounted() {
    this.tables = [...this.getTables()];
    const filtered = this.tables.filter(
      (table) => table.accepts_reservations === true
    );
    if (filtered.length > 0) {
      this.selectedTables = [...filtered];
      // this.initialSelectedTables = [...filtered];
    }

    const other = this.tables.filter(
      (table) => table.accepts_reservations === false
    );
    if (other.length > 0) {
      this.remainingTables = [...other];
      // this.initialRemainingTables = [...other];
    }
  },
};
</script>
