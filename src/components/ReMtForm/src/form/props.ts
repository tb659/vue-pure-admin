import propTypes from "@/utils/propTypes";

export default {
  /** 行内 */
  inline: propTypes.bool.def(true),
  // 是否需要栅格布局
  isCol: propTypes.bool.def(true),
  // 是否自定义内容
  isCustom: propTypes.bool.def(false),
  // 表单数据对象
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  /** 生成Form的布局结构数组 */
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否自动设置placeholder
  autoSetPlaceholder: propTypes.bool.def(true),
  /** label位置 */
  labelPosition: propTypes.string.def("right"),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def("auto"),
  // 表单form宽度
  formWidth: propTypes.string.def("")
};
