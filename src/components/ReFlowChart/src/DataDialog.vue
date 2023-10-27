<script setup lang="ts">
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const props = defineProps({
  graphData: Object
});
</script>

<template>
  <vue-json-pretty :path="'res'" :deep="3" :show-length="true" :data="props.graphData" />
</template>
