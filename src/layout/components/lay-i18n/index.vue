<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";

const { getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();

import Check from "~icons/ep/check";
import Globalization from "@/assets/svg/globalization.svg?component";
</script>

<template>
  <el-dropdown trigger="click">
    <Globalization
      class="hover:text-primary hover:bg-[transparent]! w-[20px] h-[20px] ml-1.5 cursor-pointer outline-hidden duration-300"
    />
    <template #dropdown>
      <el-dropdown-menu class="translation">
        <el-dropdown-item
          :style="getDropdownItemStyle(locale, 'zh')"
          :class="['dark:text-white!', getDropdownItemClass(locale, 'zh')]"
          @click="translationCh"
        >
          <IconifyIconOffline v-show="locale === 'zh'" class="check-zh" :icon="Check" />
          简体中文
        </el-dropdown-item>
        <el-dropdown-item
          :style="getDropdownItemStyle(locale, 'en')"
          :class="['dark:text-white!', getDropdownItemClass(locale, 'en')]"
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
