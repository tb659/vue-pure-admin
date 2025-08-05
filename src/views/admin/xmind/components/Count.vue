<script setup lang="ts">
/**
 * @Desc: 字数及节点数量统计
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "Count",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

let countEl = document.createElement("div");

const textStr = ref("");
const words = ref(0);
const num = ref(0);
const isDark = computed(() => useXmindStoreHook().getIsDark);

/**
 * @Desc: 监听数据变化
 */
function onDataChange(data) {
  textStr.value = "";
  words.value = 0;
  num.value = 0;
  walk(data);
  countEl.innerHTML = textStr.value;
  words.value = countEl.textContent.length;
}
/**
 * @Desc: 遍历
 */
function walk(data) {
  num.value++;
  textStr.value += String(data.data.text) || "";
  if (data.children && data.children.length > 0) {
    data.children.forEach(item => {
      walk(item);
    });
  }
}

onMounted(() => {
  emitter.on("data_change", onDataChange);
  if (props.mindMap) {
    onDataChange(props.mindMap.getData());
  }
});

onUnmounted(() => {
  emitter.off("data_change", onDataChange);
});
</script>
<template>
  <div class="countContainer" :class="{ isDark: isDark }">
    <div class="item">
      <span class="name">{{ $t("count.words") }}</span>
      <span class="value">{{ words }}</span>
    </div>
    <div class="item">
      <span class="name">{{ $t("count.nodes") }}</span>
      <span class="value">{{ num }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.countContainer {
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  height: 22px;
  padding: 0 12px;
  font-size: 12px;
  line-height: 22px;
  background: hsl(0deg 0% 100% / 80%);
  border-radius: 2px;
  opacity: 0.8;

  &.isDark {
    background: #262a2e;

    .item {
      color: hsl(0deg 0% 100% / 60%);
    }
  }

  .item {
    margin-right: 15px;
    color: #555;

    &:last-of-type {
      margin-right: 0;
    }

    .name {
      margin-right: 5px;
    }
  }
}

@media screen and (width <= 740px) {
  .countContainer {
    display: none;
  }
}
</style>
