<script setup lang="ts">
import passwordUpdate from "./passwordUpdate.vue";

import { useNav } from "@/layout/hooks/useNav";
import { useTranslationLang } from "../../hooks/useTranslationLang";

import Lock from "@iconify-icons/ri/lock-fill";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";

const { t } = useTranslationLang();
const { username, passwordVisible, logout, userAvatar, avatarsStyle } = useNav();
</script>

<template>
  <div>
    <el-dropdown trigger="click">
      <span class="select-none el-dropdown-link navbar-bg-hover">
        <img :src="userAvatar" :style="avatarsStyle" />
        <p v-if="username" class="dark:text-white">
          <span class="text-black">欢迎您，</span>
          <span>{{ username }}</span>
        </p>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="logout">
          <el-dropdown-item @click="passwordVisible = true">
            <IconifyIconOffline :icon="Lock" style="margin: 5px" />
            {{ t("login.passwordUpdate") }}
          </el-dropdown-item>
          <el-dropdown-item @click="logout">
            <IconifyIconOffline :icon="LogoutCircleRLine" style="margin: 5px" />
            {{ t("buttons.hsLoginOut") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 修改密码弹窗 -->
    <password-update :visible="passwordVisible" />
  </div>
</template>

<style lang="scss" scoped>
.logout {
  width: 114px;

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
