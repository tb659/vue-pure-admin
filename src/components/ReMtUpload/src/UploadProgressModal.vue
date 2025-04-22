<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "UploadProgressModal",
});

const msg = ref("UploadProgressModal");
</script>

<template>
  <div>{{ msg }}</div>
</template>

<style lang="scss" scoped>
//
</style>
