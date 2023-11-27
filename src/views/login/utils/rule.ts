import type { FormRules } from "element-plus";
import { reactive } from "vue";
import { $t, transformI18n } from "@/plugins/i18n";
// import { useUserStoreHook } from "@/store/modules/user";

/** 登录校验 */
const loginRules = reactive<FormRules>({
  username: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.usernameReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.passwordReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  code: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.verifyCodeReg"))));
          // } else if (useUserStoreHook().code !== value) {
          //   callback(new Error(transformI18n($t("login.verifyCodeCorrectReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
