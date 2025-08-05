<script setup lang="ts">
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";
import { $t, transformI18n } from "@/plugins/i18n";
defineOptions({
  name: "Scrollbar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const horizontalScrollbarRef = ref(null);
const verticalScrollbarRef = ref(null);
const timer = ref(null);
const resizeTimer = ref(null);
const verticalScrollbarStyle = ref({});
const horizontalScrollbarStyle = ref({});
const isDark = computed(() => useXmindStoreHook().getIsDark);

onMounted(() => {
  setScrollBarWrapSize();
  // @ts-ignore
  emitter.on("scrollbar_change", updateScrollbar);
  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  // @ts-ignore
  emitter.off("scrollbar_change", updateScrollbar);
  window.removeEventListener("resize", onResize);
});

// 向插件传递滚动条宽高数据
function setScrollBarWrapSize() {
  if (!props.mindMap.scrollbar) return;
  const { width } = horizontalScrollbarRef.value.getBoundingClientRect();
  const { height } = verticalScrollbarRef.value.getBoundingClientRect();
  props.mindMap.scrollbar.setScrollBarWrapSize(width, height);
}
// 窗口尺寸变化
function onResize() {
  clearTimeout(resizeTimer.value);
  resizeTimer.value = setTimeout(() => {
    setScrollBarWrapSize();
  }, 300);
}
// 调用插件方法更新滚动条位置和大小
function updateScrollbar({ vertical, horizontal }) {
  verticalScrollbarStyle.value = {
    top: vertical.top + "%",
    height: vertical.height + "%",
  };
  horizontalScrollbarStyle.value = {
    left: horizontal.left + "%",
    width: horizontal.width + "%",
  };
}
// 垂直滚动条按下事件调用插件方法
function onVerticalScrollbarMousedown(e) {
  props.mindMap.scrollbar.onMousedown(e, "vertical");
}
// 垂直滚动条点击事件调用插件方法
function onVerticalScrollbarClick(e) {
  props.mindMap.scrollbar.onClick(e, "vertical");
}
// 水平滚动条按下事件调用插件方法
function onHorizontalScrollbarMousedown(e) {
  props.mindMap.scrollbar.onMousedown(e, "horizontal");
}
// 水平滚动条点击事件调用插件方法
function onHorizontalScrollbarClick(e) {
  props.mindMap.scrollbar.onClick(e, "horizontal");
}
</script>
<template>
  <div class="scrollbarContainer" :class="{ isDark: isDark }">
    <!-- 竖向 -->
    <div ref="verticalScrollbarRef" class="scrollbar verticalScrollbar" @click="onVerticalScrollbarClick">
      <div class="scrollbarInner" :style="verticalScrollbarStyle" @click.stop @mousedown="onVerticalScrollbarMousedown" />
    </div>
    <!-- 横向 -->
    <div ref="horizontalScrollbarRef" class="scrollbar horizontalScrollbar" @click="onHorizontalScrollbarClick">
      <div class="scrollbarInner" :style="horizontalScrollbarStyle" @click.stop @mousedown="onHorizontalScrollbarMousedown" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrollbarContainer {
  &.isDark {
    .scrollbar {
      background-color: #363b3f;

      .scrollbarInner {
        background-color: rgb(0 0 0 / 30%);
      }
    }
  }

  .scrollbar {
    position: absolute;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 10px;

    &.verticalScrollbar {
      top: 100px;
      bottom: 100px;
      left: 20px;
      width: 10px;

      .scrollbarInner {
        left: 0;
        width: 10px;
      }
    }

    &.horizontalScrollbar {
      right: 100px;
      bottom: 70px;
      left: 100px;
      height: 10px;

      .scrollbarInner {
        top: 0;
        height: 10px;
      }
    }

    .scrollbarInner {
      position: absolute;
      background-color: #ccc;
      border-radius: 10px;
    }
  }
}
</style>
