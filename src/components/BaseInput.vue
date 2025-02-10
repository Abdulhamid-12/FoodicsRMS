<template>
  <div class="input-field">
    <h1 v-if="label" class="input-label">
      {{ label
      }}<span v-if="required" style="color: red; font-weight: bold">*</span>
    </h1>
    <input
      :type="type"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input-element"
    />
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-label {
  margin-bottom: 5px;
}

.input-element {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
