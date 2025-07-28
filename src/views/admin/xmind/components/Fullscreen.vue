<script setup lang="ts">
/**
 * @Desc: 全屏
 */
import { defineProps, onMounted, watch } from "vue";
import { fullscrrenEvent, fullScreen } from "@/utils/fullScreen";
import { $t, transformI18n } from "@/plugins/i18n";

defineOptions({
  name: "Scale",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
  isDark: {
    type: Boolean,
  },
});

watch(
  () => props.mindMap,
  (val, oldVal) => {
    if (val && !oldVal) {
    }
  },
);

// 全屏查看
const toFullscreenShow = () => {
  fullScreen(props.mindMap.el);
};

// 全屏编辑
const toFullscreenEdit = () => {
  fullScreen(document.body);
};

onMounted(() => {
  document[fullscrrenEvent] = e => {
    setTimeout(() => {
      props.mindMap.resize();
    }, 1000);
  };
});
</script>

<template>
  <div class="fullscreenContainer" :class="{ isDark: isDark }">
    <!-- 全屏查看 -->
    <el-tooltip class="item" effect="dark" :content="transformI18n($t('fullscreen.fullscreenShow'))" placement="top">
      <div class="btn iconfont iconquanping" @click="toFullscreenShow" />
    </el-tooltip>
    <!-- 全屏编辑 -->
    <el-tooltip class="item" effect="dark" :content="transformI18n($t('fullscreen.fullscreenEdit'))" placement="top">
      <div v-show="false" class="btn iconfont iconquanping1" @click="toFullscreenEdit" />
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.fullscreenContainer {
  display: flex;
  align-items: center;

  &.isDark {
    .btn {
      color: hsl(0deg 0% 100% / 60%);
    }
  }

  div:first-child {
    margin-right: 12px;
  }

  .btn {
    cursor: pointer;
  }
}
</style>
