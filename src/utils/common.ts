import { responsiveStorageNameSpace } from "@/config";

/** 系统全局前缀 */
export const PROJECT_PREFIX = responsiveStorageNameSpace();
/** 系统全局是否mock数据 */
export const MOCK_REQUEST = false;
/** 登录过期时间 */
export const LOGIN_EXPIRE_MINUTES = PROJECT_PREFIX + "loginExpireMinutes";
/** 登录过期时间 */
export const LOGIN_TIMES = PROJECT_PREFIX + "loginTime";
/** 系统全局页面是否显示主题昼夜设置 */
// export const SHOW_DATA_THEME = true;
export const SHOW_DATA_THEME = false;
/** 系统全局页面是否显示国际化 */
export const SHOW_I18N = true;
// export const SHOW_I18N = false;
/** 系统全局页面过渡动画时间 毫秒 */
export const TRANSTION_DURATION = 200;
/** 密码过期时间,单位：天 */
export const PASSWORD_EXPIRES = 30;
/** 用户信息菜单权限列表 */
export const USER_MENU_LIST_KEY = "resourceList";
/** 页面按钮权限 */
export const PAGE_BUTTON_PERMISSION_KEY = "auths";
/** 用户信息 */
export const USER_INFO = PROJECT_PREFIX + "user-info";
/** 管理员用户账号root值 */
export const ADMIN_USER_ROOT = 1;
/** 管理员用户角色root值 */
export const ADMIN_ROLE_EMBED = 1;
/** 管理员用户角色root值 */
export const ADMIN_DICT_EDIT_CODE = "sys.admin.edit";
/** 禁用启用 */
export const COMMON_STATUS = { enabled: 1, disabled: 0 };
/** 菜单上级菜单 */
export const HOME_DERECTORY = [{ name: "主目录", id: 0, children: [] }];
/** 分组菜单 */
export const GROUP_MENU = [];
/** 状态信息 */
export const STATUS_TYPE = {
  ENABLED_L: "启用",
  ENABLED_V: 1,
  DISABLED_L: "禁用",
  DISABLED_V: 0
};
export const STATUS_OPTIONS = [
  {
    label: STATUS_TYPE.ENABLED_L,
    value: STATUS_TYPE.ENABLED_V,
    type: ""
  },
  {
    label: STATUS_TYPE.DISABLED_L,
    value: STATUS_TYPE.DISABLED_V,
    type: "danger"
  }
];
export const STATUS_MAP = {
  1: {
    label: STATUS_TYPE.ENABLED_L,
    value: STATUS_TYPE.ENABLED_V,
    type: ""
  },
  0: {
    label: STATUS_TYPE.DISABLED_L,
    value: STATUS_TYPE.DISABLED_V,
    type: "danger"
  },
  undefined: { label: "" }
};
/** 权限信息 */
export const AUTH_OPTIONS = [
  { label: "开", value: 1 },
  { label: "关", value: 0 }
];
/** 字典 out:外链 in:内嵌 no:否 */
export const BUILT_IN_TYPE = {
  BUILT_IN_Y_L: "系统内置",
  BUILT_IN_Y_V: 1,
  BUILT_IN_N_L: "自定义",
  BUILT_IN_N_V: 0
};
export const BUILT_IN_OPTION = [
  { label: BUILT_IN_TYPE.BUILT_IN_Y_L, value: BUILT_IN_TYPE.BUILT_IN_Y_V },
  { label: BUILT_IN_TYPE.BUILT_IN_N_L, value: BUILT_IN_TYPE.BUILT_IN_N_V }
];
export const BUILT_IN_MAP = {
  1: { label: BUILT_IN_TYPE.BUILT_IN_Y_L, value: BUILT_IN_TYPE.BUILT_IN_Y_V },
  0: { label: BUILT_IN_TYPE.BUILT_IN_N_L, value: BUILT_IN_TYPE.BUILT_IN_N_V },
  undefined: { label: "" }
};
/** 菜单外链 out:外链 in:内嵌 no:否 */
export const MENU_LINK_TYPE = {
  OUT_L: "外链",
  OUT_V: 1,
  IN_L: "内嵌",
  IN_V: 2,
  NO_L: "否",
  NO_V: 3
};
export const MENU_LINK_OPTION = [
  { label: MENU_LINK_TYPE.OUT_L, value: MENU_LINK_TYPE.OUT_V },
  { label: MENU_LINK_TYPE.IN_L, value: MENU_LINK_TYPE.IN_V },
  { label: MENU_LINK_TYPE.NO_L, value: MENU_LINK_TYPE.NO_V }
];
export const MENU_LINK_MAP = {
  1: { label: MENU_LINK_TYPE.OUT_L, value: MENU_LINK_TYPE.OUT_V },
  2: { label: MENU_LINK_TYPE.IN_L, value: MENU_LINK_TYPE.IN_V },
  3: { label: MENU_LINK_TYPE.NO_L, value: MENU_LINK_TYPE.NO_V },
  undefined: { label: "" }
};
/** 菜单类型 f:目录 m:菜单 b:按钮 */
export const MENU_TYPE = {
  F_L: "目录",
  F_V: 1,
  M_L: "菜单",
  M_V: 2,
  B_L: "按钮",
  B_V: 3
};
export const MENU_TYPE_OPTION = [
  { label: MENU_TYPE.F_L, value: MENU_TYPE.F_V, type: "warning" },
  { label: MENU_TYPE.M_L, value: MENU_TYPE.M_V, type: "success" },
  { label: MENU_TYPE.B_L, value: MENU_TYPE.B_V, type: "" }
];
export const MENU_TYPE_MAP = {
  1: { label: MENU_TYPE.F_L, value: MENU_TYPE.F_V, type: "warning" },
  2: { label: MENU_TYPE.M_L, value: MENU_TYPE.M_V, type: "success" },
  3: { label: MENU_TYPE.B_L, value: MENU_TYPE.B_V, type: "" },
  undefined: { label: "" }
};
// !-----------------------------------------------------------------------------------------------
// !----------------------------------------------弹窗宽度------------------------------------------
// !-----------------------------------------------------------------------------------------------
/** 弹窗宽度 */
export const DIALOG_WIDTH_TYPE = {
  MINI: "400px",
  SMALL: "600px",
  DEFAULT: "800px",
  MIDDLE: "1000px",
  LARGE: "1200px"
};
