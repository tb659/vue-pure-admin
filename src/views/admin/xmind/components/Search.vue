<script setup lang="ts">
// 搜索替换
import { Close, Search, EditPen } from "@element-plus/icons-vue";
import { isUndef } from "simple-mind-map/src/utils/index";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
import { emitter } from "@/utils/mitt";

defineOptions({
  name: "Search2",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const searchInputRef = ref(null);
const replaceInputRef = ref(null);
const show = ref(false);
const showReplaceInput = ref(false);
const showSearchInfo = ref(false);
const searchText = ref("");
const replaceText = ref("");
const currentIndex = ref(0);
const total = ref(0);
const isDark = computed(() => useXmindStoreHook().getIsDark);
const isReadonly = computed(() => useXmindStoreHook().isReadonly);

watch(
  () => searchText.value,
  value => {
    if (isUndef(value)) {
      currentIndex.value = 0;
      total.value = 0;
      showSearchInfo.value = false;
    }
  },
);
onBeforeMount(() => {
  emitter.on("show_search", showSearch);
  props.mindMap.on("search_info_change", handleSearchInfoChange);
  props.mindMap.keyCommand.addShortcut("Control+f", showSearch);
});

onBeforeUnmount(() => {
  emitter.off("show_search", showSearch);
  props.mindMap.off("search_info_change", handleSearchInfoChange);
  props.mindMap.keyCommand.removeShortcut("Control+f", showSearch);
});
function handleSearchInfoChange(data) {
  currentIndex.value = data.currentIndex + 1;
  total.value = data.total;
  showSearchInfo.value = true;
}
function showSearch() {
  emitter.emit("closeSideBar");
  show.value = true;
  // searchInputRef.value.focus()
}
function hideReplaceInput() {
  showReplaceInput.value = false;
  replaceText.value = "";
}
function onMouseleave() {
  if (searchInputRef.value) {
    searchInputRef.value.blur();
  }
  if (replaceInputRef.value) {
    replaceInputRef.value.blur();
  }
}
function onSearchNext() {
  props.mindMap.search.search(searchText.value, () => {
    searchInputRef.value.focus();
  });
}
function replace() {
  props.mindMap.search.replace(replaceText.value, true);
}
function replaceAll() {
  props.mindMap.search.replaceAll(replaceText.value);
}
function close() {
  show.value = false;
  showSearchInfo.value = false;
  total.value = 0;
  currentIndex.value = 0;
  searchText.value = "";
  hideReplaceInput();
  props.mindMap.search.endSearch();
}
</script>

<template>
  <div class="searchContainer" :class="{ isDark: isDark, show: show }" @mouseleave="onMouseleave">
    <div class="closeBtnBox">
      <el-icon class="closeBtn" @click="close">
        <Close />
      </el-icon>
    </div>
    <div class="searchInputBox">
      <el-input
        ref="searchInputRef"
        v-model="searchText"
        :placeholder="transformI18n($t('searchs.searchPlaceholder'))"
        @keyup.enter.stop="onSearchNext"
        @keydown.stop
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template v-if="!isUndef(searchText)" #append>
          <el-button @click="showReplaceInput = true">
            {{ transformI18n($t("searchs.replace")) }}
          </el-button>
        </template>
      </el-input>
      <div v-if="showSearchInfo" class="searchInfo">{{ currentIndex }} / {{ total }}</div>
    </div>
    <el-input
      v-if="showReplaceInput"
      ref="replaceInputRef"
      v-model="replaceText"
      :placeholder="transformI18n($t('searchs.replacePlaceholder'))"
      style="margin: 12px 0"
      @keydown.stop
    >
      <template #prefix>
        <el-icon><EditPen /></el-icon>
      </template>
      <template v-if="!!searchText.trim()" #append>
        <el-button @click="hideReplaceInput">{{ transformI18n($t("searchs.cancel")) }}</el-button>
      </template>
    </el-input>
    <div v-if="showReplaceInput" class="btnList">
      <el-button :disabled="isReadonly" @click="replace">{{ transformI18n($t("searchs.replace")) }}</el-button>
      <el-button :disabled="isReadonly" @click="replaceAll">{{ transformI18n($t("searchs.replaceAll")) }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.searchContainer {
  position: relative;
  position: fixed;
  top: 110px;
  right: -296px;
  width: 296px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 10%);
  transition: all 0.3s;

  &.isDark {
    background-color: #363b3f;

    .closeBtnBox {
      color: #fff;
      background-color: #363b3f;
    }
  }

  &.show {
    right: 20px;
  }

  .btnList {
    display: flex;
    justify-content: flex-end;
  }

  .closeBtnBox {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 4px 16px 0 rgb(0 0 0 / 10%);

    .closeBtn {
      font-size: 16px;
    }
  }

  .searchInputBox {
    position: relative;

    .searchInfo {
      position: absolute;
      top: 50%;
      right: 70px;
      font-size: 14px;
      color: #909090;
      transform: translateY(-50%);
    }
  }
}
</style>
