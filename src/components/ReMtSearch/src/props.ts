import propTypes from "@/utils/propTypes";

export default {
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  /** 行内 */
  inline: propTypes.bool.def(true),
  /** 是否显示查询按钮 */
  showSearch: propTypes.bool.def(true),
  /** 是否显示重置按钮 */
  showReset: propTypes.bool.def(true),
  // 是否显示伸缩
  expand: propTypes.bool.def(false),
  // 伸缩的界限字段
  expandProp: propTypes.string.def(""),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def("auto"),
  // 表单form宽度
  formWidth: propTypes.string.def("200px"),
  // 底部按钮的对齐方式
  buttomPosition: propTypes.string.validate((v: string) => ["left", "center", "right"].includes(v)).def("center"),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ["inline", "bottom"].includes(v)).def("inline")
};
