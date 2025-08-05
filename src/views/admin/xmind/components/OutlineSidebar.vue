<script setup lang="ts">
// 大纲侧边栏
import Sidebar from "./Sidebar.vue";
import Outline from "./Outline.vue";
import { ref, computed, watch } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";

defineOptions({
  name: "OutlineSidebar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const sidebar = ref(null);
const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);

watch(
  () => activeSidebar.value,
  val => {
    if (!sidebar.value) return;
    sidebar.value.show = val === "outline";
  },
  { immediate: true },
);

function onChangeToOutlineEdit() {
  useXmindStoreHook().setActiveSidebar("");
  useXmindStoreHook().setIsOutlineEdit(true);
}

function onScrollTo(y) {
  let container = sidebar.value.getEl();
  let height = container.offsetHeight;
  let top = container.scrollTop;
  if (y > top + height) {
    container.scrollTo(0, y - height / 2);
  }
}
</script>
<template>
  <Sidebar ref="sidebar" :title="$t('outline.title')">
    <div class="changeBtn" :class="{ isDark: isDark }" @click="onChangeToOutlineEdit">
      <span class="icon iconfont iconquanping1" />
    </div>
    <Outline v-if="activeSidebar === 'outline' && props.mindMap" :mindMap="props.mindMap" @scrollTo="onScrollTo" />
  </Sidebar>
</template>

<style lang="scss" scoped>
.changeBtn {
  position: absolute;
  top: 12px;
  right: 50px;
  cursor: pointer;

  &.isDark {
    color: #fff;
  }
}
</style>
