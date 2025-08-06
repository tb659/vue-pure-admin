<script setup lang="ts">
import { getConfig } from "@/config";
import { emitter } from "@/utils/mitt";
import { useNav } from "@/layout/hooks/useNav";
import LayI18n from "../lay-i18n/index.vue";
import { isAllEmpty } from "@pureadmin/utils";
import LaySearch from "../lay-search/index.vue";
import LayNotice from "../lay-notice/index.vue";
import LayLogout from "../lay-logout/index.vue";
import { ref, nextTick, computed, onMounted } from "vue";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LaySidebarItem from "../lay-sidebar/components/SidebarItem.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";

import Setting from "~icons/ri/settings-3-line";

const menuRef = ref();
const showLogo = ref(useSettingStoreHook().getConfigure.showLogo);

const { t, route } = useTranslationLang(menuRef);
const { title, onPanel, getLogo, backTopMenu } = useNav();

const defaultActive = computed(() => (!isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path));

nextTick(() => {
  menuRef.value?.handleResize();
});

onMounted(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});
</script>

<template>
  <div v-loading="usePermissionStoreHook().wholeMenus.length === 0" class="horizontal-header">
    <div v-if="showLogo" class="horizontal-header-left" @click="backTopMenu">
      <img :src="getLogo()" alt="logo" />
      <span>{{ title }}</span>
    </div>
    <el-menu
      ref="menuRef"
      mode="horizontal"
      popper-class="pure-scrollbar"
      class="horizontal-header-menu"
      :default-active="defaultActive"
    >
      <LaySidebarItem
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 菜单搜索 -->
      <LaySearch id="header-search" />
      <!-- 国际化 -->
      <LayI18n v-if="getConfig().ShowI18N" />
      <!-- 全屏 -->
      <LaySidebarFullScreen id="full-screen" />
      <!-- 消息通知 -->
      <LayNotice id="header-notice" />
      <!-- 退出登录 -->
      <LayLogout />
      <!-- 系统设置 -->
      <span class="set-icon navbar-bg-hover" :title="t('buttons.pureOpenSystemSet')" @click="onPanel">
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
