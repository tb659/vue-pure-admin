<script setup lang="ts">
import { ref, unref, watch, reactive, computed, nextTick, onBeforeMount } from "vue";
import { useDark, debounce, useGlobal, storageLocal, storageSession } from "@pureadmin/utils";
import { getConfig } from "@/config";
import { useRouter } from "vue-router";
import panel from "../panel/index.vue";
import { emitter } from "@/utils/mitt";
import { resetRouter } from "@/router";
import { removeToken } from "@/utils/auth";
import { routerArrays } from "@/layout/types";
import { useNav } from "@/layout/hooks/useNav";
import { $t, transformI18n } from "@/plugins/i18n";
import { useAppStoreHook } from "@/store/modules/app";
import { toggleTheme } from "@pureadmin/theme/dist/browser-utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Check from "@iconify-icons/ep/check";
import Logout from "@iconify-icons/ri/logout-circle-r-line";

const router = useRouter();
const { isDark } = useDark();
const { device, tooltipEffect } = useNav();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const topMixRef = ref();
const leftMixRef = ref();
const verticalRef = ref();
const horizontalRef = ref();

const { dataTheme, layoutTheme, themeColors, dataThemeChange, setEpThemeColor, setLayoutThemeColor } = useDataThemeChange();

/* body添加layout属性，作用于src/style/sidebar.scss */
if (unref(layoutTheme)) {
  const layout = unref(layoutTheme).layout;
  const theme = unref(layoutTheme).theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  setLayoutModel(layout);
}

/** 默认灵动模式 */
const markValue = ref($storage.configure?.showModel ?? getConfig().ShowModel);
/** 默认点击模式 */
const menuTriggerValue = ref($storage.configure?.mixMenuTrigger ?? getConfig().MixMenuTrigger);
/** 默认logo模式 */
const logoValue = ref($storage.configure?.showLogo ?? getConfig().ShowLogo);
/** 默认不隐藏菜单 */
const hiddenSideBarValue = ref($storage.configure?.hiddenSideBar ?? getConfig().HiddenSideBar);
/** 默认固定头部 */
const fixedHeaderValue = ref($storage.configure?.fixedHeader ?? getConfig().FixedHeader);

const settings = reactive({
  greyVal: $storage.configure.grey,
  weakVal: $storage.configure.weak,
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  hideFooter: $storage.configure.hideFooter,
  fixedHeader: $storage.configure.fixedHeader,
  hiddenSideBar: $storage.configure.hiddenSideBar,
  mixMenuTrigger: $storage.configure.mixMenuTrigger,
  multiTagsCache: $storage.configure.multiTagsCache
});

const contentFullScreen = computed(() => useAppStoreHook().contentFullScreen);

const getThemeColorStyle = computed(() => {
  return color => {
    return { background: color };
  };
});

/** 当网页为暗黑模式时不显示亮白色切换选项 */
const showThemeColors = computed(() => {
  return themeColor => {
    return themeColor === "light" && isDark.value ? false : true;
  };
});

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = $storage.configure;
  storageConfigure[key] = val;
  $storage.configure = storageConfigure;
}

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

/** 头部固定 */
function onFixedHeaderChange(value) {
  storageConfigureChange("fixedHeader", value);
  emitter.emit("fixedHeader", value);
}

/** 侧边栏Logo */
function logoChange() {
  unref(logoValue) ? storageConfigureChange("showLogo", true) : storageConfigureChange("showLogo", false);
  emitter.emit("logoChange", unref(logoValue));
}

/** 侧边栏隐藏 */
function onSidebarHiddenChange(value) {
  storageConfigureChange("hiddenSideBar", value);
  emitter.emit("hiddenSideBar", value);
}

/** 标签隐藏设置 */
const tagsChange = () => {
  const showVal = settings.tabsVal;
  storageConfigureChange("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal as unknown as string);
};

/** 隐藏页脚设置 */
const hideFooterChange = () => {
  const hideFooter = settings.hideFooter;
  storageConfigureChange("hideFooter", hideFooter);
};

/** 标签页持久化设置 */
const multiTagsCacheChange = () => {
  const multiTagsCache = settings.multiTagsCache;
  storageConfigureChange("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

/** 灰色模式设置 */
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  storageConfigureChange("grey", value);
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  toggleClass(settings.weakVal, "html-weakness", document.querySelector("html"));
  storageConfigureChange("weak", value);
};

/** 标签风格 */
function onChange(value) {
  storageConfigureChange("showModel", value);
  emitter.emit("tagViewsShowModel", value);
}

/** 混合菜单触发方式 */
function onMenuTriggerChange(value) {
  storageConfigureChange("mixMenuTrigger", value);
  emitter.emit("mixMenuTrigger", value);
}

/** 清空缓存并返回登录页 */
function onReset() {
  removeToken();
  storageLocal().clear();
  storageSession().clear();
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  useAppStoreHook().setLayout(Layout);
  setEpThemeColor(EpThemeColor);
  useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  router.push("/login");
  useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
  resetRouter();
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, "is-select", unref(v));
  });
}

/** 主题色 激活选择项 */
const getThemeColor = computed(() => {
  return current => {
    if (current === layoutTheme.value.theme && layoutTheme.value.theme !== "light") {
      return "#fff";
    } else if (current === layoutTheme.value.theme && layoutTheme.value.theme === "light") {
      return "#1d2b45";
    } else {
      return "transparent";
    }
  };
});

/** 设置导航模式 */
function setLayoutModel(layout: string) {
  layoutTheme.value.layout = layout;
  window.document.body.setAttribute("layout", layout);
  $storage.layout = {
    layout,
    theme: layoutTheme.value.theme,
    darkMode: $storage.layout?.darkMode,
    leftMixNavFixed: $storage.layout?.leftMixNavFixed,
    contentFullScreen: $storage.layout?.contentFullScreen,
    sidebarStatus: $storage.layout?.sidebarStatus,
    epThemeColor: $storage.layout?.epThemeColor
  };
  useAppStoreHook().setLayout(layout);
}

watch($storage, ({ layout }) => {
  switch (layout["layout"]) {
    case "vertical":
      toggleClass(true, "is-select", unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([leftMixRef]), 50);
      debounce(setFalse([topMixRef]), 50);
      break;
    case "leftMix":
      toggleClass(true, "is-select", unref(leftMixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([topMixRef]), 50);
      break;
    case "horizontal":
      toggleClass(true, "is-select", unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([leftMixRef]), 50);
      debounce(setFalse([topMixRef]), 50);
      break;
    case "topMix":
      toggleClass(true, "is-select", unref(topMixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([leftMixRef]), 50);
      break;
  }
});

onBeforeMount(() => {
  dataThemeChange();
  /* 初始化项目配置 */
  nextTick(() => {
    settings.greyVal && document.querySelector("html")?.setAttribute("class", "html-grey");
    settings.weakVal && document.querySelector("html")?.setAttribute("class", "html-weakness");
    settings.tabsVal && tagsChange();
    settings.hideFooter && hideFooterChange();
  });
});
</script>

<template>
  <panel>
    <el-divider>{{ transformI18n($t("apps.darkmode")) }}</el-divider>
    <el-switch
      v-model="dataTheme"
      inline-prompt
      class="pure-datatheme"
      :active-icon="dayIcon"
      :inactive-icon="darkIcon"
      @change="dataThemeChange"
    />

    <el-divider>{{ transformI18n($t("apps.navigationMode")) }}</el-divider>
    <ul class="pure-theme">
      <el-tooltip
        :effect="tooltipEffect"
        class="item"
        :content="transformI18n($t('apps.leftMenuMode'))"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li :class="layoutTheme.layout === 'vertical' ? 'is-select' : ''" ref="verticalRef" @click="setLayoutModel('vertical')">
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip
        v-if="device !== 'mobile'"
        :effect="tooltipEffect"
        class="item"
        :content="transformI18n($t('apps.leftMixMenuMode'))"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li :class="layoutTheme.layout === 'leftMix' ? 'is-select' : ''" ref="leftMixRef" @click="setLayoutModel('leftMix')">
          <div />
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip
        v-if="device !== 'mobile'"
        :effect="tooltipEffect"
        class="item"
        :content="transformI18n($t('apps.topMenuMode'))"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li
          ref="horizontalRef"
          :class="layoutTheme.layout === 'horizontal' ? 'is-select' : ''"
          @click="setLayoutModel('horizontal')"
        >
          <div />
          <div />
        </li>
      </el-tooltip>

      <el-tooltip
        v-if="device !== 'mobile'"
        :effect="tooltipEffect"
        class="item"
        :content="transformI18n($t('apps.topMixMenuMode'))"
        placement="bottom"
        popper-class="pure-tooltip"
      >
        <li :class="layoutTheme.layout === 'topMix' ? 'is-select' : ''" ref="topMixRef" @click="setLayoutModel('topMix')">
          <div />
          <div />
        </li>
      </el-tooltip>
    </ul>

    <el-divider>{{ transformI18n($t("apps.systemTheme")) }}</el-divider>
    <ul class="theme-color">
      <li
        v-for="(item, index) in themeColors"
        v-show="showThemeColors(item.themeColor)"
        :key="index"
        :style="getThemeColorStyle(item.color)"
        @click="setLayoutThemeColor(item.themeColor)"
      >
        <el-icon style="margin: 0.1em 0.1em 0 0" :size="17" :color="getThemeColor(item.themeColor)">
          <IconifyIconOffline :icon="Check" />
        </el-icon>
      </li>
    </ul>

    <el-divider>{{ transformI18n($t("apps.interfaceDisplay")) }}</el-divider>
    <ul class="setting">
      <li>
        <span class="dark:text-white">
          {{ transformI18n($t("apps.fixedHeader")) }}
        </span>
        <el-switch
          v-model="fixedHeaderValue"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          inactive-color="#a6a6a6"
          :active-text="transformI18n($t('apps.on'))"
          :inactive-text="transformI18n($t('apps.off'))"
          @change="onFixedHeaderChange"
        />
      </li>
      <li>
        <span class="dark:text-white">
          {{ transformI18n($t("apps.sidebarLogo")) }}
        </span>
        <el-switch
          v-model="logoValue"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="logoChange"
          :disabled="layoutTheme.layout === 'leftMix' || layoutTheme.layout === 'horizontal' || contentFullScreen"
        />
      </li>
      <li>
        <span class="dark:text-white">
          {{ transformI18n($t("apps.hiddenSideBar")) }}
        </span>
        <el-switch
          v-model="hiddenSideBarValue"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          inactive-color="#a6a6a6"
          :active-text="transformI18n($t('apps.on'))"
          :inactive-text="transformI18n($t('apps.off'))"
          @change="onSidebarHiddenChange"
        />
      </li>
      <li>
        <span class="dark:text-white">
          {{ transformI18n($t("apps.hideTab")) }}
        </span>
        <el-switch
          v-model="settings.tabsVal"
          inline-prompt
          inactive-color="#a6a6a6"
          :active-text="transformI18n($t('apps.on'))"
          :inactive-text="transformI18n($t('apps.off'))"
          @change="tagsChange"
        />
      </li>
      <li>
        <span class="dark:text-white">{{ transformI18n($t("apps.hiddenFooter")) }}</span>
        <el-switch
          v-model="settings.hideFooter"
          inline-prompt
          inactive-color="#a6a6a6"
          :active-text="transformI18n($t('apps.on'))"
          :inactive-text="transformI18n($t('apps.off'))"
          @change="hideFooterChange"
        />
      </li>
      <li>
        <span class="dark:text-white">标签页持久化</span>
        <el-switch
          v-model="settings.multiTagsCache"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          @change="multiTagsCacheChange"
        />
      </li>
      <li>
        <span class="dark:text-white"> {{ transformI18n($t("apps.grayMode")) }}</span>
        <el-switch
          v-model="settings.greyVal"
          inline-prompt
          inactive-color="#a6a6a6"
          :active-text="transformI18n($t('apps.on'))"
          :inactive-text="transformI18n($t('apps.off'))"
          @change="greyChange"
        />
      </li>
      <li>
        <span class="dark:text-white"> {{ transformI18n($t("apps.colorWeakMode")) }}</span>
        <el-switch
          v-model="settings.weakVal"
          inline-prompt
          inactive-color="#a6a6a6"
          :active-text="transformI18n($t('apps.on'))"
          :inactive-text="transformI18n($t('apps.off'))"
          @change="weekChange"
        />
      </li>
      <li>
        <span class="dark:text-white">{{ transformI18n($t("apps.tabStyle")) }}</span>
        <el-radio-group v-model="markValue" size="small" @change="onChange">
          <el-radio label="card">{{ transformI18n($t("apps.card")) }}</el-radio>
          <el-radio label="smart">
            {{ transformI18n($t("apps.smart")) }}
          </el-radio>
        </el-radio-group>
      </li>
      <li>
        <span class="dark:text-white">{{ transformI18n($t("apps.menuTrigger")) }}</span>
        <el-radio-group
          v-model="menuTriggerValue"
          size="small"
          @change="onMenuTriggerChange"
          :disabled="layoutTheme.layout !== 'leftMix'"
        >
          <el-radio label="click">{{ transformI18n($t("apps.click")) }}</el-radio>
          <el-radio label="hover">
            {{ transformI18n($t("apps.hover")) }}
          </el-radio>
        </el-radio-group>
      </li>
    </ul>

    <el-divider />
    <el-button type="danger" style="width: 90%; margin: 24px 15px" @click="onReset">
      <IconifyIconOffline :icon="Logout" width="15" height="15" style="margin-right: 4px" />
      {{ transformI18n($t("apps.clearCacheAndToTheLoginPage")) }}
    </el-button>
  </panel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  width: 100%;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 25px;
  }
}

.pure-datatheme {
  display: block;
  width: 100%;
  height: 50px;
  padding-top: 25px;
  text-align: center;
}

.pure-theme {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  margin-top: 25px;

  li {
    position: relative;
    width: 18%;
    height: 45px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(3) {
          position: absolute;
          top: 0;
          left: 16px;
          width: 8px;
          height: 45px;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(4) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}

.theme-color {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 20px;

  li {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;

    &:nth-child(2) {
      border: 1px solid #ddd;
    }
  }
}
</style>
