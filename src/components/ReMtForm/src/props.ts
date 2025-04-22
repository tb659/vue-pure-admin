import propTypes from "@/utils/propTypes";

export default {
  // 表单数据对象
  model: propTypes.object.def({}),
  /** 生成Form的布局结构数组 */
  schema: propTypes.oneOfType([]).def([]),
  /** 是否是搜索表单 */
  searchForm: propTypes.bool.def(false),
  /** 行内 */
  inline: propTypes.bool.def(true),
  // 是否需要栅格布局
  isCol: propTypes.bool.def(true),
  // 是否自定义内容
  isCustom: propTypes.bool.def(false),
  // 是否自动设置placeholder
  autoSetPlaceholder: propTypes.bool.def(true),
  /** label位置 */
  labelPosition: propTypes.string.def("right"),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def("auto"),
  // 表单form宽度
  formWidth: propTypes.string.def(""),
};
