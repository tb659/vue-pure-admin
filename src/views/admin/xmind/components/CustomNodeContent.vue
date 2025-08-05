<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Count",
});

const props = defineProps({
  html: {
    type: String,
    default: "",
  },
});

const title = ref("我是自定义节点");
const color = ref("");
function onClick() {
  color.value = "red";
}
</script>
<template>
  <div class="customNodeContent">
    <p>{{ title }}</p>
    <p v-html="html" />
    <p :style="{ backgroundColor: color }" @click="onClick">点击我会变色</p>
  </div>
</template>

<style lang="scss" scoped>
.customNodeContent {
  padding: 10px;
  cursor: pointer;
}
</style>
