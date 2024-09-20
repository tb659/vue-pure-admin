<script setup lang="ts">
import extraIcon from "./extraIcon.vue";
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import I18n from "../i18n/index.vue";
import Logout from "../logout/index.vue";

import { getConfig } from "@/config";
import { isAllEmpty } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { ref, toRaw, watch, onMounted, nextTick } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "@/store/modules/permission";

import Setting from "@iconify-icons/ri/settings-3-line";

const menuRef = ref();
const defaultActive = ref(null);

const { t, route } = useTranslationLang(menuRef);
const { device, routers, onPanel, menuSelect, resolvePath, getDivStyle } = useNav();

function getDefaultActive(routePath) {
  const wholeMenus = usePermissionStoreHook().wholeMenus;
  /** 当前路由的父级路径 */
  const parentRoutes = getParentPaths(routePath, wholeMenus)[0];
  defaultActive.value = !isAllEmpty(route.meta?.activePath)
    ? route.meta.activePath
    : findRouteByPath(parentRoutes, wholeMenus)?.children[0]?.path;
}

onMounted(() => {
  getDefaultActive(route.path);
});

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => [route.path, usePermissionStoreHook().wholeMenus],
  () => {
    getDefaultActive(route.path);
  }
);
</script>

<template>
  <div v-if="device !== 'mobile'" v-loading="usePermissionStoreHook().wholeMenus.length === 0" class="horizontal-header">
    <el-menu
      ref="menuRef"
      router
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <el-menu-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :index="resolvePath(route) || route.redirect"
      >
        <template #title>
          <div v-if="toRaw(route.meta.icon)" :class="['sub-menu-icon', route.meta.icon]">
            <component :is="useRenderIcon(route.meta && toRaw(route.meta.icon))" />
          </div>
          <div :style="getDivStyle">
            <span class="select-none">
              {{ transformI18n(route.meta.title) }}
            </span>
            <extraIcon :extra-icon="route.meta.extraIcon" />
          </div>
        </template>
      </el-menu-item>
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 菜单搜索 -->
      <Search v-if="getConfig().ShowSearch" />
      <!-- 通知 -->
      <Notice v-if="getConfig().ShowNotice" id="header-notice" />
      <!-- 国际化 -->
      <I18n v-if="getConfig().ShowI18N" />
      <!-- 退出登录 -->
      <Logout />
      <!-- 系统设置 -->
      <span
        v-if="getConfig().ShowSystemSettings"
        class="set-icon navbar-bg-hover"
        :title="t('buttons.hssystemSet')"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>
