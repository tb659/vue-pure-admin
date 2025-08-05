<script setup lang="ts">
/**
 * @Desc: 颜色选择器
 */
import { colorList } from "../config";
import { onMounted, ref, computed, watch } from "vue";
import { useXmindStoreHook } from "@/store/modules/xmind";

defineOptions({
  name: "Color",
});

const props = defineProps({
  color: {
    type: String,
  },
});
const emit = defineEmits(["change"]);

const colorListData = ref([]);
const selectColor = ref("");
const isDark = computed(() => useXmindStoreHook().getIsDark);

watch(
  () => props.color,
  val => {
    selectColor.value = val;
  },
);
/**
 * @Desc: 点击预设颜色
 */
function clickColorItem(color) {
  emit("change", color);
}

/**
 * @Desc: 修改颜色
 */
function changeColor() {
  emit("change", selectColor.value);
}

onMounted(() => {
  colorListData.value = colorList;
});
</script>
<template>
  <div class="colorContainer" :class="{ isDark: isDark }">
    <div class="colorList">
      <span
        v-for="item in colorListData"
        :key="item"
        class="colorItem iconfont"
        :style="{ backgroundColor: item }"
        :class="{ icontouming: item === 'transparent' }"
        @click="clickColorItem(item)"
      />
    </div>
    <div class="moreColor">
      <span>{{ $t("color.moreColor") }}</span>
      <el-color-picker v-model="selectColor" size="small" @change="changeColor" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.colorContainer {
  &.isDark {
    .moreColor {
      color: hsl(0deg 0% 100% / 60%);
    }
  }
}

.colorList {
  display: flex;
  flex-wrap: wrap;
  width: 240px;

  .colorItem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }
}

.moreColor {
  display: flex;
  align-items: center;

  span {
    margin-right: 5px;
  }
}
</style>
