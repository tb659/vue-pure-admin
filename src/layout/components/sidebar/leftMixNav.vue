<script setup lang="ts">
import { getConfig, responsiveStorageNameSpace } from "@/config";
import Logo from "./logo.vue";
import { emitter } from "@/utils/mitt";
import SidebarItem from "./sidebarItem.vue";
import leftCollapse from "./leftCollapse.vue";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { storageLocal } from "@pureadmin/utils";
import { GROUP_MENU } from "@/utils/common";
import { useRoute, useRouter } from "vue-router";
import { MenuData } from "@/api/system/menu/types";
import { useAppStoreHook } from "@/store/modules/app";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { findRouteByPath, getParentPaths } from "@/router/utils";
import { ref, computed, watch, onBeforeMount, toRaw } from "vue";
import { usePermissionStoreHook } from "@/store/modules/permission";

import PushpinLine from "@iconify-icons/ri/pushpin-line";
import PushpinFill from "@iconify-icons/ri/pushpin-fill";

const route = useRoute();
const router = useRouter();
const showLogo = ref(
  storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.showLogo ?? getConfig().ShowLogo
);
const mixMenuTrigger = ref(
  storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.mixMenuTrigger ?? getConfig().MixMenuTrigger
);
const leftMixNavFixed = computed(() => useAppStoreHook().leftMixNavFixed);

const menuRef = ref();
const subMenuData = ref([]);
const defaultMenu = ref("");
const isSubMenu = ref(false);
const parentRoute = ref<MenuData>(null);
const visible = ref(false);
const isOpenSubMenu = ref(leftMixNavFixed.value ? true : false);
const groupMenu = ref(GROUP_MENU);

const iconClass = computed(() => {
  return ["w-[20px]", "h-[20px]", "!mr-[10px]", "text-primary", "cursor-pointer", "duration-[100ms]", "dark:hover:!text-white"];
});

const {
  title,
  routers,
  device,
  pureApp,
  isCollapse,
  getDivStyle,
  getSubTextStyle,
  tooltipEffect,
  menuSelect,
  toggleSideBar,
  overflowSlice,
  menuTextRef,
  hoverMenu,
  resolvePath
} = useNav();

const getElMenuItemClass = computed(() => {
  return (routeItem): string[] => {
    return routeItem?.children?.some(item => item.path === route.path) ? ["!h-full", "is-active-menu"] : ["!h-full"];
  };
});

const menuData = computed(() => {
  return pureApp.layout === "topMix" && device.value !== "mobile" ? subMenuData.value : usePermissionStoreHook().wholeMenus;
});

const loading = computed(() => (pureApp.layout === "topMix" ? false : menuData.value.length === 0 ? true : false));

function getParentRoute(path: string) {
  // path的上级路由组成的数组
  const parentPathArr = getParentPaths(path, usePermissionStoreHook().wholeMenus);
  // 当前路由的路由信息
  return findRouteByPath(parentPathArr[0] || path, usePermissionStoreHook().wholeMenus);
}

function getSubMenuData(path: string, type = "") {
  parentRoute.value = getParentRoute(path);
  isSubMenu.value = getParentRoute(route.path)?.children?.length > 1;
  if (!parentRoute?.value?.children) return;
  subMenuData.value = parentRoute.value["children"];
  subMenuSet(path, type);
  device.value === "mobile" && toggleSideBar();
}

function subMenuSet(path: string, type: string) {
  // 一级菜单没有子菜单
  if (subMenuData.value.length <= 1) {
    // 关闭子菜单，页面跳转
    isOpenSubMenu.value = false;
    return router.push(path);
  }

  if (type === "init") {
    isOpenSubMenu.value = leftMixNavFixed.value;
  } else if ((type === "change" && leftMixNavFixed.value) || type === "click") {
    isOpenSubMenu.value = true;
  }
}
/** 触发混合子菜单方式 */
function getSubMenuItemEvents(path: string) {
  if (mixMenuTrigger.value === "hover") {
    // 当前路由的路由信息
    const parentRoute = getParentRoute(path);
    if (parentRoute?.children?.length > 1) {
      return { onMouseenter: () => getSubMenuData(path, "click") };
    }
  }
  return { onClick: () => getSubMenuData(path, "click") };
}

/** 如果没有固定且鼠标移开则关闭 */
function closeSubMenu() {
  const parent = getParentRoute(route.path);
  setTimeout(() => {
    if (
      !leftMixNavFixed.value ||
      (parent?.children?.length <= 1 &&
        !parent.redirect?.includes("group") &&
        !groupMenu.value.some(item => parent.path.includes(item)))
    ) {
      isOpenSubMenu.value = false;
    }
    // 移除鼠标恢复当前菜单
    if (parent?.children[0]?.path && subMenuData.value[0]?.path && parent?.children[0]?.path !== subMenuData.value[0]?.path) {
      parentRoute.value = parent;
      subMenuData.value = parentRoute.value.children;
    }
  }, 0);
}

/* 子菜单固定切换 */
const toggleFixed = () => {
  pureApp.toggleLeftMixSubMenuFixed(!leftMixNavFixed.value);
};

/* 初始化获取子菜单 */
getSubMenuData(route.path, "init");

onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
  emitter.on("mixMenuTrigger", key => {
    mixMenuTrigger.value = key;
  });
  defaultMenu.value = route.path;
});

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    getSubMenuData(route.path, "change");
    menuSelect(route.path, routers);
  }
);
</script>

<template>
  <div
    v-loading="loading"
    :class="['sidebar-container', showLogo ? 'has-logo' : '', leftMixNavFixed && isSubMenu ? 'sub-menu-fixed' : '']"
    @mouseleave="closeSubMenu"
  >
    <Logo v-if="showLogo || pureApp.layout === 'leftMix'" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" :class="[device === 'mobile' ? 'mobile' : 'pc']">
      <el-menu ref="menuRef" mode="vertical" class="left-mix-menu" :default-active="defaultMenu">
        <el-menu-item
          v-for="routeItem in usePermissionStoreHook().wholeMenus"
          :key="routeItem.path"
          :index="resolvePath(routeItem) || routeItem.redirect"
          v-bind="getSubMenuItemEvents(routeItem.path)"
        >
          <template #title>
            <div :class="getElMenuItemClass(routeItem)">
              <div v-if="toRaw(routeItem.meta.icon)" :class="['sub-menu-icon', routeItem.meta.icon]">
                <component :is="useRenderIcon(routeItem.meta && toRaw(routeItem.meta.icon))" />
              </div>
              <div v-if="!isCollapse" :style="getDivStyle">
                <el-tooltip
                  popper-style="pointer-events: none"
                  placement="top"
                  :effect="tooltipEffect"
                  :offset="-10"
                  :disabled="!routeItem.showTooltip"
                >
                  <template #content>
                    {{ transformI18n(routeItem.meta.title) }}
                  </template>
                  <span ref="menuTextRef" :style="getSubTextStyle" @mouseover="hoverMenu(routeItem)">
                    {{ overflowSlice(transformI18n(routeItem.meta.title), routeItem) }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>

    <div :style="{ width: isOpenSubMenu ? '180px' : '0' }" class="left-mix-sub-item">
      <div class="flex items-center justify-between sidebar-wrap">
        <div class="sidebar-title">{{ title }}</div>
        <el-tooltip
          popper-style="pointer-events: none"
          placement="bottom"
          :visible="visible"
          :effect="tooltipEffect"
          :content="leftMixNavFixed ? '取消固定' : '点击固定'"
        >
          <IconifyIconOffline
            :icon="leftMixNavFixed ? PushpinFill : PushpinLine"
            :class="iconClass"
            @click="toggleFixed"
            @mouseenter="visible = true"
            @mouseleave="visible = false"
          />
        </el-tooltip>
      </div>
      <el-scrollbar
        v-if="subMenuData.length > 1"
        wrap-class="scrollbar-wrapper"
        :class="[, device === 'mobile' ? 'mobile' : 'pc']"
      >
        <el-menu
          router
          mode="vertical"
          class="select-none outer-most"
          :unique-opened="false"
          :default-active="route.path"
          :collapse-transition="false"
          @select="indexPath => menuSelect(indexPath, routers)"
        >
          <sidebar-item
            v-for="routes in subMenuData"
            :key="routes.path"
            :item="routes"
            :base-path="routes.path"
            class="select-none outer-most"
          />
        </el-menu>
      </el-scrollbar>
    </div>

    <leftCollapse v-if="device !== 'mobile'" :is-active="pureApp.sidebar.opened" @toggle-click="toggleSideBar" />
  </div>
</template>

<style scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}
</style>
