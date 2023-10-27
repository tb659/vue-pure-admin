import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { LOGIN_EXPIRE_MINUTES, LOGIN_TIMES, USER_INFO } from "@/utils/common";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageLocal } from "@pureadmin/utils";
import { getCookie, removeToken, setCookie, setToken } from "@/utils/auth";
import { loginApi } from "@/api/login";

import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    username: storageLocal().getItem(USER_INFO)?.["username"],
    userInfo: storageLocal().getItem(USER_INFO),
    // 前端生成的验证码（按实际需求替换）
    captcha: ""
  }),
  actions: {
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(captcha: string) {
      this.captcha = captcha;
    },
    /** 登入 */
    async login(info, beforeRequestCallback) {
      return new Promise((resolve, reject) => {
        loginApi
          .login(info, beforeRequestCallback)
          .then(({ data }) => {
            if (data) {
              this.userInfo = data;
              this.username = data.username;
              storageLocal().setItem(USER_INFO, data);
              let time = data.expireTime;
              isNaN(+time) && (time = parseInt((new Date(time).getTime() - Date.now()) / 1000 / 60) + "");
              setCookie(LOGIN_EXPIRE_MINUTES, time);
              setCookie(LOGIN_TIMES, Date.now());
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 重置token */
    resetToken() {
      removeToken();
      storageLocal().removeItem(USER_INFO);
      resetRouter();
    },
    /** 更换token */
    changeToken() {
      return new Promise(resolve => {
        loginApi.changeToken({}).then(({ data }) => {
          !getCookie(LOGIN_EXPIRE_MINUTES) && setCookie(LOGIN_EXPIRE_MINUTES, 120);
          setCookie(LOGIN_TIMES, Date.now());
          setToken(data);
          resolve(data);
        });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.resetToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
