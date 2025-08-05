<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "FullScreen",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const navigatorBox = ref(null);
const svgBox = ref(null);
const showMiniMap = ref(false);
const timer = ref(null);
const boxWidth = ref(0);
const boxHeight = ref(0);
const svgBoxScale = ref(1);
const svgBoxLeft = ref(0);
const svgBoxTop = ref(0);
const viewBoxStylePosition = ref({
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
});
const mindMapImg = ref("");

const isDark = computed(() => useXmindStoreHook().getIsDark);

onMounted(() => {
  emitter.on("toggle_mini_map", toggle_mini_map);
  emitter.on("data_change", data_change);
  emitter.on("node_tree_render_end", data_change);
  emitter.on("view_data_change", data_change);
});

onUnmounted(() => {
  emitter.off("toggle_mini_map", toggle_mini_map);
  emitter.off("data_change", data_change);
  emitter.off("view_data_change", data_change);
  emitter.off("node_tree_render_end", data_change);
});

function toggle_mini_map(show) {
  showMiniMap.value = show;
  nextTick(() => {
    if (show) {
      if (navigatorBox.value) {
        init();
      }
      if (svgBox.value) {
        drawMiniMap();
      }
    }
  });
}
function data_change() {
  if (!showMiniMap.value) {
    return;
  }
  clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    drawMiniMap();
  }, 500);
}
function init() {
  let { width, height } = navigatorBox.value.getBoundingClientRect();
  boxWidth.value = width;
  boxHeight.value = height;
}
function drawMiniMap() {
  let { getImgUrl, viewBoxStyle, miniMapBoxScale, miniMapBoxLeft, miniMapBoxTop } = props.mindMap.miniMap.calculationMiniMap(
    boxWidth.value,
    boxHeight.value,
  );
  // 渲染到小地图
  getImgUrl(img => {
    mindMapImg.value = img;
  });
  viewBoxStylePosition.value = viewBoxStyle;
  svgBoxScale.value = miniMapBoxScale;
  svgBoxLeft.value = miniMapBoxLeft;
  svgBoxTop.value = miniMapBoxTop;
}
function onMousedown(e) {
  props.mindMap.miniMap.onMousedown(e);
}
function onMousemove(e) {
  props.mindMap.miniMap.onMousemove(e);
}
function onMouseup(e) {
  props.mindMap.miniMap.onMouseup(e);
}
</script>
<template>
  <div
    v-if="showMiniMap"
    ref="navigatorBox"
    class="navigatorBox"
    :class="{ isDark: isDark }"
    @mousedown="onMousedown"
    @mousemove="onMousemove"
    @mouseup="onMouseup"
  >
    <div
      ref="svgBox"
      class="svgBox"
      :style="{
        transform: `scale(${svgBoxScale})`,
        left: svgBoxLeft + 'px',
        top: svgBoxTop + 'px',
      }"
    >
      <img :src="mindMapImg" @mousedown.prevent />
    </div>
    <div class="windowBox" :style="viewBoxStylePosition" />
  </div>
</template>

<style lang="scss" scoped>
.navigatorBox {
  position: absolute;
  right: 70px;
  bottom: 80px;
  width: 350px;
  height: 220px;
  cursor: pointer;
  user-select: none;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 0 16px #989898;

  &.isDark {
    background-color: #262a2e;
  }

  .svgBox {
    position: absolute;
    left: 0;
    transform-origin: left top;
  }

  .windowBox {
    position: absolute;
    border: 2px solid rgb(238 69 69);
    transition: all 0.3s;
  }
}
</style>
