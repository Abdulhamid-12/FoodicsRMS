<template>
  <div>
    <div class="select-field" @click="showDropdown = true" @blur="hideDropdown">
      <div class="selected-items">
        <span v-for="item in value" class="selected-item">
          <div class="flex items-center">
            <h1>
              {{ getItemTitle(item) }}
            </h1>
            <button @click.stop="removeItem(item)"><Icon icon="lets-icons:close-round-duotone" width="20" /></button>
          </div>
        </span>
      </div>
      <button @click.stop="showDropdown = !showDropdown">
        <Icon icon="mdi:menu-down" width="25" :rotate="showDropdown ? 90 : 0" />
      </button>
    </div>
    <ul v-if="showDropdown" class="dropdown">
      <li v-for="item in filteredItems" @click="selectItem(item)">
        {{ getItemTitle(item) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";

export default {
  name: "MultiSelect",
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
    },
    itemText: {
      type: String,
      default: "name",
    },
    itemValue: {
      type: String,
      default: "value",
    },
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    selectedItems() {
      return this.value;
    },
    filteredItems() {
      return this.items.filter((item) => !this.value.includes(item));
    },
  },
  components: {
    Icon,
  },
  methods: {
    selectItem(item) {
      const existingItem = this.selectedItems.find((i) =>
        this.areItemsEqual(i, item)
      );
      if (!existingItem) {
        this.$emit("input", [...this.selectedItems, item]);
      }
      // if (!this.value.includes(item)) {
      //   this.$emit("input", [...this.selectedItems, item]);
      // }
    },
    removeItem(item) {
      this.$emit(
        "input",
        this.selectedItems.filter((i) => i !== item)
      );
    },
    getItemTitle(item) {
      // const bbb = this.itemText ? item[this.itemText] : item;
      // console.log(bbb);
      return this.itemText ? item[this.itemText] : item;
    },
    areItemsEqual(item1, item2) {
      if (typeof item1 === "object" && typeof item2 === "object") {
        return JSON.stringify(item1) === JSON.stringify(item2);
      }
      return item1 === item2;
    },
    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    },
  },
};
</script>

<style scoped>
.select-field {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.selected-item {
  background-color: #e0e0e0;
  padding: 3px 10px;
  border-radius: 7px;
  display: flex;
  align-items: center;
}

.selected-item button {
  background: none;
  border: none;
  margin-left: 5px;
  cursor: pointer;
}

input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.dropdown {
  position: relative;
  width: 300px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 3px;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown li {
  padding: 5px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}
</style>
