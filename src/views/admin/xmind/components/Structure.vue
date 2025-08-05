<script setup lang="ts">
/**
 * @Desc: 结构
 */
import { toRaw, ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from "vue";
import Sidebar from "./Sidebar.vue";
import { layoutList } from "simple-mind-map/src/constants/constant";
import { storeConfig } from "@/api/xmind";
import { layoutImgMap } from "../config/constant.js";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "Structure",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const layout = ref("");
const sidebar = ref(null);

watch(
  () => activeSidebar.value,
  val => {
    if (val === "structure") {
      layout.value = props.mindMap.getLayout();
      sidebar.value.show = true;
    } else {
      sidebar.value.show = false;
    }
  },
);

/**
 * @Desc: 使用主题
 */
const useLayout = _layout => {
  layout.value = _layout.value;
  // this.mindMap.setLayout(layout.value);
  // 通过toRaw拿到mindMap的原始数据
  toRaw(props.mindMap).setLayout(layout.value);
  storeConfig({
    layout: layout.value,
  });
};

const showStructureFunc = () => {
  sidebar.value.show = false;
  nextTick(() => {
    layout.value = props.mindMap.getLayout();
    sidebar.value.show = true;
  });
};
onMounted(() => {
  emitter.on("showStructure", showStructureFunc);
});
onBeforeUnmount(() => {
  emitter.on("showStructure", showStructureFunc);
});
</script>
<template>
  <Sidebar ref="sidebar" :title="$t('strusture.title')">
    <div class="layoutList" :class="{ isDark: isDark }">
      <div
        v-for="item in layoutList"
        :key="item.value"
        class="layoutItem"
        :class="{ active: item.value === layout }"
        @click="useLayout(item)"
      >
        <div class="imgBox">
          <img :src="layoutImgMap[item.value]" alt="" />
        </div>
        <div class="name">{{ item.name }}</div>
      </div>
    </div>
  </Sidebar>
</template>
<style lang="scss" scoped>
.layoutList {
  padding: 20px;

  &.isDark {
    .name {
      color: #fff;
    }
  }

  .layoutItem {
    width: 100%;
    padding-bottom: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    border: 1px solid transparent;
    border-bottom: 1px solid #e9e9e9;
    transition: all 0.2s;

    &:last-of-type {
      border: none;
    }

    &:hover {
      box-shadow:
        0 1px 2px -2px rgb(0 0 0 / 16%),
        0 3px 6px 0 rgb(0 0 0 / 12%),
        0 5px 12px 4px rgb(0 0 0 / 9%);
    }

    &.active {
      border: 1px solid #67c23a;
    }

    .imgBox {
      width: 100%;

      img {
        width: 100%;
      }
    }

    .name {
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
