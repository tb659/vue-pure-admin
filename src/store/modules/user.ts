import { defineStore } from "pinia";
import {
  type UserType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal,
  setCookie,
  responsiveStorageNameSpace,
} from "../utils";
import { useCommonStoreHook } from "./common";
import { useMultiTagsStoreHook } from "./multiTags";
import { getCookie, removeToken, setToken } from "@/utils/cookie";
import { setToken as setTokenAuth } from "@/utils/auth";
import { type RefreshTokenResult, type UserResult, getLogin, refreshTokenApi } from "@/api/user";

// 获取user
export const getUser = (key = "") => {
  const userInfo = storageLocal().getItem(`${responsiveStorageNameSpace()}userInfo`);
  return userInfo ? (key ? userInfo[key] : userInfo) : null;
};

export const useUserStore = defineStore(`${responsiveStorageNameSpace()}store_user`, {
  state: (): UserType => ({
    // 头像
    avatar: getUser("avatar") ?? "",
    // 用户名
    username: getUser("username") ?? "",
    // 昵称
    nickname: getUser("nickname") ?? "",
    // 页面级别权限
    roles: getUser("roles") ?? [],
    // 按钮级别权限
    permissions: getUser("permissions") ?? [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7,
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data?.success) setToken(data.data);
            resolve(data.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 登入 */
    async login(loginInfo, beforeRequestCallback, singleSignCode = "") {
      // 动态引入 loginApi
      const { loginApi } = await import("@/api/login");
      return new Promise((resolve, reject) => {
        const request = singleSignCode
          ? loginApi.loginByCode<UserData>(singleSignCode)
          : loginApi.login<UserData>(loginInfo, beforeRequestCallback);
        request
          .then(res => {
            handle(this, res?.data, resolve, reject);
          })
          .catch(error => {
            reject(error);
          });
      });
      async function handle(_this, data, resolve, reject, error = null) {
        if (data) {
          _this.userInfo = data;
          _this.username = data.realName;
          data.sex = data.sex * 1; // 字符串改为数组
          storageLocal().setItem(`${responsiveStorageNameSpace()}userInfo`, data);
          let time = data.expireTime;
          isNaN(+time) && (time = parseInt((new Date(time).getTime() - Date.now()) / 1000 / 60) + "");
          setCookie(`${responsiveStorageNameSpace()}loginExpireMinutes`, time);
          setCookie(`${responsiveStorageNameSpace()}loginTime`, Date.now());
          // 初始化数据
          await useCommonStoreHook().init();
          resolve(data);
        } else {
          reject(error);
        }
      }
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(response => {
            if (response.data) {
              setTokenAuth({
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
                expires: response.data.data.expires,
              });
              resolve(response.data);
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
      storageLocal().removeItem(`${responsiveStorageNameSpace()}userInfo`);
      resetRouter();
    },
    /** 更换token */
    async changeToken() {
      // 动态引入 loginApi
      const { loginApi } = await import("@/api/login");
      return new Promise(resolve => {
        loginApi.changeToken({}).then(({ data }) => {
          !getCookie(`${responsiveStorageNameSpace()}loginExpireMinutes`) &&
            setCookie(`${responsiveStorageNameSpace()}loginExpireMinutes`, 120);
          setCookie(`${responsiveStorageNameSpace()}loginTime`, Date.now());
          setToken(data);
          resolve(data);
        });
      });
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
