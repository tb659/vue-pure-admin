import propTypes from "@/utils/propTypes";

export default {
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def("auto"),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ["inline", "bottom"].includes(v)).def("inline"),
  // 底部按钮的对齐方式
  buttonPosition: propTypes.string.validate((v: string) => ["left", "center", "right"].includes(v)).def("center"),
  /** 行内 */
  inline: propTypes.bool.def(true),
  // 是否去除空值项
  removeNoValueItem: propTypes.bool.def(true),
  /** 是否自动查询 */
  autoSearch: propTypes.bool.def(false),
  /** 是否显示查询按钮 */
  showSearch: propTypes.bool.def(true),
  /** 搜索loading */
  searchLoading: propTypes.bool.def(false),
  /** 是否显示重置按钮 */
  showReset: propTypes.bool.def(true),
  /** 重置loading */
  resetLoading: propTypes.bool.def(false),
  /** 是否显示导出按钮 */
  showExport: propTypes.bool.def(false),
  // 是否显示伸缩
  showExpand: propTypes.bool.def(false),
  // 初始是否伸缩
  expandInitVisible: propTypes.bool.def(false),
  // 伸缩的界限字段
  expandProp: propTypes.string.def(""),
  // 表单form宽度
  formWidth: propTypes.string.def("200px"),
};
