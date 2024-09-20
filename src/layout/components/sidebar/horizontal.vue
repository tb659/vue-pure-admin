<script setup lang="ts">
import Search from "../search/index.vue";
import Notice from "../notice/index.vue";
import I18n from "../i18n/index.vue";
import Logout from "../logout/index.vue";

import { getConfig } from "@/config";
import SidebarItem from "./sidebarItem.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { ref, nextTick, computed, watch } from "vue";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "@/store/modules/permission";

import Setting from "@iconify-icons/ri/settings-3-line";

const menuRef = ref();

const { t, route } = useTranslationLang(menuRef);
const { title, routers, backTopMenu, onPanel, getLogo, menuSelect } = useNav();

const defaultActive = computed(() => (!isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path));

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => route.path,
  () => {
    menuSelect(route.path, routers);
  }
);
</script>

<template>
  <div v-loading="usePermissionStoreHook().wholeMenus.length === 0" class="horizontal-header">
    <div class="horizontal-header-left" @click="backTopMenu">
      <img :src="getLogo()" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu
      ref="menuRef"
      router
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
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
