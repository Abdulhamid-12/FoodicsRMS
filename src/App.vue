<template>
  <div id="app">
    <div class="mx-auto">
      <router-view />
    </div>
    <SnackBar />
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";

export default {
  name: "App",
  components: {
    SnackBar,
  },
}
</script>
