<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import I18n from "./i18n/index.vue";
import Logout from "./logout/index.vue";

import { getConfig } from "@/config";
import { useNav } from "@/layout/hooks/useNav";
import topMixNav from "./sidebar/topMixNav.vue";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import { useTranslationLang } from "../hooks/useTranslationLang";

import Setting from "@iconify-icons/ri/settings-3-line";

const { layout, device, onPanel, pureApp, toggleSideBar } = useNav();

const { t } = useTranslationLang();
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
    <topCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb v-if="layout !== 'topMix' && device !== 'mobile'" class="breadcrumb-container" />

    <topMixNav v-if="layout === 'topMix'" />

    <div v-if="layout === 'vertical' || layout === 'leftMix'" class="vertical-header-right">
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

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;
  }
}
</style>
