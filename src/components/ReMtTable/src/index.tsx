import type { ElTable } from "element-plus";
import { set } from "lodash-es";
import { deviceDetection, isBoolean, isFunction, useDark } from "@pureadmin/utils";
import { defineComponent, ref, computed, unref, watch, onMounted, type CSSProperties } from "vue";

import props from "./props";
import Renderer from "./renderer";
import { setIndex } from "./helper";
import { isNumber } from "@/utils/is";
import { getSlot } from "@/utils/tsxHelper";

export default defineComponent({
  name: "MtTable",
  props,
  emits: ["update:pageSize", "update:pageNumber", "register", "reload-data", "get-sels"],
  setup(props, { attrs, slots, emit, expose }) {
    /** element table 实例 */
    const elTableRef = ref<ComponentRef<typeof ElTable>>();

    const setTableIndex = computed(() => {
      return (indexFn: Function, reserveIndex: boolean, index: number, pageSize: number, pageNumber: number) => {
        const indexValue = setIndex(reserveIndex, index, pageSize, pageNumber);
        return isFunction(indexFn)
          ? indexFn(index, unref(getProps).data.length, indexValue)
          : setIndex(reserveIndex, index, pageSize, pageNumber);
      };
    });

    /** 合并后的props */
    const mergeProps = ref<MtTableProps>({});

    const getProps = computed(() => {
      const propsObj = { ...props };
      Object.assign(propsObj, unref(mergeProps));
      return propsObj;
    });

    /** 合并props */
    function setProps(props: MtTableProps = {}) {
      mergeProps.value = Object.assign(unref(mergeProps), props);
    }

    /** 设置Column */
    function setColumn(columnProps: TableSetProps[], columnsChildren?: TableColumn[]) {
      const { columns } = unref(getProps);
      for (const column of columnsChildren || columns) {
        for (const item of columnProps) {
          if (column.field === item.field) {
            set(column, item.path, item.value);
          } else if (column.children?.length) {
            setColumn(columnProps, column.children);
          }
        }
      }
    }

    /** 增加Column */
    function addColumn(column: TableColumn, index?: number) {
      const { columns } = unref(getProps);
      if (index !== void 0) {
        columns.splice(index, 0, column);
      } else {
        columns.push(column);
      }
    }

    /** 删除Column */
    function delColumn(field: string) {
      const { columns } = unref(getProps);
      const index = columns.findIndex(item => item.field === field);
      if (index > -1) {
        columns.splice(index, 1);
      }
    }

    const { isDark } = useDark();

    const pageSizeRef = ref(props.pageSize);

    const pageNumberRef = ref(props.pageNumber);

    const pagination = computed(() => {
      return Object.assign(
        {
          size: `${deviceDetection() ? "small" : "default"}`,
          background: false,
          pagerCount: 7,
          layout: `${deviceDetection() ? "" : "sizes, "}` + "prev, pager, next, jumper, ->, total",
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10,
          align: "right",
        },
        unref(getProps).pagination,
      );
    });

    /** 覆盖加载背景 */
    const convertLoadingConfig = computed(() => {
      const { loadingConfig, loading } = unref(getProps);
      if (!unref(loadingConfig) || !unref(loading)) return;
      const { text, spinner, svg, viewBox } = unref(loadingConfig);
      return {
        "element-loading-text": text,
        "element-loading-spinner": spinner,
        "element-loading-svg": svg,
        "element-loading-svg-view-box": viewBox,
      };
    });

    /** 加载背景 */
    const loadingBackground = computed(() => {
      const { loadingConfig, loading } = unref(getProps);
      if (!unref(loading)) return;
      return {
        "element-loading-background":
          (unref(loadingConfig)?.background ?? isDark.value) ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.45)",
      };
    });

    /** 分页样式 */
    const paginationStyle = computed((): CSSProperties => {
      return Object.assign(
        {
          width: "100%",
          margin: "16px 0",
          display: "flex",
          justifyContent:
            unref(pagination).align === "left" ? "flex-start" : unref(pagination).align === "center" ? "center" : "flex-end",
        },
        unref(pagination).style ?? {},
      );
    });

    /** 绑定 */
    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props };
      delete bindValue.columns;
      delete bindValue.data;
      return bindValue;
    });

    /** 已选择的数据 */
    const selections = ref<Recordable[]>([]);

    /** 是否显示选择标签tag */
    const showSelectionTags = computed(() => {
      const { selsTag, rowKey, labelKey } = unref(getProps);
      return selsTag && !!rowKey && !!labelKey;
    });

    /** 单选 */
    function handleCurrentChange(row: Recordable) {
      if (unref(getProps).highlightCurrentRow) {
        selections.value = [row];
        console.log("单选--------", selections.value);
        emit("get-sels", selections.value);
      }
    }

    /** 多选 */
    function selectionChange(selection: Recordable[]) {
      const { selsSingle } = unref(getProps);
      if (selsSingle) {
        // 单选
        if (selection.length === 0) {
          selections.value = selection;
        } else if (selection.length === 1) {
          selections.value = selection;
        } else {
          selections.value = [selection.pop()];
          // 同步表格
          selection.forEach(sels => elTableRef.value.toggleRowSelection(sels, undefined));
        }
        console.log("单选--------", selection, selections.value);
      } else {
        // 多选
        selections.value = selection;
        console.log("多选--------", selection, selections.value);
      }
      emit("get-sels", selections.value);
    }

    /** 关闭tag标签 */
    function handleClose(row, idx) {
      selections.value.splice(idx, 1);
      // 同步表格
      elTableRef.value.toggleRowSelection(row, undefined);
    }

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val;
      },
    );

    watch(
      () => unref(getProps).pageNumber,
      (val: number) => {
        pageNumberRef.value = val;
      },
    );

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit("update:pageSize", val);
      },
    );

    watch(
      () => pageNumberRef.value,
      (val: number) => {
        emit("update:pageNumber", val);
      },
    );

    watch(
      () => unref(getProps).loading,
      (val: boolean) => {
        emit("reload-data", val);
      },
    );

    expose({
      setProps,
      setColumn,
      addColumn,
      delColumn,
      elTableRef,
      selections,
    });

    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef);
      emit("register", tableRef?.$parent, elTableRef);
      const { selections } = unref(getProps);
      if (selections.length) {
        console.log("回填表格---------------------", selections);
        selectionChange(selections);
        selections.forEach(sels => elTableRef.value.toggleRowSelection(sels));
      }
    });

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps);
      // 渲染展开行
      return expand ? (
        <el-table-column type="expand" align={align} headerAlign={headerAlign}>
          {{
            default: (scope: TableColumnScope) => getSlot(slots, "expand", scope),
          }}
        </el-table-column>
      ) : undefined;
    };

    // const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
    //   const { align, headerAlign, showOverflowTooltip } = unref(getProps);
    //   return columnsChildren.map(column => {
    //     const props = { ...column };
    //     if (props.children) delete props.children;
    //     return (
    //       <el-table-column
    //         showOverflowTooltip={showOverflowTooltip}
    //         align={align}
    //         headerAlign={headerAlign}
    //         {...props}
    //         prop={column.field}
    //       >
    //         {{
    //           default: (scope: TableColumnScope) =>
    //             column.children && column.children.length
    //               ? renderTableColumns(column.children)
    //               : getSlot(slots, column.field, scope) || scope.row[column.field],
    //           header: getSlot(slots, `${column.field}-header`),
    //         }}
    //       </el-table-column>
    //     );
    //   });
    // };

    const renderColumn = (column: TableColumn, scope: TableColumnScope) => {
      const { operations, size } = unref(getProps);
      if (column.cellRenderer) {
        return (
          <Renderer
            render={column.cellRenderer}
            params={Object.assign(scope, {
              index: scope.$index,
              props,
              attrs,
              $props: unref(getProps),
            })}
          />
        );
      }
      if (isFunction(column.formatter)) {
        return column.formatter(scope.row, column, scope.row[column.field], scope.$index);
      }
      if (column.field === "operation") {
        return (
          <div>
            {unref(operations)
              .filter(column => !(isFunction(column.hidden) && column.hidden(scope.row)))
              .map((operation, index) => {
                return (
                  <el-button
                    key={index}
                    link
                    size={unref(size)}
                    disabled={isFunction(operation.disabled) && operation.disabled(scope.row)}
                    class="reset-margin mx-1"
                    v-auth={isFunction(operation.auth) ? operation.auth(scope.row) : operation.label}
                    type={operation.type || "primary"}
                    onclick={() => operation.action(scope.row)}
                  >
                    {operation.label}
                  </el-button>
                );
              })}
          </div>
        );
      }
      return (
        getSlot(slots, column.field, scope) ||
        (column.cellRenderer && (
          <Renderer render={column.cellRenderer} params={Object.assign(scope, { index: scope.$index, props, attrs })} />
        )) ||
        scope.row[column.field]
      );
    };
    const renderTableColumns = (columnsChildren?: TableColumn[], scope?: TableColumnScope) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        pageNumber,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        selectable,
      } = unref(getProps);
      return [renderTableExpand()].concat(
        (columnsChildren || columns)
          .filter(column => !(isFunction(column.hidden) && column.hidden(scope?.row)))
          .map(column => {
            const props = { ...column };
            if (props.children) delete props.children;

            if (isBoolean(props.hide) && props.hide) {
              return props.hide;
            }

            if (isFunction(props.hide) && props.hide(attrs)) {
              return props.hide(attrs);
            }

            if (column.type === "selection") {
              return <el-table-column type="selection" selectable={selectable} reserveSelection={reserveSelection} width="48" />;
            }

            if (column.type === "index") {
              return (
                <el-table-column
                  type="index"
                  index={
                    isNumber(column.index)
                      ? column.index
                      : index => setTableIndex.value(column.index, reserveIndex, index, pageSize, pageNumber)
                  }
                  align={column.align || align}
                  headerAlign={column.headerAlign || headerAlign}
                  label={column.label}
                  fixed={column.fixed}
                  width={column.width || "65px"}
                />
              );
            }

            return (
              <el-table-column
                showOverflowTooltip={showOverflowTooltip}
                align={align}
                headerAlign={headerAlign}
                {...props}
                prop={column.field}
                fixed={column.field === "operation" && deviceDetection() ? null : column.fixed}
              >
                {{
                  default: (scope: TableColumnScope) =>
                    column.children && column.children.length ? renderTableColumns(column.children) : renderColumn(column, scope),
                  header: () => getSlot(slots, `${column.field}-header`) || column.label,
                }}
              </el-table-column>
            );
          }),
      );
    };

    return () => (
      <div
        v-loading={unref(getProps).loading}
        class={unref(getProps).selsSingle ? "mt-table sels-single" : "mt-table"}
        style="width:100%"
        {...unref(loadingBackground)}
        {...unref(convertLoadingConfig)}
      >
        <el-table
          ref={elTableRef}
          data={unref(getProps).data}
          onSelection-change={selectionChange}
          onCurrent-change={handleCurrentChange}
          {...unref(getBindValue)}
        >
          {{
            default: () => renderTableColumns(),
            append: () => getSlot(slots, "append"),
            empty: () => slots.empty && slots.empty(),
          }}
        </el-table>
        {unref(getProps).pagination && unref(getProps).data.length ? (
          <el-pagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={pageNumberRef.value}
            class="pure-pagination"
            style={unref(paginationStyle)}
            {...unref(pagination)}
          />
        ) : undefined}
        {/* 罗列已选择 */}
        {unref(showSelectionTags) && unref(selections).length ? (
          <div class="mt-16px">
            已选择（{unref(selections).length}）：
            {unref(selections).map((row, idx) => (
              <el-tag
                style="margin: 2px 5px"
                closable={(unref(selections).length !== 1 && unref(getProps).selsSingle) || !unref(getProps).selsSingle}
                onClose={() => handleClose(row, idx)}
              >
                {getSlot(slots, "sels-tag", row) || row[unref(getProps).labelKey]}
              </el-tag>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
});
