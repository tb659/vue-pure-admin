import type { MtTable, TableExpose } from "@/components/ReMtTable";
import { type ElTable, ElMessageBox } from "element-plus";

import { cloneDeep, get } from "lodash-es";
import { ref, reactive, watch, computed, unref, nextTick } from "vue";

import { textCopy } from "@/utils";
import { msg } from "@/utils/msg";
import { transformI18n, $t } from "@/plugins/i18n";

interface TableState<T = any> {
  loading: boolean;
  total: number;
  pageSize: number;
  pageNumber: number;
  params: Recordable;
  initParams: Recordable;
  tableList: T[];
  originList: T[];
  currentRow: Nullable<T>;
}

interface UseTableConfig {
  api: object;
  pageOrList?: "page" | "list";
  interFace?: string;
  response?: {
    list?: string;
    total?: string;
  };
  props?: MtTableProps;
  overRequest?: Function;
  /** return list */
  afterRequest?: Function;
  beforeRequest?: Function;
  afterDeleteBatch?: Function;
  afterEnableBatch?: Function;
  afterDisableBatch?: Function;
  noLoading?: boolean;
  noPagination?: boolean;
}

export const useTable = <T = any>(config: UseTableConfig) => {
  const tableState = reactive<TableState<T>>({
    // 加载中
    loading: false,
    // 总条数
    total: 10,
    // 页数
    pageSize: 10,
    // 当前页
    pageNumber: 1,
    // 查询参数
    params: {},
    // 初始查询参数
    initParams: {},
    // 表格数据
    tableList: [],
    // 原始数据
    originList: [],
    // 当前行的数据
    currentRow: null,
  });

  const paramsObj = computed(() => {
    return {
      ...tableState.params,
      ...tableState.initParams,
      size: tableState.pageSize,
      page: tableState.pageNumber,
    };
  });

  /** 当前页码改变，请求数据 */
  watch(
    () => tableState.pageNumber,
    () => {
      methods.getList();
    },
  );

  /** 当前每页多少条改变，请求数据 */
  watch(
    () => tableState.pageSize,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用 getList 方法
      if (tableState.pageNumber === 1) {
        methods.getList();
      } else {
        tableState.pageNumber = 1;
        methods.getList();
      }
    },
  );

  // onMounted(() => {
  //   if (immediate) {
  //     methods.getList();
  //   }
  // });

  // Table实例
  const tableRef = ref<typeof MtTable & TableExpose>();

  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>();

  const register = (ref: typeof MtTable & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref;
    elTableRef.value = elRef;
  };

  const getTable = async () => {
    await nextTick();
    const table = unref(tableRef);
    !table && console.error("表格未注册，请先使用注册方法进行表格注册！");
    return table;
  };

  /** 一些内置的方法 */
  const methods: {
    setProps: (props: TableProps) => void;
    setColumn: (props: TableSetProps[]) => void;
    addColumn: (tableColumn: TableColumn, index?: number) => void;
    delColumn: (field: string) => void;
    getElTableExpose: () => void;
    setSearchParams: (data: Recordable) => void;
    getSelections: () => Promise<T[]>;
    setSelections: (selections: Recordable[]) => void;
    refresh: () => void;
    getList: () => void;
    delItem: (data: Recordable) => void;
    enableItem: (data: Recordable) => void;
    disableItem: (data: Recordable) => void;
    resetPasswordItem: (data: Recordable) => void;
  } = {
    /**
     * @description 设置table组件的props
     * @param props table组件的props
     */
    setProps: async (props: TableProps = {}) => {
      const table = await getTable();
      table?.setProps(props);
    },

    /**
     * @description 设置column
     * @param columnProps 需要设置的列
     */
    setColumn: async (columnProps: TableSetProps[]) => {
      const table = await getTable();
      table?.setColumn(columnProps);
    },

    /**
     * @description 新增column
     * @param tableColumn 需要新增数据
     * @param index 在哪里新增
     */
    addColumn: async (tableColumn: TableColumn, index?: number) => {
      const table = await getTable();
      table?.addColumn(tableColumn, index);
    },

    /**
     * @description 删除column
     * @param field 删除哪个数据
     */
    delColumn: async (field: string) => {
      const table = await getTable();
      table?.delColumn(field);
    },

    /**
     * @description 获取ElTable组件的实例
     * @returns ElTable instance
     */
    getElTableExpose: async () => {
      await getTable();
      return unref(elTableRef);
    },

    /**
     * @description 与Search组件结合
     * @param data 参数
     */
    setSearchParams: async (data: Recordable) => {
      console.log(data, tableState.params);
      tableState.pageNumber = 1;
      tableState.params = Object.assign(
        {},
        {
          ...tableState.initParams,
          size: tableState.pageSize,
          page: tableState.pageNumber,
          ...data,
        },
      );
      await methods.getList();
    },

    /**
     * @description 获取表格选中的数据
     * @return selections 表格选中的数据
     */
    getSelections: async () => {
      const table = await getTable();
      return (table?.selections || []) as T[];
    },

    /**
     * @description 设置表格选中的数据
     * @return selections 表格选中的数据
     */
    setSelections: async (selections, rowKey = "id") => {
      const table = await getTable();
      if (selections.length) {
        table.selections = table?.elTableRef.data.filter(
          item => selections.filter(select => item[rowKey] === select[rowKey]).length,
        );
        selections.forEach(select => {
          table?.elTableRef?.toggleRowSelection(select);
        });
      } else {
        table?.elTableRef?.clearSelection();
      }
    },

    /**
     * @description 刷新数据
     */
    refresh: () => {
      methods.getList();
    },

    /**
     * @description 请求数据
     */
    getList: async () => {
      if (config.noPagination) {
        delete paramsObj.value.page;
        delete paramsObj.value.size;
      }
      const api = config.api;
      if (api) {
        const interFace = config.interFace || config.pageOrList || "page";
        if (!interFace) return msg.error("接口请求方法错误");
        // 请求开始前的回调
        config.beforeRequest && config.beforeRequest(tableState.params);
        if (!config.noLoading) {
          tableState.loading = true;
        }
        const res = await (api[interFace] &&
          api[interFace](unref(paramsObj)).finally(() => {
            tableState.loading = false;
          }));
        if (res) {
          let list: any[] = get(res || {}, config.response?.list || config.pageOrList === "list" ? "data" : "data.rows");
          if (!list) return msg.error("表格未获取正确的列表数组");
          tableState.originList = cloneDeep(list);
          config.afterRequest && (list = await config.afterRequest(list));
          tableState.tableList = list;
          tableState.total = get(res || {}, (config.response?.total as string) || "data.total") || 0;
          // 请求结束后的回调
          await nextTick();
          config.overRequest && config.overRequest();
          // console.log("---------表格数据----------", tableState.tableList);
        }
      } else {
        // msg.warning("请求没有 api ");
        console.error("请求没有 api ");
      }
    },

    /**
     * @description: 删除数据
     * @param data 参数
     */
    delItem: async ({
      ids,
      info = transformI18n($t("common.delMessage")),
      title = transformI18n($t("common.delWarning")),
      multiple = false,
      message = true,
    }) => {
      const table = await getTable();
      if (multiple) {
        if (!table?.selections.length) {
          msg.warning(transformI18n($t("common.delNoData")));
          return;
        }
      }
      if (message) {
        ElMessageBox.confirm(info, title, {
          confirmButtonText: transformI18n($t("common.ok")),
          cancelButtonText: transformI18n($t("common.cancel")),
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true,
        }).then(async () => {
          await (multiple ? delDataList(ids) : delData(ids));
        });
      } else {
        await (multiple ? delDataList(ids) : delData(ids));
      }
    },

    /**
     * @description: 启用数据
     * @param id 需要启用的数据id
     * @param message 是否二次提醒
     * @return {*}
     */
    enableItem: async ({
      ids,
      infoKey = "",
      info = transformI18n($t("common.enableMessage")),
      title = transformI18n($t("common.delWarning")),
      multiple = false,
      message = true,
    }) => {
      const table = await getTable();
      if (multiple) {
        if (!table?.selections.length) {
          msg.warning(transformI18n($t("common.enableNoData")));
          return;
        }
      }
      if (message) {
        ElMessageBox.confirm(info, title, {
          confirmButtonText: transformI18n($t("common.ok")),
          cancelButtonText: transformI18n($t("common.cancel")),
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true,
        }).then(async () => {
          await (multiple ? enableDataList(ids, infoKey) : enableData(ids, infoKey));
        });
      } else {
        await (multiple ? enableDataList(ids, infoKey) : enableData(ids, infoKey));
      }
    },

    /**
     * @description: 禁用数据
     * @param id 需要禁用的数据id
     * @param message 是否二次提醒
     * @return {*}
     */
    disableItem: async ({
      ids,
      infoKey = "",
      info = transformI18n($t("common.disableMessage")),
      title = transformI18n($t("common.delWarning")),
      multiple = false,
      message = true,
    }) => {
      const table = await getTable();
      if (multiple) {
        if (!table?.selections.length) {
          msg.warning(transformI18n($t("common.disableNoData")));
          return;
        }
      }
      if (message) {
        ElMessageBox.confirm(info, title, {
          confirmButtonText: transformI18n($t("common.ok")),
          cancelButtonText: transformI18n($t("common.cancel")),
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true,
        }).then(async () => {
          await (multiple ? disableDataList(ids, infoKey) : disableData(ids, infoKey));
        });
      } else {
        await (multiple ? disableDataList(ids, infoKey) : disableData(ids, infoKey));
      }
    },

    /**
     * @description: 重置密码
     * @param data 参数
     * @return {*}
     */
    resetPasswordItem: async ({ data, info = transformI18n($t("common.changePasswordMessage")), message = true }) => {
      if (message) {
        ElMessageBox.confirm(info, "重置密码", {
          type: "warning",
          cancelButtonText: "取消",
          confirmButtonText: "重置",
          confirmButtonClass: "msg-box-disable",
          dangerouslyUseHTMLString: true,
        })
          .then(async () => {
            await resetPasswordData(data);
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        await resetPasswordData(data);
      }
    },
  };

  // 声明的methods对象
  const delData = async (id: string | number) => {
    const res = await config.api["deleteById"](id);
    if (res) {
      msg.success(transformI18n($t("common.delSuccess")));
      // 计算出临界点
      const pageNumber =
        (tableState.total % tableState.pageSize === 1 &&
          Math.ceil(tableState.total % tableState.pageSize) === tableState.pageNumber) ||
        tableState.pageSize === 1
          ? tableState.pageNumber > 1
            ? tableState.pageNumber - 1
            : tableState.pageNumber
          : tableState.pageNumber;

      tableState.pageNumber = pageNumber;
      await methods.getList();
    }
  };

  const enableData = async (id: number, infoKey = "") => {
    const res = await config.api["enableById"](id);
    if (res) {
      msg.success(infoKey || transformI18n($t("common.enableSuccess")));
      methods.getList();
    }
  };

  const disableData = async (id: number, infoKey = "") => {
    const res = await config.api["disableById"](id);
    if (res) {
      msg.success(infoKey || transformI18n($t("common.disableSuccess")));
      await methods.getList();
    }
  };

  const delDataList = async (data: Recordable) => {
    const res = await config.api["deleteBatch"](data);
    if (res) {
      msg.success(transformI18n($t("common.delSuccess")));
      unref(elTableRef.value).clearSelection();
      tableState.pageNumber = 1;
      config.afterDeleteBatch ? config.afterDeleteBatch() : await methods.getList();
    }
  };

  const enableDataList = async (data: Recordable, infoKey = "") => {
    const res = await config.api["enableBatch"](data);
    if (res) {
      msg.success(infoKey || transformI18n($t("common.enableSuccess")));
      unref(elTableRef.value).clearSelection();
      tableState.pageNumber = 1;
      config.afterEnableBatch ? config.afterEnableBatch() : await methods.getList();
    }
  };

  const disableDataList = async (data: Recordable, infoKey = "") => {
    const res = await config.api["disableBatch"](data);
    if (res) {
      msg.success(infoKey || transformI18n($t("common.disableSuccess")));
      unref(elTableRef.value).clearSelection();
      tableState.pageNumber = 1;
      config.afterDisableBatch ? config.afterDisableBatch() : await methods.getList();
    }
  };

  const resetPasswordData = async data => {
    const res = await config.api["resetPassword"](data);
    if (res) {
      ElMessageBox.confirm(`密码：${res.data}`, "重置成功！", {
        type: "warning",
        cancelButtonText: "确定",
        confirmButtonText: "复制",
        confirmButtonClass: "msg-box-disable",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          textCopy(res.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // config.props && methods.setProps(config.props);

  return {
    tableRegister: register,
    tableMethods: methods,
    elTableRef,
    tableState,
  };
};
