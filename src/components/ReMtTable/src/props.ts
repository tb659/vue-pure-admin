import type { CSSProperties } from "vue";
import propTypes from "@/utils/propTypes";

export default {
  pageSize: propTypes.number.def(10),
  currentPage: propTypes.number.def(1),
  /** 表格数据 */
  data: {
    type: Array as PropType<Recordable[]>,
    default: () => []
  },
  /** 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key） */
  reserveSelection: propTypes.bool.def(true),
  /** 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip, */
  showOverflowTooltip: propTypes.bool.def(true),
  /** 表头 */
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => []
  },
  /** 展开行 */
  expand: propTypes.bool.def(false),
  /** 是否展示分页 */
  pagination: {
    type: Object as PropType<PaginationProps>,
    default: (): PaginationProps | undefined => undefined
  },
  /** 加载状态 */
  loading: propTypes.bool.def(false),
  /** 表格加载配置 */
  loadingConfig: {
    type: Object,
    default: () => {}
  },
  /** 是否叠加索引 */
  reserveIndex: propTypes.bool.def(true),
  /** 对齐方式 */
  align: propTypes.string.validate((v: string) => ["left", "center", "right"].includes(v)).def("center"),
  /** 表头对齐方式 */
  headerAlign: propTypes.string.validate((v: string) => ["left", "center", "right"].includes(v)).def("center"),
  /** 表头样式 */
  headerCellStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({
      background: "var(--el-table-row-hover-bg-color)",
      color: "var(--el-text-color-primary)"
    })
  },
  size: propTypes.oneOf(["large", "default", "small"]).def("default"),
  /** 表格操作项 */
  operations: {
    type: Array as PropType<TableOperation[]>,
    default: () => []
  },
  /** 表格操作项折叠 */
  operationsFoldCount: propTypes.number.def(2),
  /** 表格边框 */
  border: propTypes.bool.def(false)
};
