<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import { SHOW_I18N } from "@/utils/common";
import { useNav } from "@/layout/hooks/useNav";
import topMixNav from "./sidebar/topMixNav.vue";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import passwordUpdate from "./sidebar/passwordUpdate.vue";
import { useTranslationLang } from "../hooks/useTranslationLang";
import globalization from "@/assets/svg/globalization.svg?component";

import Check from "@iconify-icons/ep/check";
import Lock from "@iconify-icons/ri/lock-fill";
import Setting from "@iconify-icons/ri/settings-3-line";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";

const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  userAvatar,
  avatarsStyle,
  toggleSideBar,
  getDropdownItemStyle,
  getDropdownItemClass,

  passwordVisible
} = useNav();

const { t, locale, translationCh, translationEn } = useTranslationLang();
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
      <Search v-if="false" />
      <!-- 通知 -->
      <Notice v-if="false" id="header-notice" />
      <!-- 国际化 -->
      <el-dropdown id="header-translation" :class="SHOW_I18N ? '' : '!hidden'" trigger="click">
        <globalization class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none" />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline v-show="locale === 'zh'" class="check-zh" :icon="Check" />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-en">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="select-none el-dropdown-link navbar-bg-hover">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline :icon="LogoutCircleRLine" style="margin: 5px" />
              {{ t("buttons.hsLoginOut") }}
            </el-dropdown-item>
            <el-dropdown-item @click="passwordVisible = true">
              <IconifyIconOffline :icon="Lock" style="margin: 5px" />
              {{ t("login.passwordUpdate") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span class="set-icon navbar-bg-hover" :title="t('buttons.hssystemSet')" @click="onPanel">
        <IconifyIconOffline :icon="Setting" />
      </span>

      <!-- 修改密码弹窗 -->
      <password-update :visible="passwordVisible" />
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

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
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
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
