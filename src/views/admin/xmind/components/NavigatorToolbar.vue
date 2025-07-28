<script setup lang="ts">
/**
 * @Desc: 导航器工具栏
 */
import Scale from "./Scale.vue";
import Search from "./Search.vue";
import Fullscreen from "./Fullscreen.vue";
import MouseAction from "./MouseAction.vue";
import { langList } from "../config";
import { emitter } from "@/utils/mitt";
import { ref, defineProps, computed, nextTick } from "vue";
import { storeLang, getLang } from "@/api/xmind";
import { useXmindStoreHook } from "@/store/modules/xmind";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";

defineOptions({
  name: "NavigatorToolbar",
});

const props = defineProps({
  mindMap: {
    type: Object,
  },
});

const { translationCh, translationEn } = useTranslationLang();
const openMiniMap = ref(false);
const lang = ref(getLang());
const isDark = computed(() => useXmindStoreHook().getIsDark);
const isReadonly = computed(() => useXmindStoreHook().getIsReadonly);
nextTick(() => props.mindMap.setMode(isReadonly.value ? "readonly" : "edit"));

const readonlyChange = () => {
  useXmindStoreHook().setIsReadonly(!isReadonly.value);
  props.mindMap.setMode(isReadonly.value ? "readonly" : "edit");
};

const toggleMiniMap = () => {
  openMiniMap.value = !openMiniMap.value;
  emitter.emit("toggle_mini_map", openMiniMap.value);
};

const onLangChange = lang => {
  lang === "zh" ? translationCh() : translationEn();
  storeLang(lang);
};

const showSearch = () => {
  emitter.emit("show_search");
};

const toggleDark = () => {
  useXmindStoreHook().setIsDark(!isDark.value);
};
</script>
<template>
  <div class="navigatorContainer" :class="{ isDark: isDark }">
    <!-- 中英文 -->
    <div v-show="false" class="item">
      <el-select v-model="lang" size="small" style="width: 100px" @change="onLangChange">
        <el-option v-for="item in langList" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
    </div>
    <!-- 搜索 -->
    <div class="item">
      <div class="btn iconfont iconsousuo" @click="showSearch" />
      <Search v-if="mindMap" :mindMap="mindMap" />
    </div>
    <!-- 鼠标左右键 -->
    <div class="item">
      <MouseAction :isDark="isDark" :mindMap="mindMap" />
    </div>
    <!-- 迷你地图 -->
    <div v-show="false" class="item">
      <el-tooltip
        effect="dark"
        :content="openMiniMap ? $t('navigatorToolbar.closeMiniMap') : $t('navigatorToolbar.openMiniMap')"
        placement="top"
      >
        <div class="btn iconfont icondaohang1" @click="toggleMiniMap" />
      </el-tooltip>
    </div>
    <!-- 只读/编辑 -->
    <div v-show="false" class="item">
      <el-tooltip
        effect="dark"
        :content="isReadonly ? $t('navigatorToolbar.edit') : $t('navigatorToolbar.readonly')"
        placement="top"
      >
        <div class="btn iconfont" :class="[isReadonly ? 'iconyanjing' : 'iconbianji1']" @click="readonlyChange" />
      </el-tooltip>
    </div>
    <!-- 全屏 -->
    <div class="item">
      <Fullscreen :isDark="isDark" :mindMap="mindMap" />
    </div>
    <!-- 缩放 -->
    <div class="item">
      <Scale :isDark="isDark" :mindMap="mindMap" />
    </div>
    <!-- 主题 -->
    <div v-show="false" class="item">
      <div class="btn iconfont" :class="[isDark ? 'iconmoon_line' : 'iconlieri']" @click="toggleDark" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigatorContainer {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  font-size: 12px;
  background: hsl(0deg 0% 100% / 80%);
  border-radius: 5px;
  opacity: 0.8;

  &.isDark {
    background: #262a2e;

    .item {
      a {
        color: hsl(0deg 0% 100% / 60%);
      }

      .btn {
        color: hsl(0deg 0% 100% / 60%);
      }
    }
  }

  .item {
    margin-right: 20px;

    &:last-of-type {
      margin-right: 0;
    }

    .btn {
      font-size: 18px;
      cursor: pointer;
    }
  }
}

@media screen and (width <= 590px) {
  .navigatorContainer {
    left: 20px;
    overflow-x: auto;
  }
}
</style>
