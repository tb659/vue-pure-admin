import { App } from "vue";
import axios from "axios";

let config: object = {};
const { VITE_PUBLIC_PATH } = import.meta.env;

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string): PlatformConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

/** 获取项目动态全局配置 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return axios({
    method: "get",
    url: `${VITE_PUBLIC_PATH}platform-config.json`
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
      // 自动注入项目配置
      if (app && $config && typeof config === "object") {
        $config = Object.assign($config, config);
        app.config.globalProperties.$config = $config;
        // 设置全局配置
        setConfig($config);
      }
      return $config;
    })
    .catch(() => {
      throw "请在public文件夹下添加platform-config.json配置文件";
    });
};

export { getConfig, setConfig };

/** 平台前缀 */
export const PLATFORM_PREFIX = "mt_gtrb_";
/** 用户信息 */
export const USER_INFO = PLATFORM_PREFIX + "userInfo";
/** 登录时间 */
export const LOGIN_TIMES = PLATFORM_PREFIX + "loginTime";
/** 登录过期时间 */
export const LOGIN_EXPIRE_MINUTES = PLATFORM_PREFIX + "loginExpireMinutes";
/** 管理员用户账号root值 */
export const ADMIN_USER_ROOT = 1;
/** 管理员用户角色root值 */
export const ADMIN_ROLE_EMBED = 1;
/** 密码过期时间,单位：天 */
export const PASSWORD_EXPIRES = 30;
/** 系统全局页面过渡动画时间 毫秒 */
export const TRANSTION_DURATION = 200;
/** 用户信息菜单权限列表 */
export const USER_MENU_LIST_KEY = "resourceList";
/** 页面按钮权限 */
export const PAGE_BUTTON_PERMISSION_KEY = "auths";
/** 管理员用户角色root值 */
export const ADMIN_DICT_EDIT_CODE = "sys.admin.edit";
