<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import { useTranslationLang } from "../../hooks/useTranslationLang";

import globalization from "@/assets/svg/globalization.svg?component";

import Check from "@iconify-icons/ep/check";

const { getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();
</script>

<template>
  <el-dropdown id="header-translation" trigger="click">
    <globalization class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none" />
    <template #dropdown>
      <el-dropdown-menu class="translation">
        <el-dropdown-item
          :style="getDropdownItemStyle(locale, 'zh')"
          :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
          @click="translationCh"
        >
          <span v-show="locale === 'zh'" class="check-zh">
            <IconifyIconOffline :icon="Check" />
          </span>
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
</template>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
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
</style>
