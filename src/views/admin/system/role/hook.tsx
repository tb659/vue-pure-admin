import { ref, unref } from "vue";
import { msg } from "@/utils/msg";
import { ElMessageBox } from "element-plus";
import { dictApi } from "@/api/system/dict";
import { roleApi } from "@/api/system/role";
import { useTable } from "@/hooks/web/useTable";
import { useUserStoreHook } from "@/store/modules/user";
import { ADMIN_DICT_EDIT_CODE, ADMIN_ROLE_EMBED, ADMIN_USER_ROOT } from "@/utils/constants";

export function useHook() {
  const title = ref("角色");
  const visible = ref(false);
  const loading = ref(false);
  const adminEditFlag = ref(false);

  const { tableRegister, tableState, tableMethods } = useTable<RoleData>({
    api: roleApi,
    pageOrList: "page",
    afterRequest: afterRequest,
  });

  const operationList: TableOperation[] = [
    {
      label: "修改",
      type: "primary",
      action: handleEdit,
      disabled: ({ embed }) => handleBtnDisabled(embed),
    },
    {
      label: "删除",
      type: "danger",
      action: ({ id }) => tableMethods.delItem({ ids: id }),
      disabled: ({ embed }) => handleBtnDisabled(embed),
    },
  ];

  const { getList, setSearchParams } = tableMethods;

  getList();

  async function afterRequest(list) {
    const role = list.filter(v => v.embed === ADMIN_ROLE_EMBED)[0];
    // 当前列表存在admin判断是否可以操作
    if (role) {
      const res = await dictApi.list<DictData[]>({ code: ADMIN_DICT_EDIT_CODE });
      if (res?.data?.length) {
        adminEditFlag.value = !res.data[0].status;
      }
    }
    return list;
  }

  function handleBtnDisabled(v) {
    return v === ADMIN_ROLE_EMBED ? adminEditFlag.value || useUserStoreHook().userInfo?.root !== ADMIN_USER_ROOT : false;
  }

  function handleAdd() {
    title.value = "添加角色";
    tableState.currentRow = null;
    visible.value = true;
  }

  function handleEdit(data) {
    title.value = "修改角色";
    tableState.currentRow = data;
    visible.value = true;
  }

  async function handleSubmit(writeRef) {
    const write = unref(writeRef);
    const formData = await write?.submit();
    if (formData) {
      ElMessageBox.confirm("确认保存？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          loading.value = true;
          const save = formData.id ? "update" : "create";
          const res = await roleApi[save](formData);
          loading.value = false;
          if (!res) return;
          visible.value = false;
          msg.success();
          getList();
        })
        .catch(() => {});
    }
  }

  return {
    title,
    visible,
    loading,
    tableState,
    operationList,
    tableRegister,
    handleAdd,
    handleSubmit,
    setSearchParams,
  };
}
