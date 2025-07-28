<script setup lang="ts">
/**
 * @Desc: 放大缩小
 */
import { ref, defineProps, watch } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { Plus, Minus } from "@element-plus/icons-vue";

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

const scaleNum = ref(100);
const cacheScaleNum = ref(0);

watch(
  () => props.mindMap,
  (val, oldVal) => {
    if (val && !oldVal) {
      props.mindMap.on("scale", scale => {
        scaleNum.value = toPer(scale);
      });
      scaleNum.value = toPer(props.mindMap.view.scale);
    }
  },
);

/**
 * @Desc: 转换成百分数
 */
const toPer = scale => {
  return +(scale * 100).toFixed(0);
};

/**
 * @Desc: 缩小
 */

const narrow = () => {
  props.mindMap.view.narrow();
};

/**
 * @Desc: 放大
 */
const enlarge = () => {
  props.mindMap.view.enlarge();
};

// 聚焦时缓存当前缩放倍数
const onScaleNumInputFocus = () => {
  cacheScaleNum.value = scaleNum.value;
};

// 手动输入缩放倍数
const onScaleNumChange = () => {
  const scaleNum2 = Number(scaleNum.value);
  if (Number.isNaN(scaleNum) || scaleNum2 <= 0) {
    scaleNum.value = cacheScaleNum.value;
  } else {
    const cx = props.mindMap.width / 2;
    const cy = props.mindMap.height / 2;
    props.mindMap.view.setScale(scaleNum.value / 100, cx, cy);
  }
};
</script>

<template>
  <div class="scaleContainer" :class="{ isDark: isDark }">
    <el-tooltip class="item" effect="dark" :content="transformI18n($t('scale.zoomOut'))" placement="top">
      <el-icon class="btn" @click="narrow">
        <Minus />
      </el-icon>
    </el-tooltip>
    <div class="scaleInfo">
      <input v-model="scaleNum" type="text" @change="onScaleNumChange" @focus="onScaleNumInputFocus" />%
    </div>
    <el-tooltip class="item" effect="dark" :content="transformI18n($t('scale.zoomIn'))" placement="top">
      <el-icon class="btn" @click="enlarge">
        <Plus />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.scaleContainer {
  display: flex;
  align-items: center;

  &.isDark {
    .btn {
      color: hsl(0deg 0% 100% / 60%);
    }

    .scaleInfo {
      color: hsl(0deg 0% 100% / 60%);

      input {
        color: hsl(0deg 0% 100% / 60%);
      }
    }
  }

  .btn {
    cursor: pointer;
  }

  .scaleInfo {
    display: flex;
    align-items: center;
    margin: 0 5px;

    input {
      width: 35px;
      text-align: center;
      outline: none;
      background-color: transparent;
      border: none;
    }
  }
}
</style>
