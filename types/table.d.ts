import type { VNode } from "vue";
import type { CSSProperties } from "vue";
import type { TableColumnCtx, SummaryMethod, ColumnStyle, ColumnCls, CellStyle, TreeNode, CellCls, Sort } from "element-plus";
declare global {
  type Size = "large" | "default" | "small";
  type Align = "left" | "center" | "right";
  type Effect = "dark" | "light";
  type Layout = "fixed" | "auto";

  type TableColumnSortOrders = "ascending" | "descending" | null;
  type TableColumnType = "selection" | "index" | "expand";
  type TableColumnSortable = false | true | "custom";
  type TableColumnFixed = true | "left" | "right";
  type TableColumnFilterPlacement =
    | "top-start"
    | "top-end"
    | "top"
    | "bottom-start"
    | "bottom-end"
    | "bottom"
    | "left-start"
    | "left-end"
    | "left"
    | "right-start"
    | "right-end"
    | "right";

  type FilterMethods = (value, row: any, column: TableColumnCtx<any>) => void;

  type RH = { column: TableColumnCtx<any>; $index: number };

  type LoadingConfig = {
    /** 显示在加载图标下方的加载文案 */
    text?: string;
    /** 自定义加载图标 */
    spinner?: string;
    /** 自定义 `svg` 加载图标 (与 `spinner` 相同) */
    svg?: string;
    /** 自定义 `svg` 加载图标的大小 */
    viewBox?: string;
    /** 背景遮罩的颜色 */
    background?: string;
  };

  /** 表格操作 */
  type TableOperation = {
    /** 文字文案 */
    label: string;
    /** 文字类型 */
    type?: "primary" | "success" | "warning" | "danger" | "info" | "text";
    /** 操作事件 */
    action?: Function;
    /** 隐藏事件 */
    hidden?: Function;
    /** 禁用事件 */
    disabled?: Function;
  };

  type TableSetPropsType = {
    prop: string;
    path: string;
    value: any;
  };

  type TableColumnScope = {
    row: Recordable;
    column: TableColumn;
    $index: number;
  } & Recordable;

  interface TableColumnRenderer extends TableColumnScope {
    index: number;
    props: PureTableProps;
    attrs: any;
  }

  /**
   * @description `element-plus` 的 `table` 中 `Table-column` 属性，未扩展
   * @see {@link https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7}
   */
  type ElTableColumn = {
    /** 显示的标题 */
    label?: string;
    /** 字段名称，对应列内容的字段名，也可以使用 `property` 属性 */
    prop?: string;
    /** 对应列的类型，如果设置了 `selection` 则显示多选框；如果设置了 `index` 则显示该行的索引（从 `1` 开始计算）；如果设置了 `expand` 则显示为一个可展开的按钮 */
    type?: TableColumnType;
    /** 如果设置了 `type=index`，可以通过传递 `index` 属性来自定义索引 */
    index?: number | ((index: number) => number);
    /** `column` 的 `key`， 如果需要使用 `filter-change` 事件，则需要此属性标识是哪个 `column` 的筛选条件 */
    columnKey?: string;
    /** 对应列的宽度 */
    width?: string | number;
    /** 对应列的最小宽度，对应列的最小宽度，与 `width` 的区别是 `width` 是固定的，`min-width` 会把剩余宽度按比例分配给设置了 `min-width` 的列 */
    minWidth?: string | number;
    /** 列是否固定在左侧或者右侧。`true` 表示固定在左侧 */
    fixed?: TableColumnFixed;
    /** 列标题 `Label` 区域渲染使用的 `Function` */
    renderHeader?: (data: RH) => VNode;
    /** 对应列是否可以排序， 如果设置为 `'custom'`，则代表用户希望远程排序，需要监听 `Table` 的 `sort-change `事件，默认值为 `false` */
    sortable?: TableColumnSortable;
    /** 指定数据按照哪个属性进行排序，仅当 `sortable` 设置为 `true` 的时候有效。应该如同 `Array.sort` 那样返回一个 `Number` */
    sortMethod?: (a: any, b: any) => number;
    /** 指定数据按照哪个属性进行排序，仅当 `sortable` 设置为 `true` 且没有设置 `sort-method` 的时候有效。如果 `sort-by` 为数组，则先按照第 `1` 个属性排序，如果第 `1` 个相等，再按照第 `2` 个排序，以此类推 */
    sortBy?: string | ((row: any, index: number) => string) | string[];
    /** 数据在排序时所使用排序策略的轮转顺序，仅当 `sortable` 为 `true` 时有效。需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序，默认值为 `['ascending', 'descending', null]` */
    sortOrders?: Array<TableColumnSortOrders>;
    /** 对应列是否可以通过拖动改变宽度（需要在 `el-table` 上设置 `border` 属性为真），默认值为 `true`  */
    resizable?: boolean;
    /** 用来格式化内容 */
    formatter?: (row: any, column: TableColumnCtx<any>, cellValue: any, index: number) => VNode | string;
    /** 当内容过长被隐藏时显示 `tooltip`，默认值为 `false` */
    showOverflowTooltip?: boolean;
    /** 对齐方式，默认值为 `left` */
    align?: Align;
    /** 表头对齐方式，若不设置该项，则使用表格的对齐方式 */
    headerAlign?: Align;
    /** 列的 `className` */
    className?: string;
    /** 当前列标题的自定义类名 */
    labelClassName?: string;
    /** 仅对 `type=selection` 的列有效，类型为 `Function`，`Function` 的返回值用来决定这一行的 `CheckBox` 是否可以勾选 */
    selectable?: (row: any, index: number) => boolean;
    /** 仅对 `type=selection` 的列有效，请注意，需指定 `row-key` 来让这个功能生效，默认值为 `false` */
    reserveSelection?: boolean;
    /** 数据过滤的选项，数组格式，数组中的元素需要有 `text` 和 `value` 属性。数组中的每个元素都需要有 `text` 和 `value` 属性 */
    filters?: Array<{ text: string; value: string }>;
    /** 过滤弹出框的定位 */
    filterPlacement?: TableColumnFilterPlacement;
    /** 数据过滤的选项是否多选，默认值为 `true` */
    filterMultiple?: boolean;
    /** 数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 `true` 就会显示 */
    filterMethod?: FilterMethods;
    /** 选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性 */
    filteredValue?: Array<any>;
  };

  /**
   * @description `element-plus` 的 `table` 中 `Table-column` 属性，已扩展，额外增加 `hide` 、`slot` 、`initHidden` 、`cellRenderer` 、`headerRenderer` 五个属性
   * @see {@link https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7}
   */
  interface TableColumn extends ElTableColumn {
    /** 是否隐藏 必须是个函数 */
    hidden?: CallableFunction;
    /** 自定义插槽 */
    slot?: string;
    /** 首次加载是否隐藏 */
    initHidden?: boolean;
    /** 多级表头，内部实现原理：嵌套 `el-table-column` */
    children?: TableColumn[];
    /** 自定义单元格渲染器 */
    cellRenderer?: (data: TableColumnRenderer) => VNode;
    /** 自定义头部渲染器 */
    headerRenderer?: (data: TableColumnRenderer) => VNode;
  }
  /**
   * @description `element-plus` 的 `table` 属性，未扩展
   * @see {@link https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7}
   */
  export type TableProps = {
    /** 显示的数据 */
    data?: Array<any>;
    /** `Table` 的高度，默认为自动高度。如果 `height` 为 `number` 类型，单位 `px`；如果 `height` 为 `string` 类型，则这个高度会设置为 `Table` 的 `style.height` 的值，`Table` 的高度会受控于外部样式 */
    height?: string | number;
    /** `Table` 的最大高度。合法的值为数字或者单位为 `px` 的高度 */
    maxHeight?: string | number;
    /** 是否为斑马纹 `table`，默认值为 `false` */
    stripe?: boolean;
    /** 是否带有纵向边框，默认值为 `false` */
    border?: boolean;
    /** `Table` 的尺寸 */
    size?: Size;
    // width?: string | number;
    /** 列的宽度是否自撑开，默认值为 `true` */
    fit?: boolean;
    /** 是否显示表头，默认值为 `true` */
    showHeader?: boolean;
    /** 是否要高亮当前行，默认值为 `false` */
    highlightCurrentRow?: boolean;
    /** 当前行的 `key` ，只写属性 */
    currentRowKey?: string | number;
    /** 行的 `className` 的回调方法，也可以使用字符串为所有行设置一个固定的 `className` */
    rowClassName?: ColumnCls<any>;
    /** 行的 `style` 的回调方法，也可以使用一个固定的 `Object` 为所有行设置一样的 `Style` */
    rowStyle?: ColumnStyle<any>;
    /** 单元格的 `className` 的回调方法，也可以使用字符串为所有单元格设置一个固定的 `className` */
    cellClassName?: CellCls<any>;
    /** 单元格的 `style` 的回调方法，也可以使用一个固定的 `Object` 为所有单元格设置一样的 `Style` */
    cellStyle?: CellStyle<any>;
    /** 表头行的 `className` 的回调方法，也可以使用字符串为所有表头行设置一个固定的 `className` */
    headerRowClassName?: ColumnCls<any>;
    /** 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style */
    headerRowStyle?: ColumnStyle<any>;
    /** 表头单元格的 `className` 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 `className` */
    headerCellClassName?: CellCls<any>;
    /** 表头单元格的 `style` 的回调方法，也可以使用一个固定的 `Object` 为所有表头单元格设置一样的 `Style` */
    headerCellStyle?: CellStyle<any>;
    /** 行数据的 `Key`，用来优化 `Table` 的渲染；在使用 `reserve-selection` 功能与显示树形数据时，该属性是必填的。类型为 `String` 时，支持多层访问：`user.info.id`，但不支持 `user.info[0].id`，此种情况请使用 `Function` */
    rowKey?: string | ((row: any) => string);
    /** 空数据时显示的文本内容， 也可以通过 `#empty` 插槽设置，默认值为 `No Data` */
    emptyText?: string;
    /** 是否默认展开所有行，当 `Table` 包含展开行存在或者为树形表格时有效，默认值为 `false` */
    defaultExpandAll?: boolean;
    /** 可以通过该属性设置 `Table` 目前的展开行，需要设置 `row-key` 属性才能使用，该属性为展开行的 `keys` 数组 */
    expandRowKeys?: any[];
    /** 默认的排序列的 `prop` 和顺序。它的 `prop` 属性指定默认的排序的列，`order` 指定默认排序的顺序，默认值为 `如果 prop 已配置, 同时 order 未配置, 那么 order 默认为升序` */
    defaultSort?: Sort;
    /** `tooltip effect` 属性，默认值为 `dark` */
    tooltipEffect?: Effect;
    /** 是否在表尾显示合计行，默认值为 `false` */
    showSummary?: boolean;
    /** 合计行第一列的文本，默认值为 `合计` */
    sumText?: string;
    /** 自定义的合计计算方法 */
    summaryMethod?: SummaryMethod<any>;
    // context?: Table<T>;
    /** 合并行或列的计算方法 */
    spanMethod?: (data: { row: any; rowIndex: number; column: TableColumnCtx<any>; columnIndex: number }) =>
      | number[]
      | {
          rowspan: number;
          colspan: number;
        }
      | undefined;
    /** 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 `true` ，则选中所有行；若为 `false` ，则取消选择所有行，默认值为 `true` */
    selectOnIndeterminate?: boolean;
    /** 展示树形数据时，树节点的缩进，默认值为 `16` */
    indent?: number;
    /** 是否懒加载子节点数据 */
    lazy?: boolean;
    /** 加载子节点数据的函数，`lazy` 为 `true` 时生效，函数第二个参数包含了节点的层级信息 */
    load?: (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void;
    /** 渲染嵌套数据的配置选项，默认值为 `{ hasChildren: 'hasChildren', children: 'children' }` */
    treeProps?: {
      hasChildren?: string;
      children?: string;
    };
    /** 设置表格单元、行和列的布局方式，默认值为 `fixed` */
    tableLayout?: Layout;
    /** 总是显示滚动条，默认值为 `false` */
    scrollbarAlwaysOn?: boolean;
    /** 确保主轴的最小尺寸，默认值为 `false` */
    flexible?: boolean;
  };

  /**
   * @description `element-plus` 的 `table` 属性，已扩展，额外增加 `columns` 、`align` 、`headerAlign` 、`showOverflowTooltip` 、`pagination` 、`paginationSmall` 六个属性
   * @see {@link https://element-plus.org/zh-CN/component/table.html#table-%E5%B1%9E%E6%80%A7}
   */
  interface PureTableProps extends TableProps {
    pageSize?: number;
    currentPage?: number;
    /** 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key） */
    reserveSelection?: boolean;
    /** 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip, */
    showOverflowTooltip?: boolean;
    /** 表头 */
    columns?: TableColumn[];
    /** 展开行 */
    expand?: boolean;
    /** 加载状态 */
    loading?: boolean;
    /** 表格加载配置 */
    loadingConfig?: LoadingConfig;
    /** 是否展示分页 */
    pagination?: PaginationProps | undefined;
    /** 是否叠加索引 */
    reserveIndex?: boolean;
    /** 对齐方式 */
    align?: Align;
    /** 表头对齐方式 */
    headerAlign?: Align;
    /** 操作按钮 */
    operations?: TableOperation[];
    /** 表格操作项折叠 */
    operationsFoldCount?: number;
  }

  interface PaginationProps {
    /** 总条目数，默认值 `0` `该属性为必填属性` */
    total: number;
    /** 每页显示条目个数，默认值 `5` `该属性为必填属性` */
    pageSize: number;
    /** 当前页数 `该属性为必填属性` */
    currentPage: number;
    /** 小分页 */
    small?: boolean;
    /** 是否为分页按钮添加背景色，默认值：`false` */
    background?: boolean;
    /** 每页显示条目数的初始值 */
    defaultPageSize?: number;
    /** 总页数 `total` 和 `page-count` 设置任意一个就可以达到显示页码的功能；如果要支持 `page-sizes` 的更改，则需要使用 `total` 属性 */
    pageCount?: number;
    /** 设置最大页码按钮数。页码按钮的数量，当总页数超过该值时会折叠 */
    pagerCount?: number;
    /** 当前页数的初始值 */
    defaultCurrentPage?: number;
    /** 组件布局，子组件名用逗号分隔，默认值 `"total, sizes, prev, pager, next, jumper"` */
    layout?: string;
    /** 每页显示个数选择器的选项设置，默认值 `[5, 10, 15, 20]` */
    pageSizes?: number[];
    /** 每页显示个数选择器的下拉框类名 */
    popperClass?: string;
    /** 替代图标显示的上一页文字 */
    prevText?: string;
    /** 替代图标显示的下一页文字 */
    nextText?: string;
    /** 是否禁用分页，默认值：`false` */
    disabled?: boolean;
    /** 只有一页时是否隐藏 */
    hideOnSinglePage?: boolean;
    /** 分页的对齐方式，默认值：`right` */
    align?: align;
    /** 自定义分页样式 */
    style?: CSSProperties;
    /** 自定义类名 */
    class?: string;
  }
}
