import { ElTable } from "element-plus";
import { defineComponent, ref, computed, unref, watch, onMounted, CSSProperties } from "vue";
import { getSlot } from "@/utils/tsxHelper";
import props from "./props";
import { set } from "lodash-es";
import Renderer from "./renderer";
import { deviceDetection, isBoolean, isFunction, useDark } from "@pureadmin/utils";
import { setIndex } from "./helper";

export default defineComponent({
  name: "MtTable",
  props,
  emits: ["update:pageSize", "update:currentPage", "register", "get-list"],
  setup(props, { attrs, slots, emit, expose }) {
    /** element table 实例 */
    const elTableRef = ref<ComponentRef<typeof ElTable>>();

    const { isDark } = useDark();
    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef);
      emit("register", tableRef?.$parent, elTableRef);
    });

    const pageSizeRef = ref(props.pageSize);

    const currentPageRef = ref(props.currentPage);

    /** useTable传入的props */
    const outsideProps = ref<PureTableProps>({});

    /** 合并后的props */
    const mergeProps = ref<PureTableProps>({});

    const getProps = computed(() => {
      const propsObj = { ...props };
      Object.assign(propsObj, unref(mergeProps));
      return propsObj;
    });

    const setProps = (props: PureTableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props);
      outsideProps.value = props;
    };

    const setColumn = (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps);
      for (const column of columnsChildren || columns) {
        for (const item of columnProps) {
          if (column.prop === item.prop) {
            set(column, item.path, item.value);
          } else if (column.children?.length) {
            setColumn(columnProps, column.children);
          }
        }
      }
    };

    const pagination = computed(() => {
      return Object.assign(
        {
          small: deviceDetection(),
          background: false,
          pagerCount: 7,
          layout: `${deviceDetection() ? "" : "sizes, "}` + "prev, pager, next, jumper, ->, total",
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10,
          align: "right"
        },
        unref(getProps).pagination
      );
    });

    const convertLoadingConfig = computed(() => {
      const { loadingConfig, loading } = unref(getProps);
      if (!unref(loadingConfig) || !unref(loading)) return;
      const { text, spinner, svg, viewBox } = unref(loadingConfig);
      return {
        "element-loading-text": text,
        "element-loading-spinner": spinner,
        "element-loading-svg": svg,
        "element-loading-svg-view-box": viewBox
      };
    });

    const loadingBackground = computed(() => {
      const { loadingConfig, loading } = unref(getProps);
      if (!unref(loading)) return;
      return {
        "element-loading-background":
          unref(loadingConfig)?.background ?? isDark.value ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.45)"
      };
    });

    const paginationStyle = computed((): CSSProperties => {
      return Object.assign(
        {
          width: "100%",
          margin: "16px 0",
          display: "flex",
          justifyContent:
            unref(pagination).align === "left" ? "flex-start" : unref(pagination).align === "center" ? "center" : "flex-end"
        },
        unref(pagination).style ?? {}
      );
    });

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props };
      delete bindValue.columns;
      delete bindValue.data;
      return bindValue;
    });

    const selections = ref<Recordable[]>([]);

    const selectionChange = (selection: Recordable[]) => {
      selections.value = selection;
      console.log(selection);
    };

    const showSelectionTags = computed(() => {
      const { selsTag, objKey, labelKey } = unref(getProps);
      return selsTag && !!objKey && !!labelKey;
    });

    const handleClose = (row, idx) => {
      selections.value.splice(idx, 1);
      elTableRef.value.toggleRowSelection(row, undefined);
    };

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val;
      }
    );

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val;
      }
    );

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit("update:pageSize", val);
      }
    );

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit("update:currentPage", val);
      }
    );

    expose({
      setProps,
      setColumn,
      selections,
      elTableRef
    });

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps);
      // 渲染展开行
      return expand ? (
        <el-table-column type="expand" align={align} headerAlign={headerAlign}>
          {{
            default: (scope: TableColumnScope) => getSlot(slots, "expand", scope)
          }}
        </el-table-column>
      ) : undefined;
    };

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps);
      return columnsChildren.map(column => {
        const props = { ...column };
        if (props.children) delete props.children;
        return (
          <el-table-column
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={column.prop}
          >
            {{
              default: (scope: TableColumnScope) =>
                column.children && column.children.length
                  ? renderTableColumns(column.children)
                  : getSlot(slots, column.prop, scope) || scope.row[column.prop],
              header: getSlot(slots, `${column.prop}-header`)
            }}
          </el-table-column>
        );
      });
    };

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
              $props: unref(getProps)
            })}
          />
        );
      }
      if (column.prop === "operation") {
        return (
          <>
            {unref(operations)
              .filter(column => !(column.hidden && column.hidden(scope.row)))
              .map((operation, index) => {
                return (
                  <el-button
                    key={index}
                    link
                    size={unref(size)}
                    disabled={operation.disabled && operation.disabled(scope.row)}
                    class="reset-margin mx-1"
                    v-auth={operation.label}
                    type={operation.type || "primary"}
                    onclick={() => operation.action(scope.row)}
                  >
                    {operation.label}
                  </el-button>
                );
              })}
          </>
        );
      }
      return (
        getSlot(slots, column.prop, scope) ||
        (column.cellRenderer && (
          <Renderer render={column.cellRenderer} params={Object.assign(scope, { index: scope.$index, props, attrs })} />
        )) ||
        scope.row[column.prop]
      );
    };
    const renderTableColumns = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        selectable
      } = unref(getProps);
      return [renderTableExpand()].concat(
        (columnsChildren || columns).map(column => {
          const props = { ...column };
          if (props.children) delete props.children;
          if (isFunction(props.hide) && props.hide(attrs)) {
            return props.hide(attrs);
          }
          if (isBoolean(props.hide) && props.hide) {
            return props.hide;
          }
          return column.type === "selection" ? (
            <el-table-column type="selection" selectable={selectable} reserveSelection={reserveSelection} width="48" />
          ) : column.type === "index" ? (
            <el-table-column
              type="index"
              index={column.index || (index => setIndex(reserveIndex, index, pageSize, currentPage))}
              align={column.align || align}
              headerAlign={column.headerAlign || headerAlign}
              label={column.label}
              width="65px"
            />
          ) : (
            <el-table-column
              showOverflowTooltip={showOverflowTooltip}
              align={align}
              headerAlign={headerAlign}
              {...props}
              prop={column.prop}
              fixed={column.prop === "operation" && deviceDetection() ? null : column.fixed}
            >
              {{
                default: (scope: TableColumnScope) =>
                  column.children && column.children.length
                    ? renderTreeTableColumn(column.children)
                    : renderColumn(column, scope),
                header: () => getSlot(slots, `${column.prop}-header`) || column.label
              }}
            </el-table-column>
          );
        })
      );
    };

    return () => (
      <div
        v-loading={unref(getProps).loading}
        class="pure-table"
        style="width:100%"
        {...unref(loadingBackground)}
        {...unref(convertLoadingConfig)}
      >
        <el-table ref={elTableRef} data={unref(getProps).data} onSelection-change={selectionChange} {...unref(getBindValue)}>
          {{
            default: () => renderTableColumns(),
            append: () => getSlot(slots, "append"),
            empty: () => slots.empty && slots.empty()
          }}
        </el-table>
        {unref(getProps).pagination && unref(getProps).data.length ? (
          <el-pagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
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
  }
});
