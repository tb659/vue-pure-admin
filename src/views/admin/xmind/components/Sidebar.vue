<script setup lang="ts">
/**
 * @Desc: 侧边栏容器
 */
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { store } from "../config";
import { Close } from "@element-plus/icons-vue";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "Sidebar",
});

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

const sidebarContent = ref(null);
const show = ref(false);
const zIndex = ref(0);
const isDark = computed(() => useXmindStoreHook().getIsDark);

watch(
  () => show.value,
  (val, oldVal) => {
    if (val && !oldVal) {
      zIndex.value = store.sidebarZIndex++;
    }
  },
);

onBeforeMount(() => {
  emitter.on("closeSideBar", handleCloseSidebar);
});

onBeforeUnmount(() => {
  emitter.off("closeSideBar", handleCloseSidebar);
});
function handleCloseSidebar() {
  close();
}
function close() {
  show.value = false;
  useXmindStoreHook().setActiveSidebar("");
}
function getEl() {
  return sidebarContent.value;
}

defineExpose({
  show,
  getEl,
});
</script>
<template>
  <div class="sidebarContainer" :class="{ show: show, isDark: isDark }" :style="{ zIndex: zIndex }" @click.stop>
    <el-icon class="closeBtn" @click="close">
      <Close />
    </el-icon>
    <div v-if="title" class="sidebarHeader">
      {{ title }}
    </div>
    <div ref="sidebarContent" class="sidebarContent">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebarContainer {
  position: fixed;
  top: 110px;
  right: -300px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #fff;
  border-left: 1px solid #e8e8e8;
  transition: all 0.3s;

  &.isDark {
    background-color: #262a2e;
    border-left-color: hsl(0deg 0% 100% / 10%);

    .sidebarHeader {
      color: #fff;
      border-bottom-color: hsl(0deg 0% 100% / 10%);
    }

    .closeBtn {
      color: #fff;
    }
  }

  &.show {
    right: 0;
  }

  .closeBtn {
    position: absolute;
    top: 12px;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
  }

  .sidebarHeader {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #e8e8e8;
  }

  .sidebarContent {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
