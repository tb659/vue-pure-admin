<script setup lang="ts">
import type { FormInstance } from "element-plus";
import Motion from "./utils/motion";
import { msg } from "@/utils/message";
import { useRouter } from "vue-router";
import { loginApi } from "@/api/login";
import { loginRules } from "./utils/rule";
import TypeIt from "@/components/ReTypeit";
import { config } from "@/utils/http/config";
import { useNav } from "@/layout/hooks/useNav";
import { $t, transformI18n } from "@/plugins/i18n";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { bg, avatar, illustration } from "./utils/static";
import { ReImageVerify } from "@/components/ReImageVerify";
import { PROJECT_PREFIX, SHOW_I18N } from "@/utils/common";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { /* addPathMatch, */ initRouter, getTopMenu } from "@/router/utils";
import { ref, toRaw, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import { getCookie, setLoginInfoCookie, setSingleCaptcha } from "@/utils/auth";
// import { usePermissionStoreHook } from "@/store/modules/permission";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import globalization from "@/assets/svg/globalization.svg?component";
import Check from "@iconify-icons/fa/check";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import Code from "@iconify-icons/ri/shield-keyhole-line";

defineOptions({
  name: "Login"
});

const { SINGLE_CAPTCHA } = config;
const imgCode = ref("");
const router = useRouter();
const loading = ref(false);
const remember = ref(!!getCookie(`${PROJECT_PREFIX}remember`));
const ruleFormRef = ref<FormInstance>();
const { login } = useUserStoreHook();

const { initStorage } = useLayout();
initStorage();
const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();

const ruleForm = reactive({
  username: getCookie(`${PROJECT_PREFIX}username`) || "",
  password: getCookie(`${PROJECT_PREFIX}password`) || "",
  code: ""
});

const setCaptchaCookie = res => {
  setSingleCaptcha(res.headers[SINGLE_CAPTCHA]);
};

const getCaptcha = () => {
  loginApi.getCaptcha(setCaptchaCookie).then(res => {
    console.log(res);
    imgCode.value = window.URL.createObjectURL(new Blob([res as unknown as BlobPart], { type: "image/jpeg" }));
  });
};

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      login(
        {
          username: ruleForm.username,
          password: ruleForm.password,
          captcha: ruleForm.code
        },
        beforeRequestCallback
      )
        .then(() => {
          // 记住密码
          setLoginInfoCookie(ruleForm, remember.value);
          // 获取后端路由------ start
          // ! 在 src/router/index.ts 下改动
          initRouter()
            .then(() => {
              router.push(getTopMenu(true).path);
              msg.success(transformI18n($t("login.loginSuccess")));
            })
            .catch(() => (loading.value = false));
          // 获取后端路由------ end

          // 前端静态路由------ start
          // ! 在 src/router/index.ts 下改动
          // usePermissionStoreHook().handleWholeMenus([]);
          // addPathMatch();
          // router.push(getTopMenu(true).path);
          // msg.success(transformI18n($t("login.loginSuccess")));
          // 前端静态路由------ end
        })
        .catch(() => (loading.value = false));
    } else {
      loading.value = false;
      return fields;
    }
  });
};

const beforeRequestCallback = config => {
  console.log(config);
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter" || code === "NumpadEnter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  getCaptcha();
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

watch(imgCode, value => {
  useUserStoreHook().SET_VERIFYCODE(value);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="absolute flex-c right-5 top-3">
      <!-- 主题 -->
      <el-switch v-model="dataTheme" inline-prompt :active-icon="dayIcon" :inactive-icon="darkIcon" @change="dataThemeChange" />
      <!-- 国际化 -->
      <el-dropdown :class="SHOW_I18N ? '' : '!hidden'" trigger="click">
        <globalization
          class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300"
        />
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
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">
              <TypeIt :values="[title]" :cursor="false" :speed="150" />
            </h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item prop="username">
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  :placeholder="transformI18n($t('login.username'))"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  :placeholder="transformI18n($t('login.password'))"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item prop="code">
                <el-input
                  v-model="ruleForm.code"
                  clearable
                  :placeholder="transformI18n($t('login.verifyCode'))"
                  :prefix-icon="useRenderIcon(Code)"
                >
                  <template #append>
                    <!-- 前端验证码 -->
                    <ReImageVerify v-if="false" v-model:code="imgCode" />
                    <!-- 后端验证码 -->
                    <img class="code opinter h-[38px]" :src="imgCode" alt="验证码" @click="getCaptcha" />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-checkbox v-model="remember">
                    {{ transformI18n($t("login.remember")) }}
                  </el-checkbox>
                </div>
                <el-button class="w-full mt-4" size="default" type="primary" :loading="loading" @click="onLogin(ruleFormRef)">
                  {{ transformI18n($t("login.login")) }}
                </el-button>
              </el-form-item>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

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
