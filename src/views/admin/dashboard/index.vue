<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Dashboard"
});

const msg = ref("Dashboard");
</script>

<template>
  <div>{{ msg }}</div>
</template>
