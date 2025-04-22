<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Working",
});

const msg = ref("Working");
</script>

<template>
  <div>
    <h1 class="text-primary">{{ msg }}</h1>
    <h1 class="hover:text-primary">{{ msg }}</h1>
  </div>
</template>
