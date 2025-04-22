import { nextTick, ref, unref } from "vue";
import { useData } from "./data";
import { msg } from "@/utils/msg";
import { listToTree } from "@/utils/tree";
import { menuApi } from "@/api/system/menu";
import { useTable } from "@/hooks/web/useTable";
import { formatMenuData } from "@/router/utils";
import { MENU_LINK_TYPE, MENU_TYPE, MENU_TYPE_MAP, STATUS_TYPE } from "@/utils/constants";

const { searchSchema, formSchema, tableColumns, formMethods } = useData();

export function useHook() {
  const title = ref("菜单");
  const visible = ref(false);
  const loading = ref(false);

  const { tableRegister, tableState, tableMethods, elTableRef } = useTable<MenuData>({
    api: menuApi,
    pageOrList: "list",
    response: { list: "data" },
    afterRequest: afterRequest,
    noPagination: true,
  });

  const operationList: TableOperation[] = [
    {
      label: "添加菜单",
      type: "primary",
      action: handleAddChild,
      hidden: row => row.type !== MENU_TYPE.F_V,
    },
    {
      label: "添加按钮",
      type: "primary",
      action: handleAddChild,
      hidden: row => row.type !== MENU_TYPE.M_V,
    },
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => delItem({ ids: id }),
      disabled: ({ path }) => path === "/system/menu" || path === "/system",
    },
  ];

  const { getList, setSearchParams, delItem, getSelections } = tableMethods;

  getList();

  function afterRequest(list) {
    return listToTree(
      formatMenuData(list, false).map(v => {
        const item = {
          ...v,
          ...v.meta,
          name: v.meta?.title,
          path:
            v.frameType === MENU_LINK_TYPE.OUT_V ? v.meta.url : v.frameType === MENU_LINK_TYPE.IN_V ? v.meta.frameSrc : v.path,
        };
        return item;
      }),
    );
  }

  function handleAdd() {
    title.value = "添加菜单";
    tableState.currentRow = null;
    formSchema.filter(v => v.field === "parentId")[0].value = 0;
    formSchema.filter(v => v.field === "type")[0].value = MENU_TYPE.F_V || 0;
    visible.value = true;
    nextTick(() => initMenu(MENU_TYPE.F_V));
  }

  function handleAddChild(data) {
    title.value = "添加菜单";
    tableState.currentRow = null;
    const type = data.type === MENU_TYPE.F_V ? MENU_TYPE.M_V : data.type === MENU_TYPE.M_V ? MENU_TYPE.B_V : null;
    formSchema.filter(v => v.field === "parentId")[0].value = data.id;
    formSchema.filter(v => v.field === "type")[0].value = type;
    visible.value = true;
    nextTick(() => initMenu(type));
  }

  function handleEdit(data) {
    title.value = "修改菜单";
    tableState.currentRow = data;
    visible.value = true;
    nextTick(() => initMenu(data.type));
  }

  async function handleDel() {
    const sels = await getSelections();
    const ids = sels.map(sel => sel.id);
    console.log(ids);
    delItem({ ids: { idList: ids }, multiple: true });
  }

  /** 处理菜单label */
  function initMenu(type) {
    const label = MENU_TYPE_MAP[type].label;
    formMethods.setSchema([
      { field: "icon", path: "label", value: label + "图标" },
      { field: "name", path: "label", value: label + "名称" },
      { field: "name", path: "componentProps.placeholder", value: `请输入${label}` },
    ]);
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      if (formData.path === "/system" && formData.status === STATUS_TYPE.DISABLED_V) {
        return msg.warning("系统管理菜单禁止禁用");
      } else if (formData.path === "/system/menu" && formData.status === STATUS_TYPE.DISABLED_V) {
        return msg.warning("系统管理菜单禁止禁用");
      }
      let save;
      if (formData.id) {
        save = "update";
      } else {
        save = "create";
        formData.domain = "";
        formData.defaultAssign = 1;
      }
      loading.value = true;
      const res = await menuApi[save](formData)
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
      if (res) {
        visible.value = false;
        msg.success();
        getList();
      }
    }
  }

  return {
    title,
    visible,
    loading,
    formSchema,
    elTableRef,
    tableState,
    searchSchema,
    tableColumns,
    operationList,
    tableRegister,
    handleAdd,
    handleDel,
    handleSubmit,
    setSearchParams,
  };
}
