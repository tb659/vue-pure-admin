import type { MenuData } from "@/api/system/menu/types";
import { ref, unref } from "vue";
import { useData } from "./data";
import { msg } from "@/utils/message";
import { cloneDeep } from "lodash-es";
import { listToTree } from "@/utils/tree";
import { menuApi } from "@/api/system/menu";
import { useTable } from "@/hooks/web/useTable";
import { formatMenuData } from "@/router/utils";
import { MENU_LINK_TYPE, MENU_TYPE } from "@/utils/common";

const { searchSchema, formSchema, tableColumns } = useData();

export function useHook() {
  const title = ref("菜单");
  const visible = ref(false);
  const loading = ref(false);

  const { register, tableObject, methods, elTableRef } = useTable<MenuData>({
    api: menuApi,
    pageOrList: "list",
    response: { list: "data" },
    afterRequest: afterRequest,
    noPagination: true
  });

  const operationList: TableOperation[] = [
    {
      label: "添加菜单",
      type: "primary",
      action: handleAddChild,
      hidden: row => row.type !== MENU_TYPE.F_V
    },
    {
      label: "添加按钮",
      type: "primary",
      action: handleAddChild,
      hidden: row => row.type !== MENU_TYPE.M_V
    },
    {
      label: "修改",
      type: "primary",
      action: handleEdit
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => delItem({ ids: id })
    }
  ];

  const { getList, setSearchParams, delItem, getSelections } = methods;

  getList();

  function afterRequest(list) {
    return listToTree(
      formatMenuData(list, false).map(v => {
        const item = {
          ...v,
          ...v.meta,
          name: v.meta?.title,
          path: v.frameType === MENU_LINK_TYPE.OUT_V ? v.meta.url : v.frameType === MENU_LINK_TYPE.IN_V ? v.meta.frameSrc : v.path
        };
        return item;
      })
    );
  }

  function handleAdd() {
    title.value = "添加菜单";
    tableObject.currentRow = null;
    formSchema.filter(v => v.prop === "parentId")[0].value = 0;
    formSchema.filter(v => v.prop === "type")[0].value = MENU_TYPE.F_V || 0;
    visible.value = true;
  }

  function handleAddChild(data) {
    title.value = "添加菜单";
    tableObject.currentRow = null;
    formSchema.filter(v => v.prop === "parentId")[0].value = data.id;
    formSchema.filter(v => v.prop === "type")[0].value =
      data.type === MENU_TYPE.F_V ? MENU_TYPE.M_V : data.type === MENU_TYPE.M_V ? MENU_TYPE.B_V : null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改菜单";
    tableObject.currentRow = data;
    visible.value = true;
  }

  async function handleDel() {
    const sels = await getSelections();
    const ids = sels.map(sel => sel.id);
    console.log(ids);
    delItem({ ids: { idList: ids }, multiple: true });
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    await write?.elFormRef?.validate(async isValid => {
      if (isValid) {
        loading.value = true;
        const data = cloneDeep((await write?.getFormData()) as MenuData);
        const meta = {
          title: data.name || "",
          icon: data.icon || "",
          visible: data.visible || true,
          keepAlive: data.keepAlive || false,
          showParent: data.showParent || false,
          rank: data.code,
          frameSrc: ""
        };
        if (data.frameType === MENU_LINK_TYPE.OUT_V) {
          data.name = data.path;
          data.path = `/${data.cname}`;
        } else if (data.frameType === MENU_LINK_TYPE.IN_V) {
          meta.frameSrc = data.path;
          data.path = `/${data.cname}`;
        }
        const reqData = {
          ...data,
          permissions: "0",
          note: JSON.stringify({
            component: data.component || "",
            cname: data.cname || "",
            path: data.path || "",
            redirect: data.redirect || "",
            frameType: data.frameType,
            note: data.note,
            meta
          })
        };
        let save;
        if (data.id) {
          save = "update";
        } else {
          save = "create";
          reqData.domain = "";
          reqData.defaultAssign = 1;
        }
        const res = await menuApi[save](reqData)
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
    });
  }

  return {
    title,
    visible,
    loading,
    formSchema,
    elTableRef,
    tableObject,
    searchSchema,
    tableColumns,
    operationList,
    register,
    handleAdd,
    handleDel,
    handleSubmit,
    setSearchParams
  };
}
