<template>
    <div class="overlay" v-if="modelValue">
      <!-- the dialog   -->
        <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    }
  }
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  </style>