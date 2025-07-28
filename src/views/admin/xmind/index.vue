<script setup lang="ts">
import { getLocalConfig } from "@/api/xmind";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { onBeforeMount, ref, watch, computed } from "vue";
import Edit from "./components/Edit.vue";
// import { hideLoading, showLoading } from "@/utils/loading";

defineOptions({
  name: "Xmind",
});

const show = ref(false);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const activeSidebar = computed(() => useXmindStoreHook().getActiveSidebar);
const localConfig = computed(() => useXmindStoreHook().getLocalConfig);

function initLocalConfig() {
  let config = getLocalConfig();
  if (config) {
    useXmindStoreHook().setLocalConfig({
      ...useXmindStoreHook().getLocalConfig,
      ...config,
    });
  }
}
function setBodyDark() {
  isDark.value ? document.body.classList.add("isDark") : document.body.classList.remove("isDark");
}

watch(
  () => useXmindStoreHook().getIsDark,
  () => {
    setBodyDark();
  },
);
onBeforeMount(async () => {
  initLocalConfig();
  await useXmindStoreHook().getUserMindMapData();
  show.value = true;
  setBodyDark();
});
</script>

<template>
  <div class="container" :class="{ isDark: isDark, activeSidebar: activeSidebar }">
    <Edit v-if="show" />
  </div>
</template>

<style lang="scss" scoped>
body {
  &.isDark {
    /* el-button */
    .el-button {
      color: hsl(0deg 0% 100% / 90%);
      background-color: #363b3f;
      border-color: hsl(0deg 0% 100% / 10%);
    }

    /* el-input */
    .el-input__inner {
      color: hsl(0deg 0% 100% / 90%);
      background-color: #363b3f;
      border-color: hsl(0deg 0% 100% / 10%);
    }

    .el-input.is-disabled .el-input__inner {
      color: hsl(0deg 0% 100% / 30%);
      background-color: #363b3f;
      border-color: hsl(0deg 0% 100% / 10%);
    }

    .el-input-group__append,
    .el-input-group__prepend {
      background-color: #363b3f;
      border-color: hsl(0deg 0% 100% / 10%);
    }

    .el-input-group__append button.el-button {
      color: hsl(0deg 0% 100% / 90%);
    }

    /* el-select */
    .el-select-dropdown {
      background-color: #36393d;
      border-color: hsl(0deg 0% 100% / 10%);

      .el-select-dropdown__item {
        color: hsl(0deg 0% 100% / 60%);
      }

      .el-select-dropdown__item.selected {
        color: #409eff;
      }

      .el-select-dropdown__item.hover,
      .el-select-dropdown__item:hover {
        background-color: hsl(0deg 0% 100% / 5%);
      }
    }

    .el-select .el-input.is-disabled .el-input__inner:hover {
      border-color: hsl(0deg 0% 100% / 10%);
    }

    /* el-popper */
    .el-popper {
      background-color: #36393d;
      border-color: hsl(0deg 0% 100% / 10%);
    }

    .el-popper[x-placement^="bottom"] .popper__arrow {
      background-color: #36393d;
    }

    .el-popper[x-placement^="bottom"] .popper__arrow::after {
      border-bottom-color: #36393d;
    }

    .el-popper[x-placement^="top"] .popper__arrow {
      background-color: #36393d;
    }

    .el-popper[x-placement^="top"] .popper__arrow::after {
      border-top-color: #36393d;
    }

    /* el-tabs */
    .el-tabs__item {
      color: hsl(0deg 0% 100% / 60%);

      &:hover,
      &.is-active {
        color: #409eff;
      }
    }

    .el-tabs__nav-wrap::after {
      background-color: hsl(0deg 0% 100% / 60%);
    }

    /* el-slider */
    .el-slider__runway {
      background-color: hsl(0deg 0% 100% / 60%);
    }

    /* el-radio-group */
    .el-radio-group {
      .el-radio-button__inner {
        color: hsl(0deg 0% 100% / 60%);
        background-color: #36393d;
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #fff;
        background-color: #409eff;
      }
    }

    /* el-dialog */
    .el-dialog {
      background-color: #262a2e;

      .el-dialog__header {
        border-bottom: 1px solid hsl(0deg 0% 100% / 10%);
      }

      .el-dialog__title {
        color: hsl(0deg 0% 100% / 90%);
      }

      .el-dialog__body {
        background-color: #262a2e;
      }

      .el-dialog__footer {
        border-top: 1px solid hsl(0deg 0% 100% / 10%);
      }
    }

    /* el-upload */
    .el-upload__tip {
      color: #999;
    }

    /* 富文本编辑器 */
    .toastui-editor-main-container {
      background-color: #fff;
    }
  }
}
</style>
