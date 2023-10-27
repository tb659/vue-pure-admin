<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Working"
});

const msg = ref("Working");
</script>

<template>
  <div>{{ msg }}</div>
</template>
