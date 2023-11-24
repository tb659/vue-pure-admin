<script setup lang="ts">
import "animate.css";
// 引入 src/components/ReIcon/src/offlineIcon.ts 文件中所有使用addIcon添加过的本地图标
import "@/components/ReIcon/src/offlineIcon";
import { setType } from "./types";
import { useNav } from "./hooks/useNav";
import { useLayout } from "./hooks/useLayout";
import { $t, transformI18n } from "@/plugins/i18n";
import { useResizeObserver } from "@vueuse/core";
import { useAppStoreHook } from "@/store/modules/app";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { h, ref, reactive, computed, onMounted, onBeforeMount, defineComponent } from "vue";

import navbar from "./components/navbar.vue";
import tag from "./components/tag/index.vue";
import appMain from "./components/appMain.vue";
import setting from "./components/setting/index.vue";
import Vertical from "./components/sidebar/vertical.vue";
import leftMixNav from "./components/sidebar/leftMixNav.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
import backTop from "@/assets/svg/back_top.svg?component";

import SettingIcon from "@iconify-icons/ri/settings-3-line";

const appWrapperRef = ref();
const { onPanel } = useNav();

const { isDark } = useDark();
const { layout } = useLayout();
const isMobile = deviceDetection();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  device: computed(() => {
    return useAppStoreHook().device;
  }),

  contentFullScreen: computed(() => {
    return useAppStoreHook().contentFullScreen;
  }),

  hideTabs: computed(() => {
    return $storage?.configure.hideTabs;
  }),

  fixedHeader: computed(() => {
    return $storage?.configure.fixedHeader;
  }),

  hiddenSideBar: computed(() => {
    return $storage?.configure.hiddenSideBar;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === "mobile",
      tabsHidden: set.hideTabs
    };
  })
});

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  $storage.layout = {
    layout: `${layoutModel}`,
    theme: $storage.layout?.theme,
    darkMode: $storage.layout?.darkMode,
    leftMixNavFixed: $storage.layout?.leftMixNavFixed,
    contentFullScreen: $storage.layout?.contentFullScreen,
    sidebarStatus: $storage.layout?.sidebarStatus,
    epThemeColor: $storage.layout?.epThemeColor
  };
}

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize");
}

// 判断是否可自动关闭菜单栏
let isAutoCloseSidebar = true;

useResizeObserver(appWrapperRef, entries => {
  if (isMobile) return;
  const entry = entries[0];
  const { width } = entry.contentRect;
  width <= 760 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle("desktop", false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990 && !set.sidebar.isClickCollapse) {
    toggle("desktop", true);
    isAutoCloseSidebar = true;
  } else {
    toggle("desktop", false);
    isAutoCloseSidebar = false;
  }
});

const layoutHeader = defineComponent({
  render() {
    return h(
      "div",
      {
        class: { "fixed-header": set.fixedHeader },
        style: [
          set.hideTabs && layout.value.includes("horizontal")
            ? isDark.value
              ? "box-shadow: 0 1px 4px #0d0d0d"
              : "box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)"
            : ""
        ]
      },
      {
        default: () => [
          !set.contentFullScreen &&
          (layout.value.includes("vertical") || layout.value.includes("leftMix") || layout.value.includes("topMix"))
            ? h(navbar)
            : null,
          !set.hiddenSideBar && layout.value.includes("horizontal") ? h(Horizontal) : null,
          h(tag)
        ]
      }
    );
  }
});

onMounted(() => {
  if (isMobile) {
    toggle("mobile", false);
  }
});

onBeforeMount(() => {
  useDataThemeChange().dataThemeChange();
});
</script>

<template>
  <div :class="set.contentFullScreen ? 'fullscreen' : ''">
    <div :class="['app-wrapper', set.classes]">
      <div
        v-show="set.device === 'mobile' && set.sidebar.opened && layout.includes('vertical')"
        class="app-mask"
        @click="useAppStoreHook().toggleSideBar()"
      />
      <Vertical
        v-if="(layout.includes('vertical') || layout.includes('topMix')) && !set.hiddenSideBar && !set.contentFullScreen"
      />
      <leftMixNav v-if="layout.includes('leftMix') && !set.hiddenSideBar && !set.contentFullScreen" />
      <div
        :class="[
          'main-container',
          set.hiddenSideBar || set.contentFullScreen ? 'main-hidden' : '',
          set.hiddenSideBar ? 'sidebar-hidden' : ''
        ]"
      >
        <div v-if="set.fixedHeader">
          <layout-header />
          <!-- 主体内容 -->
          <app-main />
        </div>
        <el-scrollbar v-else>
          <el-backtop title="回到顶部" target=".main-container .el-scrollbar__wrap">
            <backTop />
          </el-backtop>
          <layout-header />
          <!-- 主体内容 -->
          <app-main />
        </el-scrollbar>
      </div>
      <!-- 系统设置 -->
      <setting />
      <span
        v-if="(set.contentFullScreen && !layout.includes('horizontal')) || (layout.includes('horizontal') && set.hiddenSideBar)"
        class="fullscreen-set-icon navbar-bg-hover"
        :title="transformI18n($t('buttons.hssystemSet'))"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="SettingIcon" style="color: #fff" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin clearfix {
  &::after {
    display: table;
    clear: both;
    content: "";
  }
}

.app-wrapper {
  @include clearfix;

  position: relative;
  width: 100%;
  height: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.app-mask {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}

.re-screen {
  margin-top: 12px;
}

.fullscreen-set-icon {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 99999;
  padding: 5px;
  cursor: pointer;
  background: var(--el-color-primary);
  border-radius: 4px 0 0 4px;
}
</style>
