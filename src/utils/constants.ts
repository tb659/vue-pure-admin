// !----------------------------------------------系统设置-------------------------------------------
// !----------------------------------------------系统设置-------------------------------------------
// !----------------------------------------------系统设置-------------------------------------------

/** token */
export const TOKEN_KEY = "Authorization";
/** 验证码 */
export const SINGLE_CAPTCHA = "_single_captcha_";
/** 管理员用户账号root值 */
export const ADMIN_USER_ROOT = 1;
/** 普通用户账号root值 */
export const MEMBER_USER_ROOT = 0;
/** 管理员用户角色root值 */
export const ADMIN_ROLE_EMBED = 1;
/** 普通用户角色root值 */
export const MEMBER_ROLE_EMBED = 0;
/** 系统字典表 1-系统内置 0-自定义 */
export const DICT_EMBED = 1;
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
/** 分组菜单 */
export const GROUP_MENU = [];
/** 禁用启用 */
export const COMMON_STATUS = { enabled: 1, disabled: 0 };
/** 菜单上级菜单 */
export const HOME_DERECTORY = [{ name: "主目录", id: 0, children: [] }];
/** 权限信息 */
export const AUTH_OPTIONS = [
  { label: "开", value: 1 },
  { label: "关", value: 0 },
];
/** 状态信息 */
export const STATUS_TYPE = {
  ENABLED_L: "启用",
  ENABLED_V: 1,
  DISABLED_L: "禁用",
  DISABLED_V: 0,
};
export const STATUS_OPTIONS = [
  { label: STATUS_TYPE.ENABLED_L, value: STATUS_TYPE.ENABLED_V, type: "info" },
  { label: STATUS_TYPE.DISABLED_L, value: STATUS_TYPE.DISABLED_V, type: "danger" },
];
export const STATUS_MAP = {
  1: { label: STATUS_TYPE.ENABLED_L, value: STATUS_TYPE.ENABLED_V, type: "success" },
  0: { label: STATUS_TYPE.DISABLED_L, value: STATUS_TYPE.DISABLED_V, type: "danger" },
  undefined: { label: "--", type: "info" },
  null: { label: "--", type: "info" },
};
/** 菜单类型 f:目录 m:菜单 b:按钮 */
export const MENU_TYPE = {
  F_L: "目录",
  F_V: 1,
  M_L: "菜单",
  M_V: 2,
  B_L: "按钮",
  B_V: 3,
};
export const MENU_TYPE_OPTION = [
  { label: MENU_TYPE.F_L, value: MENU_TYPE.F_V, type: "warning" },
  { label: MENU_TYPE.M_L, value: MENU_TYPE.M_V, type: "success" },
  { label: MENU_TYPE.B_L, value: MENU_TYPE.B_V, type: "primary" },
];
export const MENU_TYPE_MAP = {
  1: { label: MENU_TYPE.F_L, value: MENU_TYPE.F_V, type: "warning" },
  2: { label: MENU_TYPE.M_L, value: MENU_TYPE.M_V, type: "success" },
  3: { label: MENU_TYPE.B_L, value: MENU_TYPE.B_V, type: "primary" },
  undefined: { label: "--", type: "info" },
};
/** 菜单外链 out:外链 in:内嵌 no:否 */
export const MENU_LINK_TYPE = {
  OUT_L: "外链",
  OUT_V: 1,
  IN_L: "内嵌",
  IN_V: 2,
  NO_L: "否",
  NO_V: 3,
};
export const MENU_LINK_OPTION = [
  { label: MENU_LINK_TYPE.OUT_L, value: MENU_LINK_TYPE.OUT_V },
  { label: MENU_LINK_TYPE.IN_L, value: MENU_LINK_TYPE.IN_V },
  { label: MENU_LINK_TYPE.NO_L, value: MENU_LINK_TYPE.NO_V },
];
export const MENU_LINK_MAP = {
  1: { label: MENU_LINK_TYPE.OUT_L, value: MENU_LINK_TYPE.OUT_V },
  2: { label: MENU_LINK_TYPE.IN_L, value: MENU_LINK_TYPE.IN_V },
  3: { label: MENU_LINK_TYPE.NO_L, value: MENU_LINK_TYPE.NO_V },
  undefined: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !------------------------------- 字典类型是否是自定义或系统内置----------------------------------
// !-----------------------------------------------------------------------------------------------
/** 系统字典表 1-系统内置 0-自定义 */
export const BUILT_IN_TYPE = {
  BUILT_IN_Y_L: "系统内置",
  BUILT_IN_Y_V: 1,
  BUILT_IN_N_L: "自定义",
  BUILT_IN_N_V: 0,
};
export const BUILT_IN_OPTION = [
  { label: BUILT_IN_TYPE.BUILT_IN_Y_L, value: BUILT_IN_TYPE.BUILT_IN_Y_V },
  { label: BUILT_IN_TYPE.BUILT_IN_N_L, value: BUILT_IN_TYPE.BUILT_IN_N_V },
];
export const BUILT_IN_MAP = {
  1: { label: BUILT_IN_TYPE.BUILT_IN_Y_L, value: BUILT_IN_TYPE.BUILT_IN_Y_V },
  0: { label: BUILT_IN_TYPE.BUILT_IN_N_L, value: BUILT_IN_TYPE.BUILT_IN_N_V },
  undefined: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !--------------------------------------------- 性别 --------------------------------------------
// !-----------------------------------------------------------------------------------------------
/** 性别 1-男 0-女 */
export const SEX_TYPE = {
  male_L: "男",
  male_V: 1,
  famle_L: "女",
  famle_V: 0,
};
export const SEX_OPTION = [
  { label: SEX_TYPE.male_L, value: SEX_TYPE.male_V },
  { label: SEX_TYPE.famle_L, value: SEX_TYPE.famle_V },
];
export const SEX_MAP = {
  1: { label: SEX_TYPE.male_L, value: SEX_TYPE.male_V },
  0: { label: SEX_TYPE.famle_L, value: SEX_TYPE.famle_V },
  undefined: { label: "--", type: "info" },
  null: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !-------------------------------------------- yes/no -------------------------------------------
// !-----------------------------------------------------------------------------------------------
/** 是/否 1-是 0-否 */
export const BOOLEAN_TYPE = {
  yes_L: "是",
  yes_V: 1,
  no_L: "否",
  no_V: 0,
};
export const BOOLEAN_OPTION = [
  { label: BOOLEAN_TYPE.yes_L, value: BOOLEAN_TYPE.yes_V, type: "success" },
  { label: BOOLEAN_TYPE.no_L, value: BOOLEAN_TYPE.no_V, type: "warning" },
];
export const BOOLEAN_MAP = {
  1: { label: BOOLEAN_TYPE.yes_L, value: BOOLEAN_TYPE.yes_V, type: "success" },
  0: { label: BOOLEAN_TYPE.no_L, value: BOOLEAN_TYPE.no_V, type: "warning" },
  undefined: { label: "--", type: "info" },
  null: { label: "--", type: "info" },
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
  LARGE: "1200px",
};

// !----------------------------------------------业务设置-------------------------------------------
// !----------------------------------------------业务设置-------------------------------------------
// !----------------------------------------------业务设置-------------------------------------------

// !-----------------------------------------------------------------------------------------------
// !---------------------------------------------- 民族 -------------------------------------------
// !-----------------------------------------------------------------------------------------------

/** 民族 */
export const NATION_TYPE = [
  { label: "汉族", value: "汉族" },
  { label: "阿昌族", value: "阿昌族" },
  { label: "鄂温克族", value: "鄂温克族" },
  { label: "傈僳族", value: "傈僳族" },
  { label: "水族", value: "水族" },
  { label: "白族", value: "白族" },
  { label: "高山族", value: "高山族" },
  { label: "珞巴族", value: "珞巴族" },
  { label: "塔吉克族", value: "塔吉克族" },
  { label: "保安族", value: "保安族" },
  { label: "仡佬族", value: "仡佬族" },
  { label: "满族", value: "满族" },
  { label: "塔塔尔族", value: "塔塔尔族" },
  { label: "布朗族", value: "布朗族" },
  { label: "哈尼族", value: "哈尼族" },
  { label: "毛南族", value: "毛南族" },
  { label: "土家族", value: "土家族" },
  { label: "布依族", value: "布依族" },
  { label: "哈萨克族", value: "哈萨克族" },
  { label: "门巴族", value: "门巴族" },
  { label: "土族", value: "土族" },
  { label: "朝鲜族", value: "朝鲜族" },
  { label: "蒙古族", value: "蒙古族" },
  { label: "佤族", value: "佤族" },
  { label: "达斡尔族", value: "达斡尔族" },
  { label: "赫哲族", value: "赫哲族" },
  { label: "苗族", value: "苗族" },
  { label: "维吾尔族", value: "维吾尔族" },
  { label: "傣族", value: "傣族" },
  { label: "回族", value: "回族" },
  { label: "仫佬族", value: "仫佬族" },
  { label: "乌孜别克族", value: "乌孜别克族" },
  { label: "德昂族", value: "德昂族" },
  { label: "基诺族", value: "基诺族" },
  { label: "纳西族", value: "纳西族" },
  { label: "锡伯族", value: "锡伯族" },
  { label: "东乡族", value: "东乡族" },
  { label: "京族", value: "京族" },
  { label: "怒族", value: "怒族" },
  { label: "瑶族", value: "瑶族" },
  { label: "侗族", value: "侗族" },
  { label: "景颇族", value: "景颇族" },
  { label: "普米族", value: "普米族" },
  { label: "彝族", value: "彝族" },
  { label: "独龙族", value: "独龙族" },
  { label: "柯尔克孜族", value: "柯尔克孜族" },
  { label: "羌族", value: "羌族" },
  { label: "裕固族", value: "裕固族" },
  { label: "俄罗斯族", value: "俄罗斯族" },
  { label: "拉祜族", value: "拉祜族" },
  { label: "撒拉族", value: "撒拉族" },
  { label: "藏族", value: "藏族" },
  { label: "鄂伦春族", value: "鄂伦春族" },
  { label: "黎族", value: "黎族" },
  { label: "畲族", value: "畲族" },
  { label: "壮族", value: "壮族" },
];

// !-----------------------------------------------------------------------------------------------
// !-----------------------------------------------用户标识----------------------------------------
// !-----------------------------------------------------------------------------------------------
/** 用户标识 1-员工 2-部门经理 3-公司经理室 4-派遣人员 5-借调人员 6-客户  7-上级单位 8-实习生 9-外包人员 10-部门副经理 11-技术运营中心*/
export const USER_TYPE = {
  type01_L: "员工",
  type01_V: 1,
  type02_L: "部门经理",
  type02_V: 2,
  type03_L: "公司经理室",
  type03_V: 3,
  type04_L: "派遣人员",
  type04_V: 4,
  type05_L: "借调人员",
  type05_V: 5,
  type06_L: "客户",
  type06_V: 6,
  type07_L: "上级单位",
  type07_V: 7,
  type08_L: "实习生",
  type08_V: 8,
  type09_L: "外包人员",
  type09_V: 9,
  type10_L: "部门副经理",
  type10_V: 10,
  type11_L: "技术运营中心",
  type11_V: 11,
};
/** 用户标识 1-员工 2-部门经理 3-公司经理室 4-派遣人员 5-借调人员 6-客户  7-上级单位 8-实习生 9-外包人员 10-部门副经理 11-技术运营中心*/
export const USER_OPTIONS = [
  { label: USER_TYPE.type01_L, value: USER_TYPE.type01_V, type: "info" },
  { label: USER_TYPE.type02_L, value: USER_TYPE.type02_V, type: "info" },
  { label: USER_TYPE.type03_L, value: USER_TYPE.type03_V, type: "info" },
  { label: USER_TYPE.type04_L, value: USER_TYPE.type04_V, type: "info" },
  { label: USER_TYPE.type05_L, value: USER_TYPE.type05_V, type: "info" },
  { label: USER_TYPE.type06_L, value: USER_TYPE.type06_V, type: "info" },
  { label: USER_TYPE.type07_L, value: USER_TYPE.type07_V, type: "info" },
  { label: USER_TYPE.type08_L, value: USER_TYPE.type08_V, type: "info" },
  { label: USER_TYPE.type09_L, value: USER_TYPE.type09_V, type: "info" },
  { label: USER_TYPE.type10_L, value: USER_TYPE.type10_V, type: "info" },
  { label: USER_TYPE.type11_L, value: USER_TYPE.type11_V, type: "info" },
];
/** 用户标识 1-员工 2-部门经理 3-公司经理室 4-派遣人员 5-借调人员 6-客户  7-上级单位 8-实习生 9-外包人员 10-部门副经理 11-技术运营中心*/
export const USER_MAP = {
  1: { label: USER_TYPE.type01_L, value: USER_TYPE.type01_V, type: "info" },
  2: { label: USER_TYPE.type02_L, value: USER_TYPE.type02_V, type: "info" },
  3: { label: USER_TYPE.type03_L, value: USER_TYPE.type03_V, type: "info" },
  4: { label: USER_TYPE.type04_L, value: USER_TYPE.type04_V, type: "info" },
  5: { label: USER_TYPE.type05_L, value: USER_TYPE.type05_V, type: "info" },
  6: { label: USER_TYPE.type06_L, value: USER_TYPE.type06_V, type: "info" },
  7: { label: USER_TYPE.type07_L, value: USER_TYPE.type07_V, type: "info" },
  8: { label: USER_TYPE.type08_L, value: USER_TYPE.type08_V, type: "info" },
  9: { label: USER_TYPE.type09_L, value: USER_TYPE.type09_V, type: "info" },
  10: { label: USER_TYPE.type10_L, value: USER_TYPE.type10_V, type: "info" },
  11: { label: USER_TYPE.type11_L, value: USER_TYPE.type11_V, type: "info" },
  undefined: { label: "--", type: "info" },
  null: { label: "--", type: "info" },
};
export const _USER_OPTIONS = [
  { label: USER_TYPE.type01_L, value: USER_TYPE.type01_V, type: "info" },
  { label: USER_TYPE.type02_L, value: USER_TYPE.type02_V, type: "info" },
  { label: USER_TYPE.type03_L, value: USER_TYPE.type03_V, type: "info" },
  { label: USER_TYPE.type10_L, value: USER_TYPE.type10_V, type: "info" },
  { label: USER_TYPE.type11_L, value: USER_TYPE.type11_V, type: "info" },
];
// !-----------------------------------------------------------------------------------------------
// !-----------------------------------------------部门类型----------------------------------------
// !-----------------------------------------------------------------------------------------------
/**
 * @description 部门类型
 * @param {string} 01-JY 技术运营中心
 * @param {string} 02-ZH 综合管理部
 * @param {string} 03-CW 财务部
 * @param {string} 04-JL 公司经理室
 * @param {string} 05-ELSE 其他部门
 */
export const DEPT_TYPE = {
  label_01: "技术运营中心",
  value_01: "JY",
  label_02: "综合管理部",
  value_02: "ZH",
  label_03: "财务部",
  value_03: "CW",
  label_04: "公司经理室",
  value_04: "JL",
  label_05: "其他部门",
  value_05: "ELSE",
};
export const DEPT_TYPE_OPTIONS = [
  { label: DEPT_TYPE.label_01, value: DEPT_TYPE.value_01, type: "info" },
  { label: DEPT_TYPE.label_02, value: DEPT_TYPE.value_02, type: "info" },
  { label: DEPT_TYPE.label_03, value: DEPT_TYPE.value_03, type: "info" },
  { label: DEPT_TYPE.label_04, value: DEPT_TYPE.value_04, type: "info" },
  { label: DEPT_TYPE.label_05, value: DEPT_TYPE.value_05, type: "info" },
];
export const DEPT_TYPE_MAP = {
  JY: { label: DEPT_TYPE.label_01, value: DEPT_TYPE.value_01, type: "info" },
  ZH: { label: DEPT_TYPE.label_02, value: DEPT_TYPE.value_02, type: "info" },
  CW: { label: DEPT_TYPE.label_03, value: DEPT_TYPE.value_03, type: "info" },
  JL: { label: DEPT_TYPE.label_04, value: DEPT_TYPE.value_04, type: "info" },
  ELSE: { label: DEPT_TYPE.label_05, value: DEPT_TYPE.value_05, type: "info" },
  undefined: { label: "--", type: "info" },
  null: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !--------------------------------------- 审批状态 ----------------------------------------------
// !-----------------------------------------------------------------------------------------------
/** -审批状态：0、暂存(草稿)，1、待审，2、审批通过(发布)，3、驳回（驳回到审批节点），4、无需审核，5、已驳回（驳回到发起人） */
export const AUDIT_STATUS_TYPE = {
  label0: "未提交",
  value0: 0,
  label1: "审批中",
  value1: 1,
  label2: "已通过",
  value2: 2,
  label3: "已驳回",
  value3: 3,
  label4: "无需审核",
  value4: 4,
  label5: "已驳回",
  value5: 5,
};
export const FA_PIAO_AUDIT_STATUS_TYPE = {
  label0: "草稿",
  value0: 0,
  label1: "待审",
  value1: 1,
  label2: "发布",
  value2: 2,
  label3: "驳回",
  value3: 3,
  label4: "发布",
  value4: 4,
  label5: "驳回",
  value5: 5,
};
export const AUDIT_STATUS_OPTION = [
  { label: AUDIT_STATUS_TYPE.label0, value: AUDIT_STATUS_TYPE.value0, type: "info" },
  { label: AUDIT_STATUS_TYPE.label1, value: AUDIT_STATUS_TYPE.value1, type: "warning" },
  { label: AUDIT_STATUS_TYPE.label2, value: AUDIT_STATUS_TYPE.value2, type: "success" },
  { label: AUDIT_STATUS_TYPE.label3, value: AUDIT_STATUS_TYPE.value3, type: "danger" },
  { label: AUDIT_STATUS_TYPE.label4, value: AUDIT_STATUS_TYPE.value4, type: "success" },
  // 下拉选择3 查询 3或5
  // { label: AUDIT_STATUS_TYPE.label5, value: AUDIT_STATUS_TYPE.value5, type: "danger" }
];
export const _AUDIT_STATUS_OPTION = [
  { label: AUDIT_STATUS_TYPE.label0, value: AUDIT_STATUS_TYPE.value0, type: "info" },
  { label: AUDIT_STATUS_TYPE.label1, value: AUDIT_STATUS_TYPE.value1, type: "warning" },
  { label: AUDIT_STATUS_TYPE.label2, value: AUDIT_STATUS_TYPE.value2, type: "success" },
  { label: AUDIT_STATUS_TYPE.label3, value: AUDIT_STATUS_TYPE.value3, type: "danger" },
];
export const FA_PIAO_AUDIT_STATUS_OPTION = [
  { label: FA_PIAO_AUDIT_STATUS_TYPE.label1, value: FA_PIAO_AUDIT_STATUS_TYPE.value1, type: "warning" },
  { label: FA_PIAO_AUDIT_STATUS_TYPE.label2, value: FA_PIAO_AUDIT_STATUS_TYPE.value2, type: "success" },
  { label: FA_PIAO_AUDIT_STATUS_TYPE.label3, value: FA_PIAO_AUDIT_STATUS_TYPE.value3, type: "danger" },
];
export const AUDIT_STATUS_MAP = {
  0: { label: AUDIT_STATUS_TYPE.label0, value: AUDIT_STATUS_TYPE.value0, type: "info" },
  1: { label: AUDIT_STATUS_TYPE.label1, value: AUDIT_STATUS_TYPE.value1, type: "warning" },
  2: { label: AUDIT_STATUS_TYPE.label2, value: AUDIT_STATUS_TYPE.value2, type: "success" },
  3: { label: AUDIT_STATUS_TYPE.label3, value: AUDIT_STATUS_TYPE.value3, type: "danger" },
  4: { label: AUDIT_STATUS_TYPE.label4, value: AUDIT_STATUS_TYPE.value4, type: "success" },
  5: { label: AUDIT_STATUS_TYPE.label5, value: AUDIT_STATUS_TYPE.value5, type: "danger" },
  undefined: { label: "--", value: "", type: "info" },
  null: { label: "--", value: "", type: "info" },
};
// !-----------------------------------------------审批流程----------------------------------------------
/** 审批流程code */
export const WORKFLOW_CODE = "workflow.type";
/** 审批流程-类型为角色 */
export const IS_SUBMIT_USER_DEPT = {
  /** 具体部门 */
  value_null: null,
  /** 不关联部门 */
  value_0: 0,
  /** 发起人所在部门 */
  value_1: 1,
};
/** 审批流程-发起人所在部门 */
export const PROMOTER_DEPT = { name: "发起人所在部门", id: -998, label: "发起人所在部门", value: -998 };
/** 审批流程-不关联部门 */
export const ASSOCIATION_DEPT = { name: "不关联部门", id: -999, label: "不关联部门", value: -999 };

// !-----------------------------------------------------------------------------------------------
// !-----------------------------------------------审批流程类型信息----------------------------------------
// !-----------------------------------------------------------------------------------------------
/**
 * @description: 审批流程类型
 * @param {string } 01 项目登记
 * @param {string } 02 合同管理
 * @param {string } 03 开标计划
 * @param {string } 04 中标信息
 * @param {string } 05 投标报备
 * @param {string } 06 开票申请
 * @param {string } 07 发票确认
 * @param {string } 08 红票申请
 * @param {string } 09 保证金缴纳
 * @param {string } 10 保证金退款
 * @param {string } 11 报销申请
 * @param {string } 12 用印申请
 * @param {string } 13 请假申请
 * @param {string } 14 销假申请
 * @param {string } 15 车辆预算
 * @param {string } 16 车辆维修
 * @param {string } 17 录像下载
 * @param {string } 18 会议预定
 * @param {string } 19 文件编制
 * @param {string } 20 复评处理
 * @param {string } 21 招标终止处理
 * @param {string } 22 专家录入
 * @param {string } 23 收据申请
 * @param {string } 24 开标计划作废
 */
export const WORKFLOW_TYPE = {
  TYPE_01: "workflow.type.01", // 项目登记
  TYPE_02: "workflow.type.02", // 合同管理
  TYPE_03: "workflow.type.03", // 开标计划
  TYPE_04: "workflow.type.04", // 中标信息
  TYPE_05: "workflow.type.05", // 投标报备
  TYPE_06: "workflow.type.06", // 开票申请
  TYPE_07: "workflow.type.07", // 发票确认
  TYPE_08: "workflow.type.08", // 红票申请
  TYPE_09: "workflow.type.09", // 保证金缴纳
  TYPE_10: "workflow.type.10", // 保证金退款
  TYPE_11: "workflow.type.11", // 报销申请
  TYPE_12: "workflow.type.12", // 用印申请
  TYPE_13: "workflow.type.13", // 请假申请
  TYPE_14: "workflow.type.14", // 销假申请
  TYPE_15: "workflow.type.15", // 车辆预算
  TYPE_16: "workflow.type.16", // 车辆维修
  TYPE_17: "workflow.type.17", // 录像下载
  TYPE_18: "workflow.type.18", // 会议预定
  TYPE_19: "workflow.type.19", // 文件编制
  TYPE_20: "workflow.type.20", // 复评处理
  TYPE_21: "workflow.type.21", // 招标终止处理
  TYPE_22: "workflow.type.22", // 专家录入
  TYPE_23: "workflow.type.23", // 收据申请
  TYPE_24: "workflow.type.24", // 开标计划作废
};
/**
 * @description: 审批流程类型
 * @param {string } 01 角色条件过滤
 * @param {string } 02 部门条件过滤
 * @param {string } 03 对应审批类型过滤
 * @param {string } 04 对应审批数值过滤
 */
export const CONDITION_TYPE = {
  TYPE_01: "workflow.condition.01",
  TYPE_02: "workflow.condition.02",
  TYPE_03: "workflow.condition.03",
  TYPE_04: "workflow.condition.04",
};
// !-----------------------------------------------------------------------------------------------
// !-----------------------------------------------审批条件数值----------------------------------------
// !-----------------------------------------------------------------------------------------------
/** GT：指定人员；GTE：指定角色；EQ：多级负责人；LT：发起人自己(提交流程时才能确定)；LTE：小于等于 */
export const CONDITION_EQUAL_TYPE = {
  GT_L: "大于",
  GT_V: "GT",
  GTE_L: "大于等于",
  GTE_V: "GTE",
  EQ_L: "等于",
  EQ_V: "EQ",
  LT_L: "小于",
  LT_V: "LT",
  LTE_L: "小于等于",
  LTE_V: "LTE",
};
export const CONDITION_EQUAL_OPTIONS = [
  { label: CONDITION_EQUAL_TYPE.GT_L, value: CONDITION_EQUAL_TYPE.GT_V },
  { label: CONDITION_EQUAL_TYPE.GTE_L, value: CONDITION_EQUAL_TYPE.GTE_V },
  { label: CONDITION_EQUAL_TYPE.EQ_L, value: CONDITION_EQUAL_TYPE.EQ_V },
  { label: CONDITION_EQUAL_TYPE.LT_L, value: CONDITION_EQUAL_TYPE.LT_V },
  { label: CONDITION_EQUAL_TYPE.LTE_L, value: CONDITION_EQUAL_TYPE.LTE_V },
];
export const CONDITION_EQUAL_MAP = {
  GT: { label: CONDITION_EQUAL_TYPE.GT_L, value: CONDITION_EQUAL_TYPE.GT_V },
  GTE: { label: CONDITION_EQUAL_TYPE.GTE_L, value: CONDITION_EQUAL_TYPE.GTE_V },
  EQ: { label: CONDITION_EQUAL_TYPE.EQ_L, value: CONDITION_EQUAL_TYPE.EQ_V },
  LT: { label: CONDITION_EQUAL_TYPE.LT_L, value: CONDITION_EQUAL_TYPE.LT_V },
  LTE: { label: CONDITION_EQUAL_TYPE.LTE_L, value: CONDITION_EQUAL_TYPE.LTE_V },
  undefined: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !-----------------------------------------------审批流程状态信息----------------------------------------
// !-----------------------------------------------------------------------------------------------
/** 状态信息 */
export const WORKFLOW_STATUS_TYPE = {
  ENABLED_L: "开启",
  ENABLED_V: 1,
  DISABLED_L: "关闭",
  DISABLED_V: 0,
};
export const WORKFLOW_STATUS_OPTIONS = [
  { label: WORKFLOW_STATUS_TYPE.ENABLED_L, value: WORKFLOW_STATUS_TYPE.ENABLED_V, type: "info" },
  { label: WORKFLOW_STATUS_TYPE.DISABLED_L, value: WORKFLOW_STATUS_TYPE.DISABLED_V, type: "danger" },
];
export const WORKFLOW_STATUS_MAP = {
  1: { label: WORKFLOW_STATUS_TYPE.ENABLED_L, value: WORKFLOW_STATUS_TYPE.ENABLED_V, type: "success" },
  0: { label: WORKFLOW_STATUS_TYPE.DISABLED_L, value: WORKFLOW_STATUS_TYPE.DISABLED_V, type: "danger" },
  undefined: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !-----------------------------------------------审批人类型----------------------------------------
// !-----------------------------------------------------------------------------------------------
/** ，1、指定人员，2、指定角色，3、多级负责人，4、发起人自己(提交流程时才能确定) */
export const WORKFLOW_USER_TYPE = {
  USER_L: "指定人员",
  USER_V: 1,
  ROLE_L: "指定角色",
  ROLE_V: 2,
  MULTI_SPPROVERS_L: "多级负责人",
  MULTI_SPPROVERS_V: 3,
  OWNER_L: "发起人自己",
  OWNER_V: 4,
};
export const WORKFLOW_USER_OPTIONS = [
  { label: WORKFLOW_USER_TYPE.USER_L, value: WORKFLOW_USER_TYPE.USER_V },
  { label: WORKFLOW_USER_TYPE.ROLE_L, value: WORKFLOW_USER_TYPE.ROLE_V },
  { label: WORKFLOW_USER_TYPE.MULTI_SPPROVERS_L, value: WORKFLOW_USER_TYPE.MULTI_SPPROVERS_V },
  { label: WORKFLOW_USER_TYPE.OWNER_L, value: WORKFLOW_USER_TYPE.OWNER_V },
];
export const WORKFLOW_USER_MAP = {
  1: { label: WORKFLOW_USER_TYPE.USER_L, value: WORKFLOW_USER_TYPE.USER_V },
  2: { label: WORKFLOW_USER_TYPE.ROLE_L, value: WORKFLOW_USER_TYPE.ROLE_V },
  3: { label: WORKFLOW_USER_TYPE.MULTI_SPPROVERS_L, value: WORKFLOW_USER_TYPE.MULTI_SPPROVERS_V },
  4: { label: WORKFLOW_USER_TYPE.OWNER_L, value: WORKFLOW_USER_TYPE.OWNER_V },
  undefined: { label: "--", type: "info" },
};
// !-----------------------------------------------------------------------------------------------
// !------------------------------------------字典配置项查询编码-----------------------------------
// !-----------------------------------------------------------------------------------------------
/**
 * @description 父编码code
 * @param {string} user_tag 组织架构成员标识 目前没有使用上，使用的是common里面维护的
 * @param {string} seal_type 印章种类
 * @param {string} seal_use_type 用印类型
 * @param {string} ask_for_leave 请假类型
 * @param {string} enterprise_nature 企业性质(相对方)
 * @param {string} meeting.type 会议类型
 * @param {string} workflow.type.02.contract 合同类型
 * @param {string} workflow.type.11.reimburse 报销类型
 * @param {string} business_type 业务类别-合同
 * @param {string} business_project_type 业务类别-项目
 * @param {string} industry 所属行业-合同
 * @param {string} billType 开票申请-票据类型
 * @param {string} invoiceType 开票申请-开票类型
 * @param {string} depositPayMethod 保证金-付款方式
 * @param {string} bidding_method 招标方式
 * @param {string} entrustment_type 委托内容(项目)
 * @param {string} entrustment_zjzx_type 委托内容(项目-造价咨询类)
 * @param {string} engineering_type 专业工程类型(项目)
 * @param {string} todoType 待办事项类型
 */
export const DICT_PARAMS = {
  user_tag: "user_tag",
  seal_type: "seal_type",
  seal_use_type: "seal_use_type",
  ask_for_leave: "ask_for_leave",
  enterprise_nature: "enterprise_nature",
  meeting_type: "meeting.type",
  contract_type: "workflow.type.02.contract",
  reimburse_type: "workflow.type.11.reimburse",
  business_type: "business_type",
  business_project_type: "business_project_type",
  industry: "industry",
  feeType: "fee.type",
  billType: "bill.type",
  invoiceType: "invoice.type",
  depositPayMethod: "deposit.pay.method",
  bidding_method: "bidding_method",
  entrustment_type: "entrustment_type",
  entrustment_zjzx_type: "entrustment_zjzx_type",
  engineering_type: "engineering_type",
  todoType: "todo.type",
};
