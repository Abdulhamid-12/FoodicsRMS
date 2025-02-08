<template>
  <div class="select-field" @click="showDropdown = true" @blur="hideDropdown">
    <div class="selected-items">
      <span v-for="item in modelValue" :key="item" class="selected-item">
        {{ item }}
        <button @click.stop="removeItem(item)">x</button>
      </span>
    </div>
    <ul v-if="showDropdown" class="dropdown">
      <li
        v-for="item in filteredItems"
        :key="item"
        @mousedown.prevent="selectItem(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'MultiSelect',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => ["hsd", "hgsfd", "hgf"]
    },
    modelValue: {
      type: Array,
      default: () => ["B01", "B02", "B03"]
    }
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
      filteredItems() {
        return this.items.filter(item => !this.modelValue.includes(item));
      }
    },
  methods: {
    selectItem(item) {
      if (!this.modelValue.includes(item)) {
        this.modelValue = [...this.modelValue, item];
      }
      this.showDropdown = false;
    },
    removeItem(item) {
      this.modelValue = this.modelValue.filter(i => i !== item);
    },
    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    }
  }
};
</script>

<style scoped>
.select-field {
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
  position: absolute;
  width: 100%;
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