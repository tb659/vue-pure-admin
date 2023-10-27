import { ref, reactive, watch, computed, unref, nextTick } from "vue";
import { MtTable, TableExpose } from "@/components/ReMtTable";
import { ElTable, ElMessageBox } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { msg } from "@/utils/message";
import { cloneDeep, get } from "lodash-es";
import { textCopy } from "@/utils";

interface TableObject<T = any> {
  pageSize: number;
  currentPage: number;
  total: number;
  originList: T[];
  tableList: T[];
  params: any;
  loading: boolean;
  currentRow: Nullable<T>;
}

interface UseTableConfig {
  api: Object;
  pageOrList?: "page" | "list";
  interFace?: string;
  response?: {
    list?: string;
    total?: string;
  };
  props?: PureTableProps;
  overRequest?: Function;
  afterRequest?: Function;
  beforeRequest?: Function;
  afterDeleteBatch?: Function;
  noLoading?: boolean;
  noPagination?: boolean;
}

export const useTable = <T = any>(config: UseTableConfig) => {
  const tableObject = reactive<TableObject<T>>({
    // 页数
    pageSize: 10,
    // 当前页
    currentPage: 1,
    // 总条数
    total: 10,
    // 原始数据
    originList: [],
    // 表格数据
    tableList: [],
    // AxiosConfig 配置
    params: {},
    // 加载中
    loading: true,
    // 当前行的数据
    currentRow: null
  });

  const paramsObj = computed(() => {
    return {
      ...tableObject.params,
      size: tableObject.pageSize,
      page: tableObject.currentPage
    };
  });

  watch(
    () => tableObject.currentPage,
    () => {
      methods.getList();
    }
  );

  watch(
    () => tableObject.pageSize,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用 getList 方法
      if (tableObject.currentPage === 1) {
        methods.getList();
      } else {
        tableObject.currentPage = 1;
        methods.getList();
      }
    }
  );

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
    if (!table) {
      console.error("registered the table first please!");
    }
    return table;
  };

  const methods = {
    setProps: async (props: PureTableProps = {}) => {
      const table = await getTable();
      table?.setProps(props);
    },
    setColumn: async (columnProps: TableSetPropsType[]) => {
      const table = await getTable();
      table?.setColumn(columnProps);
    },
    getSelections: async () => {
      const table = await getTable();
      return (table?.selections || []) as T[];
    },
    // 与Search组件结合
    setSearchParams: async (data: Recordable) => {
      tableObject.currentPage = 1;
      tableObject.params = Object.assign(tableObject.params, {
        size: tableObject.pageSize,
        page: tableObject.currentPage,
        ...data
      });
      await methods.getList();
    },
    getList: async () => {
      if (config.noPagination) {
        delete paramsObj.value.page;
        delete paramsObj.value.size;
      }
      tableObject.loading = true;
      const api = config.api;
      if (api) {
        const interFace = config.interFace || config.pageOrList || "page";
        if (!interFace) return msg.error("接口请求方法错误");
        // 请求开始前的回调
        config.beforeRequest && config.beforeRequest(tableObject.params);
        if (!config.noLoading) {
          tableObject.loading = true;
        }
        const res = await (api[interFace] &&
          api[interFace](unref(paramsObj)).finally(() => {
            tableObject.loading = false;
          }));
        if (res) {
          let list = get(res || {}, config.response?.list || config.pageOrList === "list" ? "data" : "data.rows");
          if (!list) return msg.error("表格未获取正确的列表数组");
          tableObject.originList = cloneDeep(list);
          config.afterRequest && (list = await config.afterRequest(list));
          tableObject.tableList = list;
          tableObject.total = get(res || {}, (config.response?.total as string) || "data.total") || 0;
          // 请求结束后的回调
          await nextTick();
          config.overRequest && config.overRequest();
          console.log("---------表格数据----------", tableObject.tableList);
        }
      } else {
        msg.warning("请求没有 api ");
      }
    },
    // 删除数据
    delItem: async ({
      ids,
      info = transformI18n($t("common.delMessage")),
      title = transformI18n($t("common.delWarning")),
      multiple = false,
      message = true
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
          draggable: true
        }).then(async () => {
          await (multiple ? delDatas(ids) : delData(ids));
        });
      } else {
        await (multiple ? delDatas(ids) : delData(ids));
      }
    },
    // 启用
    enableItem: async (id: number, message = true) => {
      if (message) {
        ElMessageBox.confirm(transformI18n($t("common.enableMessage")), transformI18n($t("common.enableWarning")), {
          confirmButtonText: transformI18n($t("common.ok")),
          cancelButtonText: transformI18n($t("common.cancel")),
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }).then(async () => {
          await enableData(id);
        });
      } else {
        await enableData(id);
      }
    },
    // 禁用
    disableItem: async (id: number, message = true) => {
      if (message) {
        ElMessageBox.confirm(transformI18n($t("common.disableMessage")), transformI18n($t("common.disableWarning")), {
          confirmButtonText: transformI18n($t("common.ok")),
          cancelButtonText: transformI18n($t("common.cancel")),
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }).then(async () => {
          await disableData(id);
        });
      } else {
        await disableData(id);
      }
    },
    resetPasswordItem: async ({ data, info = "确定重置该用户的登录密码？", message = true }) => {
      if (message) {
        ElMessageBox.confirm(info, "重置密码", {
          type: "warning",
          cancelButtonText: "取消",
          confirmButtonText: "重置",
          confirmButtonClass: "msg-box-disable",
          dangerouslyUseHTMLString: true
        })
          .then(async () => {
            await resetPasswordData(data);
          })
          .catch(() => {});
      } else {
        await resetPasswordData(data);
      }
    }
  };

  // 声明的methods对象
  const delData = async (ids: string | number) => {
    const res = await config.api["deleteById"](ids);
    if (res) {
      msg.success(transformI18n($t("common.delSuccess")));
      // 计算出临界点
      const currentPage =
        (tableObject.total % tableObject.pageSize === 1 &&
          Math.ceil(tableObject.total % tableObject.pageSize) === tableObject.currentPage) ||
        tableObject.pageSize === 1
          ? tableObject.currentPage > 1
            ? tableObject.currentPage - 1
            : tableObject.currentPage
          : tableObject.currentPage;

      tableObject.currentPage = currentPage;
      await methods.getList();
    }
  };

  const delDatas = async (ids: Recordable) => {
    const res = await config.api["deleteBatch"](ids);
    if (res) {
      msg.success(transformI18n($t("common.delSuccess")));
      unref(elTableRef.value).clearSelection();
      // table && (table.selections = []);
      tableObject.currentPage = 1;
      config.afterDeleteBatch ? config.afterDeleteBatch() : await methods.getList();
    }
  };

  const enableData = async (id: number) => {
    const res = await config.api["enableById"](id);
    if (res) {
      msg.success(transformI18n($t("common.enableSuccess")));
      methods.getList();
    }
  };

  const disableData = async (id: number) => {
    const res = await config.api["disableApi"](id);
    if (res) {
      msg.success(transformI18n($t("common.disableSuccess")));
      await methods.getList();
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
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          textCopy(res.data);
        })
        .catch(() => {});
    }
  };
  config.props && methods.setProps(config.props);

  return {
    register,
    elTableRef,
    tableObject,
    methods
  };
};
