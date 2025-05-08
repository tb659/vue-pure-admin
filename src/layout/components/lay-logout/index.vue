<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";

const { t } = useTranslationLang();
const { logout, username, userAvatar, avatarsStyle, toAccountSettings } = useNav();

import AccountSettingsIcon from "~icons/ri/user-settings-line";
import LogoutCircleRLine from "~icons/ri/logout-circle-r-line";
</script>

<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link navbar-bg-hover select-none">
      <img :src="userAvatar" :style="avatarsStyle" />
      <p v-if="username" class="dark:text-white">{{ username }}</p>
    </span>
    <template #dropdown>
      <el-dropdown-menu class="logout">
        <el-dropdown-item @click="toAccountSettings">
          <IconifyIconOffline :icon="AccountSettingsIcon" style="margin: 5px" />
          {{ t("buttons.pureAccountSettings") }}
        </el-dropdown-item>
        <el-dropdown-item @click="logout">
          <IconifyIconOffline :icon="LogoutCircleRLine" style="margin: 5px" />
          {{ t("buttons.pureLoginOut") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}

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
</style>
