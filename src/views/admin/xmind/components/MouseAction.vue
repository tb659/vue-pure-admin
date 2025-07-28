<script setup lang="ts">
/**
 * @Desc: 鼠标操作设置
 */
import { computed } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { useXmindStoreHook } from "@/store/modules/xmind";

defineOptions({
  name: "MouseAction",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
  isDark: {
    type: Boolean,
  },
});

const useLeftKeySelectionRightKeyDrag = computed(() => useXmindStoreHook().getLocalConfig.useLeftKeySelectionRightKeyDrag);

function toggleAction() {
  let val = !useLeftKeySelectionRightKeyDrag.value;
  props.mindMap.updateConfig({
    useLeftKeySelectionRightKeyDrag: val,
  });
  useXmindStoreHook().setLocalConfig({
    useLeftKeySelectionRightKeyDrag: val,
  });
}
</script>
<template>
  <div class="mouseActionContainer" :class="{ isDark: isDark }">
    <el-tooltip
      class="item"
      effect="dark"
      :content="useLeftKeySelectionRightKeyDrag ? transformI18n($t('mouseAction.tip2')) : transformI18n($t('mouseAction.tip1'))"
      placement="top"
    >
      <div class="btn iconfont" :class="[useLeftKeySelectionRightKeyDrag ? 'iconmouseR' : 'iconmouseL']" @click="toggleAction" />
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.mouseActionContainer {
  display: flex;
  align-items: center;

  &.isDark {
    .btn {
      color: hsl(0deg 0% 100% / 60%);
    }
  }

  .item {
    margin-right: 12px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .btn {
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
